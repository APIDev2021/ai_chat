import { X, Brain, Terminal, Cpu } from "lucide-react";

interface Thought {
  id: number;
  timestamp: string;
  action: string;
  thought: string;
  details: Array<{
    type: string;
    content: string;
  }>;
}

interface ConsciousnessDetailProps {
  thought: Thought;
  onClose: () => void;
}

function ConsciousnessDetail({ thought, onClose }: ConsciousnessDetailProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "INPUT":
        return <Terminal className="w-5 h-5" />;
      case "PROCESS":
        return <Cpu className="w-5 h-5" />;
      case "OUTPUT":
        return <Brain className="w-5 h-5" />;
      default:
        return <Terminal className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "INPUT":
        return "text-blue-400";
      case "PROCESS":
        return "text-yellow-400";
      case "OUTPUT":
        return "text-green-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-green-500/30 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-green-500/30">
          <h3 className="text-lg font-mono flex items-center gap-2">
            <span className="text-green-400">&gt;</span>
            CONSCIOUSNESS.DETAIL
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-500/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 font-mono">
          <div className="text-xs text-green-300/60 mb-2">
            {thought.timestamp}
          </div>
          <div className="text-lg mb-4 flex items-center gap-2 break-words">
            <span className={getTypeColor(thought.action)}>
              {thought.action}
            </span>
          </div>

          <div className="space-y-4">
            {thought.details.map((detail, index) => (
              <div
                key={index}
                className={`flex gap-3 ${getTypeColor(detail.type)}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(detail.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs opacity-60 mb-1">{detail.type}</div>
                  <div className="break-words whitespace-pre-wrap">
                    {detail.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsciousnessDetail;
