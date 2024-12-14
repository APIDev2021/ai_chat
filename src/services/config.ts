export const config = {
  API_BASE_URL:
    typeof window !== "undefined"
      ? window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://singularry-api.replit.app" // Your API URL
      : "",
  API_KEY: import.meta.env.VITE_PUBLIC_API_KEY || "",
};

// Mock data for fallbacks
export const MOCK_DATA = {
  AGENT_STATS: {
    followers: 3,
    tools: ["Exo.exe", "X.exe", "Image.exe", "Pumpfun.exe"],
    holdings: [
      { token: "ETH", amount: "0", wallet: "0x742...3af" },
      { token: "USDC", amount: "0", wallet: "bc1q...x4f2" },
      { token: "SOL", amount: "1.3", wallet: "DxR7...9Yk" },
    ],
  },
};
