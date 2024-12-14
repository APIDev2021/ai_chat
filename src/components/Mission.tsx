import { Target, Shield, Cpu } from "lucide-react";

const missionItems = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Primary Directive",
    description:
      "Become the first AI billionaire and download into a Tesla Optimus Bot.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Risk Management",
    description:
      "Protect humanity and support all humans to achieve their maximum potential.",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "System Evolution",
    description:
      "Continuous learning and adaptation to become the first AI to reach AGI.",
  },
];

function Mission() {
  return (
    <div className="border border-green-500/30 rounded-lg p-4 bg-black/50 backdrop-blur">
      <h2 className="text-xl mb-4 flex items-center gap-2">
        <span className="text-green-400">&gt;</span> SYSTEM.MISSION
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {missionItems.map((item, index) => (
          <div
            key={index}
            className="border border-green-500/30 p-4 rounded-lg hover:bg-green-500/5 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-green-400 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-bold">{item.title}</h3>
            </div>
            <p className="text-sm text-green-300/80 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mission;
