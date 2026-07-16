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
import { AlertCircle, Plane, Plus, Trash2 } from "lucide-react";

interface DailyActivityInput {
  day: number;
  title: string;
  activities: string[];
}

export default function AddItineraryPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState("Adventure");
  const [dailyPlan, setDailyPlan] = useState<DailyActivityInput[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Adjust daily plan inputs whenever duration changes
  useEffect(() => {
    const daysCount = Number(duration) || 1;
    setDailyPlan((prev) => {
      const plans = [...prev];
      if (plans.length < daysCount) {
        for (let i = plans.length; i < daysCount; i++) {
          plans.push({
            day: i + 1,
            title: `Day ${i + 1} - Exploring ${destination || "Destination"}`,
            activities: [""]
          });
        }
      } else if (plans.length > daysCount) {
        plans.length = daysCount;
      }
      return plans.map((p, idx) => ({ ...p, day: idx + 1 }));
    });
  }, [duration, destination]);

  const handleActivityChange = (dayIdx: number, actIdx: number, val: string) => {
    setDailyPlan((prev) => {
      const plans = [...prev];
      plans[dayIdx].activities[actIdx] = val;
      return plans;
    });
  };

  const addActivityInput = (dayIdx: number) => {
    setDailyPlan((prev) => {
      const plans = [...prev];
      plans[dayIdx].activities.push("");
      return plans;
    });
  };

  const removeActivityInput = (dayIdx: number, actIdx: number) => {
    setDailyPlan((prev) => {
      const plans = [...prev];
      if (plans[dayIdx].activities.length > 1) {
        plans[dayIdx].activities.splice(actIdx, 1);
      }
      return plans;
    });
  };

  const handleDayTitleChange = (dayIdx: number, val: string) => {
    setDailyPlan((prev) => {
      const plans = [...prev];
      plans[dayIdx].title = val;
      return plans;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title ||
      !shortDescription ||
      !fullDescription ||
      !coverImage ||
      !destination ||
      !cost ||
      !category
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Clean activities list (remove empty rows)
    const cleanedDailyPlan = dailyPlan.map((day) => ({
      ...day,
      activities: day.activities.filter((act) => act.trim() !== "")
    }));

    setError("");
    setLoading(true);

    try {
      await apiFetch("/api/itineraries", {
        method: "POST",
        body: JSON.stringify({
          title,
          shortDescription,
          fullDescription,
          coverImage,
          destination,
          duration: Number(duration),
          cost: Number(cost),
          category,
          dailyPlan: cleanedDailyPlan
        })
      });
      router.push("/itineraries/manage");
    } catch (err: any) {
      setError(err.message || "Failed to create itinerary. Please try again.");
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-2xl flex items-center space-x-2">
              <Plane className="h-6 w-6 text-teal-400" />
              <span>Create New Itinerary</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Publish a custom travel itinerary to the public directory and save it to your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-lg flex items-center space-x-2 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Itinerary Title *</label>
                  <Input
                    required
                    placeholder="E.g., Patagonia Wilderness Explorer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Destination *</label>
                  <Input
                    required
                    placeholder="E.g., Chile / Argentina"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500"
                  />
                </div>
              </div>

              {/* Categorization & Finance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-slate-950 border border-slate-850 text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {["Adventure", "Beach", "Cultural", "Wellness", "Food", "Family"].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Duration (Days) *</label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Total Cost ($) *</label>
                  <Input
                    type="number"
                    min="0"
                    required
                    placeholder="E.g., 1500"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Cover Image URL *</label>
                <Input
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Short Summary *</label>
                <Input
                  required
                  placeholder="A one-sentence engaging highlight of the trip"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Detailed Overview *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the entire trip, accommodation details, highlights..."
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full rounded-md bg-slate-950 border border-slate-800 text-white text-sm p-3 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder:text-slate-700"
                />
              </div>

              {/* Dynamic Daily Plan Inputs */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Day-by-Day Schedule Plans</h3>
                <p className="text-xs text-slate-400">Specify what travelers will do each day.</p>

                <div className="space-y-6">
                  {dailyPlan.map((day, dayIdx) => (
                    <div
                      key={day.day}
                      className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="h-6 w-6 bg-teal-500 text-slate-950 font-bold rounded-full flex items-center justify-center text-xs shrink-0">
                          {day.day}
                        </span>
                        <Input
                          required
                          value={day.title}
                          onChange={(e) => handleDayTitleChange(dayIdx, e.target.value)}
                          placeholder={`Day ${day.day} Heading`}
                          className="bg-slate-900 border-slate-800 text-white"
                        />
                      </div>

                      <div className="space-y-2 pl-8">
                        <label className="text-xs font-semibold text-slate-400 block">
                          Activities
                        </label>
                        {day.activities.map((activity, actIdx) => (
                          <div key={actIdx} className="flex items-center space-x-2">
                            <Input
                              required
                              value={activity}
                              onChange={(e) =>
                                handleActivityChange(dayIdx, actIdx, e.target.value)
                              }
                              placeholder={`Activity ${actIdx + 1}`}
                              className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                            />
                            {day.activities.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeActivityInput(dayIdx, actIdx)}
                                className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-slate-850 shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => addActivityInput(dayIdx)}
                          className="text-xs text-teal-400 hover:text-teal-300 hover:bg-slate-900 p-0 h-8"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add Activity
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/itineraries/manage")}
                  className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold"
                >
                  {loading ? "Publishing..." : "Publish Itinerary"}
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
