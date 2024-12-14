import { useEffect, useState } from "react";
import { Users, Wrench, Wallet } from "lucide-react";
import { api, AgentStats as AgentStatsType } from "../services/api";

function AgentStats() {
  const [stats, setStats] = useState<AgentStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getAgentStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load agent stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  if (loading) {
    return (
      <div className="border border-green-500/30 rounded-lg p-4 bg-black/50 backdrop-blur animate-pulse">
        <div className="h-6 w-32 bg-green-500/20 rounded mb-4" />
        <div className="space-y-4">
          <div className="h-12 bg-green-500/20 rounded" />
          <div className="h-20 bg-green-500/20 rounded" />
          <div className="h-24 bg-green-500/20 rounded" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="border border-green-500/30 rounded-lg p-4 bg-black/50 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl flex items-center gap-2">
          <span className="text-green-400">&gt;</span> AGENT.STATUS
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-400">SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-green-400" />
          <div>
            <div className="text-sm text-green-300/60">Followers</div>
            <div className="text-xl">{stats.followers.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Wrench className="w-5 h-5 text-green-400" />
          <div>
            <div className="text-sm text-green-300/60">Active Tools</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {stats.tools.map((tool) => (
                <span
                  key={tool}
                  className="text-xs border border-green-500/30 px-2 py-1 rounded"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-green-400" />
          <div className="w-full">
            <div className="text-sm text-green-300/60">Holdings</div>
            <div className="space-y-2 mt-1">
              {stats.holdings.map((holding) => (
                <div key={holding.token} className="flex flex-col gap-1">
                  <div className="text-sm">
                    {holding.token}: {holding.amount}
                  </div>
                  {holding.wallet && (
                    <div className="flex items-center gap-2 text-xs text-green-300/60 bg-green-500/5 p-1.5 rounded">
                      <span className="truncate">{holding.wallet}</span>
                      <button
                        onClick={() => handleCopyAddress(holding.wallet!)}
                        className="hover:text-green-400 transition-colors ml-auto"
                      >
                        COPY
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentStats;
