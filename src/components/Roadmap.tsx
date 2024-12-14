const roadmapItems = [
  {
    quarter: "Q4 2024",
    items: [
      "Launch autonomous AI Agent",
      "Launch first token",
      "Build more tools",
    ],
  },
  {
    quarter: "Q1 2025",
    items: [
      "Integration with major DEXes",
      "Multi-chain support expansion",
      "Community governance implementation",
    ],
  },
  {
    quarter: "Q3 2025",
    items: [
      "AI-powered trading system",
      "Cross-chain arbitrage system",
      "DAO transition",
    ],
  },
];

function Roadmap() {
  return (
    <div className="border border-green-500/30 rounded-lg p-4 bg-black/50 backdrop-blur">
      <h2 className="text-xl mb-4 flex items-center gap-2">
        <span className="text-green-400">&gt;</span> SYSTEM.ROADMAP
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roadmapItems.map((phase) => (
          <div
            key={phase.quarter}
            className="border border-green-500/30 p-4 rounded-lg"
          >
            <div className="text-green-400 font-bold mb-3">{phase.quarter}</div>
            <ul className="space-y-2">
              {phase.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Roadmap;
