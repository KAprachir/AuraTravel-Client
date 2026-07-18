"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, User, Briefcase, Globe, Award, Sparkles, Compass } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect if already onboarded
  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if (session.user.isOnboarded) {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  // Form states
  const [role, setRole] = useState<"traveler" | "planner">("traveler");
  
  // Traveler fields
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [homeLocation, setHomeLocation] = useState("");

  // Planner fields
  const [bio, setBio] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(1);
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (role === "traveler") {
      if (!homeLocation.trim()) {
        setError("Please enter your home base location.");
        return;
      }
    } else {
      if (!bio.trim()) {
        setError("Please enter a short professional bio.");
        return;
      }
      if (!portfolioUrl.trim()) {
        setError("Please enter your portfolio or social media link.");
        return;
      }
    }

    setError("");
    setLoading(true);

    try {
      await apiFetch("/api/users/onboarding", {
        method: "POST",
        body: JSON.stringify({
          role,
          travelStyle,
          homeLocation,
          bio,
          yearsOfExperience: Number(yearsOfExperience),
          portfolioUrl
        })
      });

      // Force a full reload to reset the Better Auth session state globally
      window.location.href = role === "planner" ? "/planner" : "/itineraries/manage";
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please try again.");
      setLoading(false);
    }
  };

  if (isPending || !session || (session && session.user.isOnboarded)) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-2xl mx-auto px-4 py-12 w-full flex items-center justify-center">
        <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl w-full">
          <CardHeader className="border-b border-slate-800 text-center pb-6 bg-slate-950/20">
            <CardTitle className="text-3xl font-extrabold tracking-tight flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 text-teal-400 animate-pulse" />
              <span>Complete Your Profile</span>
            </CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Select your role and tell us a bit about your travel style or planning expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-lg flex items-center space-x-2 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Role Selector Card Grid */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 block mb-3 text-center">
                  Select Your Role *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Traveler Card */}
                  <div
                    onClick={() => setRole("traveler")}
                    className={`border-2 rounded-xl p-5 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 ${
                      role === "traveler"
                        ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/5 text-white"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <User className={`h-8 w-8 mb-3 ${role === "traveler" ? "text-teal-400" : "text-slate-500"}`} />
                    <span className="font-bold text-sm block">Traveler</span>
                    <span className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      I want to discover itineraries, check off bucket-lists, and track my expenses.
                    </span>
                  </div>

                  {/* Planner Card */}
                  <div
                    onClick={() => setRole("planner")}
                    className={`border-2 rounded-xl p-5 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 ${
                      role === "planner"
                        ? "border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/5 text-white"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <Briefcase className={`h-8 w-8 mb-3 ${role === "planner" ? "text-teal-400" : "text-slate-500"}`} />
                    <span className="font-bold text-sm block">Planner</span>
                    <span className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      I am a professional guide or itinerary creator wanting to publish travel products.
                    </span>
                  </div>
                </div>
              </div>

              {/* Traveler Form Fields */}
              {role === "traveler" && (
                <div className="space-y-4 pt-4 border-t border-slate-800/50 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center">
                      <Compass className="mr-2 h-4 w-4 text-teal-400" />
                      Preferred Travel Style *
                    </label>
                    <select
                      value={travelStyle}
                      onChange={(e) => setTravelStyle(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      {["Adventure", "Budget", "Luxury", "Cultural", "Wellness", "Family", "Eco-tourism"].map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-teal-400" />
                      Home Base Location *
                    </label>
                    <Input
                      required
                      placeholder="E.g., London, UK or New York, USA"
                      value={homeLocation}
                      onChange={(e) => setHomeLocation(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {/* Planner Form Fields */}
              {role === "planner" && (
                <div className="space-y-4 pt-4 border-t border-slate-800/50 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center">
                      <Award className="mr-2 h-4 w-4 text-teal-400" />
                      Years of Experience *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="40"
                      required
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(Math.max(0, Number(e.target.value)))}
                      className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Professional Bio *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="E.g., Certified local tour guide specializing in Alpine trekking and culinary expeditions across Western Europe."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-md bg-slate-950 border border-slate-800 text-white text-sm p-3 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder:text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-teal-400" />
                      Portfolio or Social URL *
                    </label>
                    <Input
                      required
                      placeholder="https://instagram.com/myusername or https://mywebsite.com"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-6 py-2 rounded-md transition-colors"
                >
                  {loading ? "Saving Profile..." : "Complete Setup"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
