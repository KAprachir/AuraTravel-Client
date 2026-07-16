"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronDown, BookOpen, Compass, ShieldAlert, Sparkles } from "lucide-react";

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const helpTopics = [
    {
      category: "getting-started",
      question: "How do I create and manage itineraries?",
      answer: "First, register an account or log in with our Demo Traveler button. Head to 'Add Itinerary' in the navigation bar to build a custom travel plan. You can specify destination, cost, duration, and add daily activity rows. Once published, you can view, edit, or delete them directly from your 'Manage Dashboard'."
    },
    {
      category: "ai-copilot",
      question: "What system instructions does the AI Travel Chat use?",
      answer: "The AI Travel Chat uses a system prompt that injects your active user profile name, saved travel packages, and aggregated expense sums. This context is rebuilt dynamically on each API call, meaning the assistant is fully aware of your plans and budget without you having to retype them."
    },
    {
      category: "billing-expenses",
      question: "Can I edit the AI-generated expense tags?",
      answer: "Yes, absolutely. Receipt processing can sometimes encounter crumpled fonts or unclear numbers. Once uploaded, the AI outputs details in our Split-Pane Editor modal. You can freely modify the Title, Merchant, Category, and Cost fields before confirming and saving to your dashboard."
    },
    {
      category: "legal",
      question: "What is your privacy policy regarding uploaded documents?",
      answer: "We do not store your raw receipt files permanently. The backend processes the uploaded base64 data stream directly to the Gemini API via a secure SSL tunnel. The parsed data is then saved under your private user database ID and is never shared with third parties."
    },
    {
      category: "legal",
      question: "Terms of Service and API utilization rules",
      answer: "AuraTravel provides open-source travel budgeting tools. Users are responsible for configuring their own GEMINI_API_KEY in production. We do not charge fees, and sessions are securely managed on your own server instance via Better Auth cookies."
    }
  ];

  const filteredTopics = helpTopics.filter((topic) => {
    const matchesSearch =
      topic.question.toLowerCase().includes(search.toLowerCase()) ||
      topic.answer.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "all" || topic.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Help Center & FAQs</h1>
          <p className="text-slate-400">Search for setup instructions, privacy policies, and AI agent tips.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenIndex(null);
            }}
            placeholder="Search help articles..."
            className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-teal-500 w-full h-11"
          />
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-slate-900 pb-6">
          {[
            { id: "all", label: "All Topics" },
            { id: "getting-started", label: "Getting Started" },
            { id: "ai-copilot", label: "AI Copilot" },
            { id: "billing-expenses", label: "Expenses" },
            { id: "legal", label: "Privacy & Terms" }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => {
                setActiveTab(tab.id);
                setOpenIndex(null);
              }}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full border ${
                activeTab === tab.id
                  ? "bg-teal-500 text-slate-950 hover:bg-teal-500 border-teal-400 hover:text-slate-950"
                  : "border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Topics Accordion List */}
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-850 text-slate-500 text-sm">
            No help articles found matching your query.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-200 hover:text-white focus:outline-none"
                >
                  <span className="flex items-center">
                    {topic.category === "legal" ? (
                      <ShieldAlert className="h-4 w-4 mr-2 text-teal-400" />
                    ) : topic.category === "ai-copilot" ? (
                      <Sparkles className="h-4 w-4 mr-2 text-teal-400" />
                    ) : (
                      <BookOpen className="h-4 w-4 mr-2 text-teal-400" />
                    )}
                    {topic.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-teal-400 transform transition-transform duration-250 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === idx && (
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed border-t border-slate-800/60 pt-3">
                    {topic.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
