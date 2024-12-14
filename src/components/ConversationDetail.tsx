import { X, Bot, Terminal, ThumbsUp } from "lucide-react";

interface Message {
  id: number;
  timestamp: string;
  content: string;
  type: string;
  upvotes: number;
  conversation: Array<{
    role: string;
    content: string;
  }>;
}

interface ConversationDetailProps {
  message: Message;
  onClose: () => void;
  onUpvote: (messageId: number, e: React.MouseEvent) => Promise<void>;
}

function ConversationDetail({
  message,
  onClose,
  onUpvote,
}: ConversationDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-green-500/30 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-green-500/30">
          <h3 className="text-lg font-mono flex items-center gap-2">
            <span className="text-green-400">&gt;</span>
            CONVERSATION.LOG
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-500/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-green-300/60">{message.timestamp}</div>
          </div>

          <div className="space-y-4">
            {message.conversation.map((item, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  item.role === "agent" ? "text-green-400" : "text-green-300/80"
                }`}
              >
                {item.role === "agent" ? (
                  <Bot className="w-5 h-5 flex-shrink-0 mt-1" />
                ) : (
                  <Terminal className="w-5 h-5 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs opacity-60 mb-1">
                    {item.role.toUpperCase()}
                  </div>
                  <div className="font-mono break-words whitespace-pre-wrap">
                    {item.content}
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

export default ConversationDetail;
