import { useState, useEffect } from "react";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Loader2,
} from "lucide-react";
import ConsciousnessDetail from "./ConsciousnessDetail";
import { api, ConsciousnessThought } from "../services/api";
import Accordion from "./ui/Accordion";

const THOUGHTS_PER_PAGE = 5;
const MAX_THOUGHT_LENGTH = 100; // Maximum characters to show before truncating

function Consciousness() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedThought, setSelectedThought] =
    useState<ConsciousnessThought | null>(null);
  const [thoughts, setThoughts] = useState<ConsciousnessThought[]>([]);
  const [totalThoughts, setTotalThoughts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThoughts = async () => {
      try {
        const data = await api.getConsciousnessLog(
          currentPage,
          THOUGHTS_PER_PAGE,
        );
        setThoughts(data.thoughts);
        setTotalThoughts(data.total);
      } catch (error) {
        console.error("Failed to load consciousness log:", error);
      } finally {
        setLoading(false);
      }
    };

    loadThoughts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalThoughts / THOUGHTS_PER_PAGE);

  const getActionColor = (action: string) => {
    switch (action) {
      case "ANALYZE":
        return "text-blue-400";
      case "EVALUATE":
        return "text-yellow-400";
      case "DECIDE":
        return "text-green-400";
      default:
        return "text-green-400";
    }
  };

  const truncateThought = (thought: string) => {
    if (thought.length <= MAX_THOUGHT_LENGTH) return thought;
    return `${thought.slice(0, MAX_THOUGHT_LENGTH)}...`;
  };

  const content = loading ? (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  ) : (
    <>
      <div className="space-y-3 font-mono">
        {thoughts.map((thought) => (
          <div
            key={thought.id}
            className="hover:bg-green-500/5 transition-colors cursor-pointer group"
            onClick={() => setSelectedThought(thought)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-300/60">
                [{thought.timestamp}]
              </span>
              <span className={`${getActionColor(thought.action)}`}>
                {thought.action}
              </span>
              <Brain className="w-4 h-4 text-green-400" />
            </div>
            <div className="pl-4 mt-1 flex items-center justify-between">
              <div>{truncateThought(thought.thought)}</div>
              <Maximize2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-green-400/60">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 hover:bg-green-500/20 rounded disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 hover:bg-green-500/20 rounded disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Accordion title="CONSCIOUSNESS.LOG" defaultOpen={false}>
        {content}
      </Accordion>

      {selectedThought && (
        <ConsciousnessDetail
          thought={selectedThought}
          onClose={() => setSelectedThought(null)}
        />
      )}
    </>
  );
}

export default Consciousness;
