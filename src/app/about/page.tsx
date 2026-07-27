import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Compass, Sparkles, BrainCircuit, Code, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">About AuraTravel</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Pioneering context-aware travel copilots and intelligent receipt tracking systems for
            modern explorers.
          </p>
        </div>

        {/* Mission Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              At AuraTravel, we believe travel planning shouldn&apos;t feel like a chore. Our goal is to
              harness Large Language Models (LLMs) to create agentic companions that work with your real-world travel data.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              By merging seamless authentication, responsive charts, and multimodal OCR parsing, we build spaces where itinerary outlines and travel expenditures are automatically calculated, verified, and discussed.
            </p>
            <Link
              href="/itineraries"
              className={buttonVariants({
                className: "bg-teal-500 hover:bg-teal-600 text-slate-950 hover:text-slate-950 font-bold inline-flex items-center cursor-pointer"
              })}
            >
              Start Exploring
            </Link>
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800"
              alt="Travel Planning"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Tech Stack Pillars */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-10">Architectural Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6 shadow-lg">
              <CardHeader className="p-0 mb-4 flex items-center space-x-3">
                <div className="h-10 w-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <Code className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold">Modern Client</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Next.js 15 App Router providing fast Server Side Rendering (SSR), styled with Tailwind CSS v4, and dynamic shadcn/ui components (Radix primitives).
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6 shadow-lg">
              <CardHeader className="p-0 mb-4 flex items-center space-x-3">
                <div className="h-10 w-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold">Express.js API</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Express backend built with TypeScript, connecting to a MongoDB database through Mongoose models. Authenticated via secure Better Auth adapter cookies.
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6 shadow-lg">
              <CardHeader className="p-0 mb-4 flex items-center space-x-3">
                <div className="h-10 w-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold">Gemini Engine</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Utilizes the `@google/generative-ai` SDK, communicating with the `gemini-1.5-flash` model for receipt extraction (OCR) and conversational chat.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Workflow Diagram Representation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">AI Agent Workflow Pipeline</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs text-center text-slate-700 dark:text-slate-300">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 w-44 space-y-2">
              <div className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">Data Ingestion</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">PDFs, Images, Receipts or Chat queries are received.</p>
            </div>
            <div className="text-teal-600 dark:text-teal-500 font-bold shrink-0">➔</div>
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 w-44 space-y-2">
              <div className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">Context Gathering</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Database matches active user itineraries & expense records.</p>
            </div>
            <div className="text-teal-600 dark:text-teal-500 font-bold shrink-0">➔</div>
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 w-44 space-y-2">
              <div className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">Gemini 1.5 Inference</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Prompt injection translates user data into answers or JSON.</p>
            </div>
            <div className="text-teal-600 dark:text-teal-500 font-bold shrink-0">➔</div>
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 w-44 space-y-2">
              <div className="font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">Verification & UI</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">User reviews editable values; charts update in real-time.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
