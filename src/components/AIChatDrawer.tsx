"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  BrainCircuit,
  RefreshCw,
  User,
  ArrowRight
} from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AIChatDrawer() {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts
  const suggestedPrompts = [
    "Summarize my itineraries",
    "Analyze my travel budget",
    "Give me travel tips for Japan"
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Set initial greeting
  useEffect(() => {
    if (session && messages.length === 0) {
      setMessages([
        {
          role: "model",
          text: `Hi ${session.user.name}! I'm your AuraTravel Copilot. 🌍 I've synced with your saved itineraries and travel expenses. Ask me to outline your daily schedules, analyze your spending categories, or give you travel recommendations!`
        }
      ]);
    }
  }, [session, messages.length]);

  if (!session) return null; // Chat assistant only visible when logged in

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Format history for Gemini SDK
    const historyFormat = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const data = await apiFetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: textToSend,
          history: historyFormat
        })
      });

      setMessages((prev) => [...prev, { role: "model", text: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I apologize, I'm experiencing connectivity issues reaching my brain. Please try again soon."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-500 hover:bg-teal-600 text-slate-950 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 relative group border border-teal-400"
          title="Open AI Travel Copilot"
        >
          <BrainCircuit className="h-6 w-6 text-slate-950 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 text-slate-900 dark:text-white">
          {/* Header */}
          <div className="bg-slate-100 dark:bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">AuraTravel Copilot</h3>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 flex items-center">
                  <RefreshCw className="h-2.5 w-2.5 mr-1 animate-spin" />
                  Context Sync Active
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    msg.role === "user" ? "bg-teal-500 text-slate-950" : "bg-slate-200 dark:bg-slate-800 text-teal-700 dark:text-teal-400"
                  }`}
                >
                  {msg.role === "user" ? <User className="h-3 w-3" /> : <BrainCircuit className="h-3.5 w-3.5" />}
                </div>

                {/* Text Balloon */}
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-teal-500 text-slate-950 font-medium rounded-tr-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/50"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center space-x-2 mr-auto max-w-[85%]">
                <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <BrainCircuit className="h-3.5 w-3.5" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 p-3 rounded-xl rounded-tl-none flex space-x-1 items-center">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-225" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts & Input Area */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {/* Chips (Hidden when loading) */}
            {!loading && messages.length <= 2 && (
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-teal-500/30 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-full transition-all flex items-center cursor-pointer shadow-sm"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="h-2.5 w-2.5 ml-1 text-teal-600 dark:text-teal-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your travel copilot..."
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-teal-500 text-xs h-9 flex-1"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-9 w-9 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold p-0 shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
