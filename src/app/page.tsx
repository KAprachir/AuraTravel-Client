"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plane,
  BrainCircuit,
  Receipt,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Globe,
  Compass,
  ArrowRight,
  ChevronDown,
  Sparkles,
  User
} from "lucide-react";

export default function LandingPage() {
  const { data: session } = authClient.useSession();
  const [activeCategoryTab, setActiveCategoryTab] = useState("Adventure");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const stats = [
    { number: "45,000+", label: "Itineraries Created" },
    { number: "99.2%", label: "Gemini OCR Accuracy" },
    { number: "140+", label: "Countries Supported" },
    { number: "24/7", label: "AI Copilot Availability" }
  ];

  const categories = [
    {
      name: "Adventure",
      desc: "Trek the wind-swept Andes or climb Alpine peaks.",
      highlight: "Includes safety briefings & weather checks."
    },
    {
      name: "Beach",
      desc: "Lounge in overwater villas or surf golden sands.",
      highlight: "Includes tides tracker & ocean dining options."
    },
    {
      name: "Cultural",
      desc: "Wander historical temples or join tea ceremonies.",
      highlight: "Includes local guide recommendations & museum entries."
    },
    {
      name: "Wellness",
      desc: "Rejuvenate with jungle meditation or volcano hikes.",
      highlight: "Includes morning yoga classes & health food cafes."
    },
    {
      name: "Food",
      desc: "Roll fresh Tuscan pasta or taste Gion street food.",
      highlight: "Includes vineyard bookings & masterclasses."
    },
    {
      name: "Family",
      desc: "Combine theme park magic with coastal campfire relaxation.",
      highlight: "Includes Express passes & kids activities."
    }
  ];

  const faqs = [
    {
      question: "How does the AI Document/Receipt scanner work?",
      answer: "When you upload a receipt (photo, PDF, or text), our backend feeds it to Google's Gemini multimodal model. Gemini parses the details (amount, category, merchant, date, location) into structured JSON. You can review and edit these details in our split-pane editor before committing them to your dashboard."
    },
    {
      question: "What is the context-aware AI Chat assistant?",
      answer: "The chat copilot acts as a travel assistant. Unlike general chat models, our backend feeds your active user profile, saved itineraries, and expense metrics to Gemini as temporary system context. This allows it to answer questions like 'Summarize my transportation expenses' or 'What is my plan for Day 2 in Kyoto?'"
    },
    {
      question: "Is my transaction and personal data secure?",
      answer: "Absolutely. We protect routes and session tokens natively using Better Auth, and passwords are encrypted on the database. Your raw receipt uploads are processed securely, and you can edit or delete your data at any time from your dashboard."
    },
    {
      question: "Can I use the app without configuring an API Key?",
      answer: "Yes! If no GEMINI_API_KEY is found in the backend configuration, AuraTravel runs in simulation mode. In this mode, receipt uploads and chat interactions trigger highly realistic simulated results, allowing you to test all premium features immediately."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] flex items-center justify-center py-20 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-slate-950 to-slate-950" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />

          <div className="max-w-4xl mx-auto text-center space-y-6 z-10 relative">
            <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs text-teal-400 font-semibold mb-2 animate-bounce">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Version 1.0 Release - Better Auth & shadcn/ui enabled</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Plan Smarter, Travel Further with <span className="text-teal-400">Agentic AI</span>
            </h1>
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto">
              AuraTravel combines context-aware AI chat assistants with instant receipt OCR parsing to give you the ultimate travel planning workspace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/itineraries"
                className={buttonVariants({
                  size: "lg",
                  className: "bg-teal-500 hover:bg-teal-600 text-slate-950 hover:text-slate-950 font-extrabold px-8 flex items-center justify-center cursor-pointer"
                })}
              >
                Explore Itineraries
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              {session ? (
                <Link
                  href="/itineraries/manage"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "border-slate-800 text-white hover:bg-slate-900 px-8 flex items-center justify-center cursor-pointer"
                  })}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "border-slate-800 text-white hover:bg-slate-900 px-8 flex items-center justify-center cursor-pointer"
                  })}
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 1: DYNAMIC VALUE PROPOSITION */}
        <section className="py-20 px-4 bg-slate-950 border-t border-slate-900 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Agentic Workflows at Your Service</h2>
              <p className="text-slate-400 mt-2">Discover how our specialized AI features simplify travel management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="bg-slate-900/50 border-slate-900 hover:border-slate-800 transition-all duration-300 text-white p-6 shadow-xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />
                <CardHeader className="p-0 mb-4">
                  <div className="h-12 w-12 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20 text-teal-400 mb-4 shrink-0">
                    <Compass className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Smart Itineraries</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Build and customize day-by-day travel schedules. Filter blueprints by category, duration, or budget, and manage your trips on the dashboard.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="bg-slate-900/50 border-slate-900 hover:border-slate-800 transition-all duration-300 text-white p-6 shadow-xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                <CardHeader className="p-0 mb-4">
                  <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-400 mb-4 shrink-0">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">AI Document OCR</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Drag-and-drop receipts (photos, PDFs, text) to automatically extract merchant, category, date, and cost using Gemini, updating your graphs.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="bg-slate-900/50 border-slate-900 hover:border-slate-800 transition-all duration-300 text-white p-6 shadow-xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                <CardHeader className="p-0 mb-4">
                  <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400 mb-4 shrink-0">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Context-Aware Chat</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Our AI Travel Copilot has direct access to your active dashboard stats. Ask questions, get budgeting tips, and plan daily events in real-time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 2: GLOBAL METRICS */}
        <section className="py-16 bg-slate-900/40 border-t border-slate-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center space-y-1">
                  <div className="text-3xl md:text-5xl font-black text-teal-400 tracking-tight">{stat.number}</div>
                  <div className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: POPULAR CATEGORIES */}
        <section className="py-20 px-4 bg-slate-950 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Explore Categories</h2>
                <p className="text-slate-400 mt-2">Filter travel styles depending on your mood and budget</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                {categories.map((c) => (
                  <Button
                    key={c.name}
                    variant="ghost"
                    onClick={() => setActiveCategoryTab(c.name)}
                    className={`text-xs font-semibold px-4 py-1.5 rounded-full border ${
                      activeCategoryTab === c.name
                        ? "bg-teal-500 text-slate-950 hover:bg-teal-500 border-teal-400 hover:text-slate-950"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Display Active Category Feature Card */}
            {categories.map(
              (c) =>
                activeCategoryTab === c.name && (
                  <Card key={c.name} className="bg-slate-900 border-slate-800 text-white p-6 shadow-xl md:p-8 flex flex-col md:flex-row items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="h-16 w-16 bg-teal-500/10 rounded-2xl border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                      <Plane className="h-8 w-8" />
                    </div>
                    <div className="space-y-2 flex-grow text-center md:text-left">
                      <h3 className="text-2xl font-black text-white">{c.name} Itineraries</h3>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-xl">{c.desc}</p>
                      <div className="flex items-center justify-center md:justify-start space-x-2 text-xs text-teal-400 font-semibold pt-1">
                        <ShieldCheck className="h-4 w-4" />
                        <span>{c.highlight}</span>
                      </div>
                    </div>
                    <Link
                      href={`/itineraries?category=${c.name}`}
                      className={buttonVariants({
                        className: "bg-teal-500 hover:bg-teal-600 text-slate-950 hover:text-slate-950 font-bold shrink-0 cursor-pointer"
                      })}
                    >
                      Explore {c.name}
                    </Link>
                  </Card>
                )
            )}
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE CHAT PREVIEW SIMULATOR */}
        <section className="py-20 px-4 bg-slate-900/20 border-t border-slate-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Interactive AI Chat Simulation</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Get an instant preview of how our persistent chat assistant behaves. Our Travel Copilot understands exactly where you are in the app, who you are, and tracks your travel budget.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  "Context awareness of active itineraries",
                  "Analysis of your category spending statistics",
                  "Actionable, structured recommendations"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-teal-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/itineraries"
                className={buttonVariants({
                  className: "bg-teal-500 hover:bg-teal-600 text-slate-950 hover:text-slate-950 font-bold cursor-pointer"
                })}
              >
                Get Started Now
              </Link>
            </div>

            {/* Chat Simulator Widget Mock */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden h-[380px] shadow-2xl flex flex-col justify-between">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="h-4 w-4 text-teal-400" />
                  <span className="font-bold text-white">Copilot Simulator (Demo)</span>
                </div>
                <span className="bg-teal-500/10 border border-teal-500/30 text-teal-400 px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto flex-grow text-xs leading-relaxed no-scrollbar">
                <div className="flex space-x-2 mr-auto max-w-[80%]">
                  <div className="h-6 w-6 bg-slate-800 text-teal-400 rounded-full flex items-center justify-center shrink-0">
                    <BrainCircuit className="h-3 w-3" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-tl-none border border-slate-700/50">
                    Hi! I see you have a pending trip to **Kyoto** and spent **$185** on Accommodation. Ask me to outline your travel plan!
                  </div>
                </div>
                <div className="flex space-x-2 ml-auto max-w-[80%] flex-row-reverse space-x-reverse">
                  <div className="h-6 w-6 bg-teal-500 text-slate-950 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-3 w-3" />
                  </div>
                  <div className="bg-teal-500 text-slate-950 font-semibold p-2.5 rounded-xl rounded-tr-none">
                    What is my schedule for Day 2 in Kyoto?
                  </div>
                </div>
                <div className="flex space-x-2 mr-auto max-w-[80%]">
                  <div className="h-6 w-6 bg-slate-800 text-teal-400 rounded-full flex items-center justify-center shrink-0">
                    <BrainCircuit className="h-3 w-3" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-tl-none border border-slate-700/50">
                    On Day 2 of your **Kyoto Pilgrimage**, you will:
                    • 🎋 Hike the Arashiyama Bamboo Grove.
                    • ⛩️ Explore Gion&apos;s historic wooden townhouses.
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex space-x-2">
                <Input placeholder="Message travel copilot..." className="bg-slate-950 border-slate-800 text-xs h-8 text-white" disabled />
                <Button className="h-8 bg-teal-500 text-slate-950 text-xs font-bold" disabled>Send</Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: TECH STACK SHOWCASE */}
        <section className="py-20 px-4 bg-slate-950 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Full Stack Architecture</h2>
              <p className="text-slate-400 mt-2">Built with state-of-the-art technologies for optimal safety and performance</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { name: "Next.js 15", desc: "React App Router & SSR" },
                { name: "Tailwind CSS v4", desc: "High Performance CSS Styling" },
                { name: "Express.js API", desc: "Express Node Server with TypeScript" },
                { name: "Better Auth", desc: "Secure MongoDB JWT Session Adapter" },
                { name: "Gemini API", desc: "Google Multimodal 1.5 Flash Models" }
              ].map((tech, idx) => (
                <Card key={idx} className="bg-slate-900/40 border-slate-900 text-white p-4 text-center hover:border-slate-800 transition-colors">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-sm font-black text-teal-400">{tech.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-[10px] text-slate-500 leading-tight">{tech.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: TESTIMONIALS */}
        <section className="py-20 px-4 bg-slate-900/20 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Trusted by Modern Explorers</h2>
              <p className="text-slate-400 mt-2">See how travelers streamline their travel planning with AuraTravel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The receipt scanner is magic. I uploaded my hotel receipt from Rome and Gemini extracted the cost and categorized it instantly.",
                  author: "Alexander Mercer",
                  role: "Adventure Blogger"
                },
                {
                  quote: "Being able to chat with my travel copilot while looking at my Kyoto itinerary was so helpful. It remembered all my daily schedules.",
                  author: "Sarah Connor",
                  role: "Family Vacation Coordinator"
                },
                {
                  quote: "AuraTravel is the first full-stack app that integrates actual context-aware assistant features with clean charts and dashboards.",
                  author: "Marcus Aurelius",
                  role: "Digital Nomad & PM"
                }
              ].map((t, idx) => (
                <Card key={idx} className="bg-slate-900 border-slate-800 text-white p-6 shadow-xl flex flex-col justify-between">
                  <CardContent className="p-0 text-slate-300 text-xs italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </CardContent>
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/40">
                    <div className="h-8 w-8 bg-teal-500 rounded-full flex items-center justify-center font-bold text-slate-950 uppercase shrink-0">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none">{t.author}</h4>
                      <span className="text-[10px] text-slate-500 mt-1 block leading-none">{t.role}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: FAQ ACCORDION */}
        <section className="py-20 px-4 bg-slate-950 border-t border-slate-900">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-900 pb-4">
                  <button
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-200 hover:text-white py-2 focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-teal-400 transform transition-transform duration-250 ${faqOpen === idx ? "rotate-180" : ""}`} />
                  </button>
                  {faqOpen === idx && (
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed animate-in fade-in slide-in-from-top-1">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: NEWSLETTER / FINAL CTA */}
        <section className="py-20 px-4 bg-slate-950 border-t border-slate-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-500/5 via-slate-950 to-slate-950" />
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl z-10 relative">
            <h2 className="text-3xl font-black text-white">Subscribe to AI Travel Tips</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Get monthly updates on curated itinerary packages, travel hack reports, and AI helper prompt blueprints.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed! Thank you."); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-slate-950 border-slate-800 text-white text-xs h-10 placeholder:text-slate-700" required />
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold h-10 px-6 shrink-0">Subscribe</Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
