import { PublicKey, Connection, ConnectionConfig } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

const TOKEN_MINT = new PublicKey(
  "HwKE9CPg9Z9WzAeQSj6jeLBizK7LJs5m6LTVx6pLpump",
);

interface TokenBalance {
  hasToken: boolean;
  balance: number;
}

// Connection configuration with better timeout and commitment settings
const connectionConfig: ConnectionConfig = {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 60000,
  disableRetryOnRateLimit: false,
  httpHeaders: {
    "Content-Type": "application/json",
  },
};

// Create connection instance with better config
const connection = new Connection(
  `https://solana-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
  connectionConfig,
);

// Improved retry logic with exponential backoff and better error handling
async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = 5,
  initialDelay = 500,
): Promise<T> {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Check if error is fatal and shouldn't be retried
      if (
        error.message?.includes("Invalid public key") ||
        error.message?.includes("Invalid address") ||
        error.message?.includes("unauthorized")
      ) {
        throw error;
      }

      if (i < retries - 1) {
        // Exponential backoff with jitter
        const delay = initialDelay * Math.pow(2, i) + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(
    `Operation failed after ${retries} attempts: ${lastError?.message}`,
  );
}

// Batch processing helper for multiple token checks
async function batchGetTokenAccounts(publicKeys: PublicKey[]) {
  const accounts = await connection.getMultipleAccountsInfo(publicKeys, {
    commitment: "confirmed",
  });
  return accounts;
}

// Main token balance checking function with improved error handling
export const checkTokenBalance = async (
  walletPublicKey: PublicKey | null,
): Promise<TokenBalance> => {
  try {
    if (!walletPublicKey || !(walletPublicKey instanceof PublicKey)) {
      return { hasToken: false, balance: 0 };
    }

    const makeRequest = async () => {
      try {
        // Get the associated token account address
        const tokenAccount = await getAssociatedTokenAddress(
          TOKEN_MINT,
          walletPublicKey,
          true, // allowOwnerOffCurve = true for better compatibility
        );

        const accountInfo =
          await connection.getTokenAccountBalance(tokenAccount);
        const balance = Number(accountInfo.value.uiAmountString || 0);

        return {
          hasToken: balance > 0,
          balance,
        };
      } catch (error: any) {
        if (error.message?.includes("could not find account")) {
          return { hasToken: false, balance: 0 };
        }

        // Handle rate limiting specifically
        if (error.message?.includes("rate limit")) {
          throw new Error("Rate limit exceeded. Retrying...");
        }

        // Handle other specific error cases
        if (error.message?.includes("failed to get token account balance")) {
          return { hasToken: false, balance: 0 };
        }

        throw error;
      }
    };

    return await retryOperation(makeRequest);
  } catch (error) {
    console.error("Failed to check token balance:", error);
    throw new Error(
      `Token balance check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Improved cache implementation with error states and automatic cleanup
interface CacheEntry {
  timestamp: number;
  data: TokenBalance;
  error?: string;
  attempts: number;
}

class TokenBalanceCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 30000; // 30 seconds
  private readonly MAX_ATTEMPTS = 3;

  constructor() {
    // Cleanup stale cache entries periodically
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  async get(walletPublicKey: PublicKey | null): Promise<TokenBalance> {
    if (!walletPublicKey) {
      return { hasToken: false, balance: 0 };
    }

    const key = walletPublicKey.toString();
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached result if valid
    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      if (cached.error && cached.attempts < this.MAX_ATTEMPTS) {
        // If there was an error but we haven't maxed out attempts, try again
        return this.refresh(walletPublicKey);
      }
      return cached.data;
    }

    return this.refresh(walletPublicKey);
  }

  private async refresh(walletPublicKey: PublicKey): Promise<TokenBalance> {
    const key = walletPublicKey.toString();
    const existing = this.cache.get(key);

    try {
      const result = await checkTokenBalance(walletPublicKey);
      this.cache.set(key, {
        timestamp: Date.now(),
        data: result,
        attempts: 0,
      });
      return result;
    } catch (error) {
      const attempts = (existing?.attempts || 0) + 1;
      this.cache.set(key, {
        timestamp: Date.now(),
        data: { hasToken: false, balance: 0 },
        error: error instanceof Error ? error.message : "Unknown error",
        attempts,
      });
      throw error;
    }
  }
}

// Export singleton cache instance
export const tokenBalanceCache = new TokenBalanceCache();

// Export cached balance checker
export const getCachedTokenBalance = (
  walletPublicKey: PublicKey | null,
): Promise<TokenBalance> => {
  return tokenBalanceCache.get(walletPublicKey);
};
