"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Star, Tag, Calendar, User, ArrowLeft, CheckCircle } from "lucide-react";

interface DailyActivity {
  day: number;
  title: string;
  activities: string[];
}

interface ItineraryData {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  destination: string;
  duration: number;
  cost: number;
  rating: number;
  category: string;
  dailyPlan: DailyActivity[];
  creator: string;
  createdAt: string;
}

interface RelatedItinerary {
  _id: string;
  title: string;
  coverImage: string;
  destination: string;
  duration: number;
  cost: number;
  category: string;
}

export default function ItineraryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = use(params);

  // Fetch itinerary detail by ID (retrieves { itinerary, related })
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["itinerary", id],
    queryFn: () => apiFetch(`/api/itineraries/${id}`)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full space-y-6">
          <Skeleton className="h-8 w-1/4 bg-slate-800" />
          <Skeleton className="h-[400px] w-full bg-slate-800 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4 bg-slate-800" />
              <Skeleton className="h-24 w-full bg-slate-800" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full bg-slate-800" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-grow flex flex-col justify-center items-center py-16">
          <p className="text-rose-400 font-semibold mb-2">Error Loading Itinerary</p>
          <p className="text-slate-500 text-sm mb-4">The requested itinerary could not be found.</p>
          <Button asChild className="bg-teal-500 hover:bg-teal-600 text-slate-950">
            <Link href="/itineraries">Back to Explore</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const itinerary: ItineraryData = data.itinerary;
  const related: RelatedItinerary[] = data.related || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Back Link */}
        <Link
          href="/itineraries"
          className="inline-flex items-center text-sm text-slate-400 hover:text-teal-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Explore
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden h-[350px] md:h-[450px] mb-8 border border-slate-800 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={itinerary.coverImage} alt={itinerary.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="bg-teal-500 text-slate-950 font-bold px-3 py-1 rounded text-xs uppercase flex items-center shadow-md">
                <Tag className="mr-1.5 h-3.5 w-3.5" />
                {itinerary.category}
              </span>
              <span className="bg-slate-900/80 backdrop-blur-sm text-slate-200 border border-slate-700 px-3 py-1 rounded text-xs flex items-center">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
                {itinerary.destination}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {itinerary.title}
            </h1>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Description & Daily Plan */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">Trip Overview</h2>
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                {itinerary.fullDescription}
              </p>
            </div>

            {/* Daily Schedule */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Daily Itinerary Schedule</h2>
              {itinerary.dailyPlan.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-500">
                  No daily plans structured for this itinerary.
                </div>
              ) : (
                <div className="space-y-4">
                  {itinerary.dailyPlan.map((dayPlan) => (
                    <div
                      key={dayPlan.day}
                      className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-8 w-8 bg-teal-500 text-slate-950 font-extrabold rounded-full flex items-center justify-center text-sm shrink-0">
                          {dayPlan.day}
                        </div>
                        <h3 className="font-bold text-white text-base">{dayPlan.title}</h3>
                      </div>
                      <ul className="space-y-2.5 pl-11">
                        {dayPlan.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start text-slate-300 text-sm space-x-2">
                            <CheckCircle className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Statistics & Call to Action */}
          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 text-white p-6 shadow-xl sticky top-24">
              <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3 mb-4">
                Trip Details
              </h3>
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-slate-500 flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-teal-400" />
                    Duration
                  </span>
                  <span className="font-bold text-slate-200">{itinerary.duration} Days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-slate-500 flex items-center">
                    <Star className="mr-2 h-4 w-4 text-amber-500 fill-amber-500" />
                    Rating
                  </span>
                  <span className="font-bold text-amber-400">{itinerary.rating} / 5.0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-slate-500 flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                    Author
                  </span>
                  <span className="font-semibold text-slate-400 flex items-center">
                    <User className="mr-1 h-3.5 w-3.5 text-teal-400" />
                    {itinerary.creator === "admin-system-seed" ? "AuraTravel Team" : "Local Guide"}
                  </span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-500 uppercase block">Total Cost</span>
                    <span className="text-2xl font-extrabold text-teal-400">
                      ${itinerary.cost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold py-2">
                  Book This Trip
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-slate-800 text-white hover:bg-slate-800"
                >
                  <Link href={`/contact?subject=Question regarding ${encodeURIComponent(itinerary.title)}`}>
                    Inquire for Details
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Items Section */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-slate-900">
            <h2 className="text-2xl font-bold text-white mb-6">Related Itineraries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <Card
                  key={item._id}
                  className="bg-slate-900 border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300 group"
                >
                  <div className="relative h-32 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-3 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-teal-400 font-semibold uppercase mb-1">
                        {item.category}
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-teal-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 flex items-center mt-1">
                        <MapPin className="mr-1 h-3 w-3 text-teal-400 shrink-0" />
                        <span className="truncate">{item.destination}</span>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/20 text-xs">
                    <span className="font-bold text-teal-400">${item.cost.toLocaleString()}</span>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto p-0 text-teal-400 hover:text-teal-300 font-semibold"
                    >
                      <Link href={`/itineraries/${item._id}`}>Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
