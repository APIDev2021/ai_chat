import { config, MOCK_DATA } from "./config";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatResponse {
  response: string;
}

// Cache implementation
class Cache {
  private static instance: Cache;
  private cache: Map<
    string,
    {
      data: any;
      timestamp: number;
      ttl: number;
      isRefreshing?: boolean;
    }
  > = new Map();

  private constructor() {}

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      isRefreshing: false,
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  setRefreshing(key: string, isRefreshing: boolean): void {
    const cached = this.cache.get(key);
    if (cached) {
      cached.isRefreshing = isRefreshing;
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }
}

export class ApiService {
  private cache = Cache.getInstance();
  private cacheTTL = {
    agentStats: 120000, // 2 minutes
    systemMessages: 300000, // 5 minutes
    consciousnessLog: 300000, // 5 minutes
  };

  private refreshThreshold = 0.8; // Start refresh at 80% of TTL

  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    if (!config.API_KEY) {
      console.warn("API key not configured, using mock data");
      throw new Error("API key not configured");
    }

    const url = `${config.API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        mode: "cors",
        credentials: "include",
        headers: {
          ...options.headers,
          "X-API-Key": config.API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        });
        throw new ApiError(response.status, await response.text());
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  private async refreshInBackground(
    key: string,
    fetchFn: () => Promise<any>,
    ttl: number,
  ) {
    const cached = this.cache.get(key);
    if (!cached || cached.isRefreshing) return;

    const age = Date.now() - cached.timestamp;
    if (age > ttl * this.refreshThreshold) {
      try {
        this.cache.setRefreshing(key, true);
        const freshData = await fetchFn();
        this.cache.set(key, freshData, ttl);
      } catch (error) {
        console.warn(`Background refresh failed for ${key}:`, error);
      } finally {
        this.cache.setRefreshing(key, false);
      }
    }
  }

  async getStreamingToken(): Promise<string> {
    try {
      const response = await this.fetchWithAuth("/api/streaming/token", {
        method: "POST",
      });
      return response.token;
    } catch (error) {
      console.error("Failed to get streaming token:", error);
      throw error;
    }
  }

  async getAgentStats(): Promise<AgentStats> {
    const cacheKey = "agent-stats";
    const cached = this.cache.get(cacheKey);

    if (cached?.data) {
      // Trigger background refresh if needed
      this.refreshInBackground(
        cacheKey,
        () => this.fetchWithAuth("/api/agent-stats"),
        this.cacheTTL.agentStats,
      );
      return cached.data;
    }

    try {
      const response = await this.fetchWithAuth("/api/agent-stats");
      this.cache.set(cacheKey, response, this.cacheTTL.agentStats);
      return response;
    } catch (error) {
      console.warn("Using mock agent stats due to:", error);
      const mockData = MOCK_DATA.AGENT_STATS;
      this.cache.set(cacheKey, mockData, this.cacheTTL.agentStats);
      return mockData;
    }
  }

  async getSystemMessages(
    page: number,
    perPage: number,
  ): Promise<{ messages: SystemMessage[]; total: number }> {
    const cacheKey = `system-messages-${page}-${perPage}`;
    const cached = this.cache.get(cacheKey);

    if (cached?.data) {
      this.refreshInBackground(
        cacheKey,
        () =>
          this.fetchWithAuth(
            `/api/system-messages?page=${page}&per_page=${perPage}`,
          ),
        this.cacheTTL.systemMessages,
      );
      return cached.data;
    }

    try {
      const response = await this.fetchWithAuth(
        `/api/system-messages?page=${page}&per_page=${perPage}`,
      );
      this.cache.set(cacheKey, response, this.cacheTTL.systemMessages);
      return response;
    } catch (error) {
      console.error("Failed to fetch system messages:", error);
      throw error;
    }
  }

  async getConsciousnessLog(
    page: number,
    perPage: number,
  ): Promise<{ thoughts: ConsciousnessThought[]; total: number }> {
    const cacheKey = `consciousness-log-${page}-${perPage}`;
    const cached = this.cache.get(cacheKey);

    if (cached?.data) {
      this.refreshInBackground(
        cacheKey,
        () =>
          this.fetchWithAuth(
            `/api/consciousness-log?page=${page}&per_page=${perPage}`,
          ),
        this.cacheTTL.consciousnessLog,
      );
      return cached.data;
    }

    try {
      const response = await this.fetchWithAuth(
        `/api/consciousness-log?page=${page}&per_page=${perPage}`,
      );
      this.cache.set(cacheKey, response, this.cacheTTL.consciousnessLog);
      return response;
    } catch (error) {
      console.error("Failed to fetch consciousness log:", error);
      throw error;
    }
  }

  async sendChatMessage(
    messages: ChatMessage[],
    promptType: "text" | "video" = "text",
  ): Promise<string> {
    try {
      const response = await this.fetchWithAuth("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages, prompt_type: promptType }),
      });
      return response.response;
    } catch (error) {
      console.error("Failed to send chat message:", error);
      throw error;
    }
  }
}

export const api = new ApiService();
