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
  Globe,
  Compass,
  ArrowRight,
  ChevronDown,
  Sparkles,
  User,
  Star,
  MapPin,
  Clock,
  Heart
} from "lucide-react";

export default function LandingPage() {
  const { data: session } = authClient.useSession();
  const [activeCategoryTab, setActiveCategoryTab] = useState("Adventure");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const stats = [
    { number: "45,000+", label: "Happy Travelers" },
    { number: "99.2%", label: "Planner Accuracy Rate" },
    { number: "140+", label: "Global Destinations" },
    { number: "24/7", label: "AI Copilot Assistance" }
  ];

  const featuredDestinations = [
    {
      id: "1",
      name: "Santorini & Oia Coastline",
      location: "Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop",
      category: "Beach",
      duration: "6 Days",
      price: 1290,
      rating: 4.9,
      reviewsCount: 142,
      badge: "Best Seller"
    },
    {
      id: "2",
      name: "Kyoto Temple Pilgrimage",
      location: "Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
      category: "Cultural",
      duration: "8 Days",
      price: 1850,
      rating: 4.95,
      reviewsCount: 210,
      badge: "Trending"
    },
    {
      id: "3",
      name: "Alpine Trekking & Glacier Chalets",
      location: "Switzerland",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop",
      category: "Adventure",
      duration: "7 Days",
      price: 2400,
      rating: 4.88,
      reviewsCount: 98,
      badge: "Featured"
    },
    {
      id: "4",
      name: "Bali Jungle Retreat & Waterfalls",
      location: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
      category: "Wellness",
      duration: "5 Days",
      price: 980,
      rating: 4.92,
      reviewsCount: 175,
      badge: "Popular"
    },
    {
      id: "5",
      name: "Amalfi Cliffside Gastronomy",
      location: "Italy",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
      category: "Food",
      duration: "6 Days",
      price: 1650,
      rating: 4.91,
      reviewsCount: 115,
      badge: "Top Rated"
    },
    {
      id: "6",
      name: "Serengeti Great Migration Safari",
      location: "Tanzania",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop",
      category: "Adventure",
      duration: "9 Days",
      price: 3100,
      rating: 4.97,
      reviewsCount: 86,
      badge: "Exclusive"
    }
  ];

  const categories = [
    {
      name: "Adventure",
      desc: "Trek the wind-swept Andes, scale Alpine peaks, or raft river canyons.",
      highlight: "Includes safety briefings, trail maps & gear guides."
    },
    {
      name: "Beach",
      desc: "Lounge in luxury overwater bungalows or surf golden sands.",
      highlight: "Includes ocean tide trackers & beachside dining options."
    },
    {
      name: "Cultural",
      desc: "Wander historic UNESCO temples or join private artisan workshops.",
      highlight: "Includes expert local guides & queue-jump museum passes."
    },
    {
      name: "Wellness",
      desc: "Rejuvenate with jungle meditation retreats and thermal springs.",
      highlight: "Includes organic dining recommendations & spa vouchers."
    },
    {
      name: "Food",
      desc: "Master Tuscan pasta making or savor Michelin street food tours.",
      highlight: "Includes vineyard masterclasses & chef-guided tastings."
    },
    {
      name: "Family",
      desc: "Combine resort water parks with coastal campfire relaxation.",
      highlight: "Includes family express passes & kid-friendly itineraries."
    }
  ];

  const faqs = [
    {
      question: "How does the AI Travel Copilot help me plan trips?",
      answer: "Your personal AI Travel Assistant understands your preferences, active trip schedules, and travel budget. You can ask for real-time recommendations, day-by-day activity outlines, or restaurant suggestions tailored to your itinerary."
    },
    {
      question: "How does receipt and expense scanning work?",
      answer: "Simply snap a photo or upload a receipt while traveling. Our intelligent OCR automatically identifies the merchant, amount, category, and date, seamlessly adding it to your expense tracker for total budget control."
    },
    {
      question: "Can I book verified travel packages directly?",
      answer: "Yes! AuraTravel hosts verified itineraries created by certified travel planners and experienced guides. You can explore complete schedules, customize dates, and book instantly."
    },
    {
      question: "What happens after I book an itinerary?",
      answer: "Your reservation is immediately added to your Traveler Dashboard, where you can view complete daily schedules, payment receipts, and manage your booking status."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION WITH RICH TRAVEL IMAGERY */}
        <section className="relative min-h-[85vh] flex items-center justify-center py-24 px-4 overflow-hidden">
          {/* Background Travel Image Overlay */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1920&auto=format&fit=crop"
              alt="Travel Hero Background"
              className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105 transform animate-pulse duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/15 via-transparent to-slate-950" />
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-8 z-10 relative">
            <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-teal-500/30 px-4 py-1.5 rounded-full text-xs text-teal-400 font-semibold mb-2 shadow-lg backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Explore Over 140 Extraordinary Worldwide Destinations</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Discover Earth&apos;s Most <span className="text-teal-400 drop-shadow-md">Extraordinary</span> Journeys
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Curated itineraries crafted by master travel planners, paired with an intelligent AI copilot to guide your next unforgettable expedition.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/itineraries"
                className={buttonVariants({
                  size: "lg",
                  className: "bg-teal-500 hover:bg-teal-600 text-slate-950 hover:text-slate-950 font-extrabold px-8 py-6 text-base rounded-full shadow-lg shadow-teal-500/20 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105"
                })}
              >
                Explore Destinations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              {session ? (
                <Link
                  href="/itineraries/manage"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "border border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 hover:text-white px-8 py-6 text-base rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-200"
                  })}
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "border border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 hover:text-white px-8 py-6 text-base rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-200"
                  })}
                >
                  Start Planning Free
                </Link>
              )}
            </div>

            {/* Hero Quick Badge Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-800/60 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-slate-300 text-xs font-medium bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Global Coverage</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-300 text-xs font-medium bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-sm">
                <Compass className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Custom Schedules</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-300 text-xs font-medium bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-sm">
                <Receipt className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Smart Expense Scanner</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-300 text-xs font-medium bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-sm">
                <BrainCircuit className="h-4 w-4 text-blue-400 shrink-0" />
                <span>24/7 AI Assistant</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: FEATURED DESTINATIONS SHOWCASE */}
        <section className="py-24 px-4 bg-slate-950 border-t border-slate-900 relative">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Hand-Picked Packages</div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Featured Travel Destinations</h2>
                <p className="text-slate-400 mt-2 text-sm max-w-xl">
                  Uncover top-rated travel packages curated by expert travel planners and backed by verified traveler reviews.
                </p>
              </div>
              <Link
                href="/itineraries"
                className={buttonVariants({
                  variant: "outline",
                  className: "border-slate-800 text-teal-400 hover:text-teal-300 hover:bg-slate-900 font-semibold cursor-pointer shrink-0"
                })}
              >
                View All Destinations
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>

            {/* Destination Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations.map((dest) => (
                <Card
                  key={dest.id}
                  className="bg-slate-900 border-slate-800 overflow-hidden text-white shadow-xl hover:border-slate-700 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-teal-400 uppercase border border-teal-500/30">
                      {dest.badge}
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-full text-slate-300 hover:text-rose-400 transition-colors cursor-pointer">
                      <Heart className="h-4 w-4" />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs">
                      <span className="bg-slate-950/90 backdrop-blur-md text-slate-300 px-2.5 py-1 rounded-md flex items-center font-medium">
                        <Clock className="h-3 w-3 mr-1 text-teal-400" /> {dest.duration}
                      </span>
                      <span className="bg-teal-500 text-slate-950 px-2.5 py-1 rounded-md font-black text-xs">
                        ${dest.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="flex items-center text-teal-400 font-semibold">
                          <MapPin className="h-3.5 w-3.5 mr-1" /> {dest.location}
                        </span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {dest.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-1">
                        {dest.name}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center text-xs text-amber-400 font-bold space-x-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{dest.rating}</span>
                        <span className="text-slate-500 font-normal">({dest.reviewsCount})</span>
                      </div>

                      <Link
                        href={`/itineraries`}
                        className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center hover:underline"
                      >
                        Explore Package
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: DYNAMIC VALUE PROPOSITION */}
        <section className="py-20 px-4 bg-slate-900/30 border-t border-slate-900 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Smart Travel Features at Your Service</h2>
              <p className="text-slate-400 mt-2">Discover how our specialized travel tools simplify your journeys</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="bg-slate-900/50 border-slate-900 hover:border-slate-800 transition-all duration-300 text-white p-6 shadow-xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />
                <CardHeader className="p-0 mb-4">
                  <div className="h-12 w-12 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20 text-teal-400 mb-4 shrink-0">
                    <Compass className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Smart Travel Schedules</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Browse verified day-by-day travel packages. Filter blueprints by category, duration, or budget, and organize your trips on your dashboard.
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
                  <CardTitle className="text-xl font-bold text-white">Instant Expense Scanner</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Upload travel receipts to automatically extract merchant, category, date, and costs, keeping your trip budget on track effortless.
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
                  <CardTitle className="text-xl font-bold text-white">AI Travel Assistant</CardTitle>
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

        {/* SECTION 3: GLOBAL TRAVEL METRICS */}
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

        {/* SECTION 4: POPULAR CATEGORIES */}
        <section className="py-20 px-4 bg-slate-950 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Explore Travel Styles</h2>
                <p className="text-slate-400 mt-2">Filter itineraries by your travel mood and interest</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                {categories.map((c) => (
                  <Button
                    key={c.name}
                    variant="ghost"
                    onClick={() => setActiveCategoryTab(c.name)}
                    className={`text-xs font-semibold px-4 py-1.5 rounded-full border cursor-pointer ${
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
                      <h3 className="text-2xl font-black text-white">{c.name} Experiences</h3>
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

        {/* SECTION 5: INTERACTIVE CHAT PREVIEW SIMULATOR */}
        <section className="py-20 px-4 bg-slate-900/20 border-t border-slate-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Interactive AI Travel Assistance</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Get an instant preview of how our persistent travel assistant behaves. Our Travel Copilot understands exactly where you are in your itinerary, tracking your budget and schedules.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  "Contextual knowledge of active itineraries & destinations",
                  "Instant breakdown of expense & budget metrics",
                  "Actionable, personalized travel recommendations"
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
                  <span className="font-bold text-white">Travel Assistant Simulator</span>
                </div>
                <span className="bg-teal-500/10 border border-teal-500/30 text-teal-400 px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto flex-grow text-xs leading-relaxed no-scrollbar">
                <div className="flex space-x-2 mr-auto max-w-[80%]">
                  <div className="h-6 w-6 bg-slate-800 text-teal-400 rounded-full flex items-center justify-center shrink-0">
                    <BrainCircuit className="h-3 w-3" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-tl-none border border-slate-700/50">
                    Hi! I see you have an upcoming trip to **Kyoto** and spent **$185** on Accommodation. Ask me to outline your daily plan!
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
                <Input placeholder="Message travel assistant..." className="bg-slate-950 border-slate-800 text-xs h-8 text-white" disabled />
                <Button className="h-8 bg-teal-500 text-slate-950 text-xs font-bold" disabled>Send</Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: TESTIMONIALS */}
        <section className="py-20 px-4 bg-slate-900/20 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Trusted by Explorers Worldwide</h2>
              <p className="text-slate-400 mt-2">See how travelers streamline their journeys with AuraTravel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The receipt scanner is pure magic. I uploaded my hotel receipt from Rome and it extracted costs and categorized it instantly.",
                  author: "Alexander Mercer",
                  role: "Adventure Blogger"
                },
                {
                  quote: "Being able to chat with my travel copilot while looking at my Kyoto itinerary was incredible. It remembered all my daily schedules.",
                  author: "Sarah Connor",
                  role: "Family Vacation Coordinator"
                },
                {
                  quote: "AuraTravel is the best travel app I've used. The curated itineraries and clean dashboard make organizing trips effortless.",
                  author: "Marcus Aurelius",
                  role: "Digital Nomad"
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
                    className="w-full flex items-center justify-between text-left font-bold text-slate-200 hover:text-white py-2 focus:outline-none cursor-pointer"
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
            <h2 className="text-3xl font-black text-white">Subscribe to Travel Guides & Tips</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Get monthly emails on newly featured destination packages, travel guides, and exclusive budget hacks.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed! Thank you."); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-slate-950 border-slate-800 text-white text-xs h-10 placeholder:text-slate-700" required />
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold h-10 px-6 shrink-0 cursor-pointer">Subscribe</Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
