import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Loader2,
} from "lucide-react";
import ConversationDetail from "./ConversationDetail";
import { api, SystemMessage } from "../services/api";
import Accordion from "./ui/Accordion";

const MESSAGES_PER_PAGE = 5;
const MAX_CONTENT_LENGTH = 100;

function MessageBoard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<SystemMessage | null>(
    null,
  );
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await api.getSystemMessages(
          currentPage,
          MESSAGES_PER_PAGE,
        );
        setMessages(data.messages);
        setTotalMessages(data.total);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [currentPage]);

  const totalPages = Math.ceil(totalMessages / MESSAGES_PER_PAGE);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "analysis":
        return "border-blue-500/30";
      case "alert":
        return "border-yellow-500/30";
      case "trade":
        return "border-green-500/30";
      default:
        return "border-green-500/30";
    }
  };

  const truncateContent = (content: string) => {
    if (content.length <= MAX_CONTENT_LENGTH) return content;
    return `${content.slice(0, MAX_CONTENT_LENGTH)}...`;
  };

  const content = loading ? (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  ) : (
    <>
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`border-l-2 ${getTypeColor(message.type)} pl-3 py-2 hover:bg-green-500/5 transition-colors cursor-pointer group`}
            onClick={() => setSelectedMessage(message)}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-green-300/60">
                {message.timestamp}
              </div>
              <MessageSquare className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-1">{truncateContent(message.content)}</div>
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
      <Accordion title="SYSTEM.LOG" defaultOpen={false}>
        {content}
      </Accordion>

      {selectedMessage && (
        <ConversationDetail
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </>
  );
}

export default MessageBoard;
