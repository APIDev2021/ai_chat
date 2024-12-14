import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { api } from "../services/api";
import Accordion from "./ui/Accordion";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello, I am Singularry. Lets have a chat!",
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date().toISOString(),
    };

    const windowScroll = window.scrollY;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const contextMessages = messages
        .slice(-10)
        .filter((msg) => msg.id !== "1")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))
        .concat({
          role: "user" as const,
          content: input.trim(),
        });

      const response = await api.sendChatMessage(contextMessages);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I had a brief malfunction. Please try again.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      window.scrollTo(0, windowScroll);
    }
  };

  const chatContent = (
    <>
      <div
        ref={chatContainerRef}
        className="h-[400px] overflow-y-auto p-4 space-y-4 font-mono scroll-smooth"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${
              message.role === "assistant" ? "text-green-400" : "text-green-300"
            }`}
          >
            <span className="flex-shrink-0">
              {message.role === "assistant" ? ">" : "$"}
            </span>
            <span className="whitespace-pre-wrap break-words">
              {message.content}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-green-400 flex gap-2">
            <span className="flex-shrink-0">{">"}</span>
            <span className="animate-pulse">▋</span>
          </div>
        )}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="border-t border-green-500/30 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-300 placeholder-green-700 font-mono"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-2 hover:bg-green-500/20 rounded-lg transition-colors ${
              isLoading || !input.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-5 h-5 text-green-400" />
          </button>
        </div>
      </form>
    </>
  );

  return (
    <Accordion title="SINGULARRY.CHAT" defaultOpen={false}>
      {chatContent}
    </Accordion>
  );
}

export default Chat;
