"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Clock,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  DollarSign
} from "lucide-react";

interface ItineraryCardData {
  _id: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  destination: string;
  duration: number;
  cost: number;
  rating: number;
  category: string;
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [duration, setDuration] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["Adventure", "Beach", "Cultural", "Wellness", "Food", "Family"];

  // Fetch itineraries via react-query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["itineraries", search, category, minCost, maxCost, duration, sort, page],
    queryFn: () => {
      let queryStr = `/api/itineraries?page=${page}&sort=${sort}&limit=8`;
      if (search) queryStr += `&search=${encodeURIComponent(search)}`;
      if (category) queryStr += `&category=${category}`;
      if (minCost) queryStr += `&minCost=${minCost}`;
      if (maxCost) queryStr += `&maxCost=${maxCost}`;
      if (duration) queryStr += `&duration=${duration}`;
      return apiFetch(queryStr);
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat === category ? "" : cat);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setMinCost("");
    setMaxCost("");
    setDuration("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header Title */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore Travel Itineraries</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Discover curated trips planned by travelers and optimized by AI</p>
        </div>

        {/* Search & Filter Trigger Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search destinations, titles, keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-teal-500 w-full"
            />
            <Button type="submit" className="absolute right-1 top-1 py-1 px-3 h-8 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs cursor-pointer">
              Search
            </Button>
          </form>

          <div className="flex gap-3 justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-white cursor-pointer ${showFilters ? "bg-slate-100 dark:bg-slate-900 border-teal-500/50" : ""}`}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              Filters
            </Button>

            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              <ArrowUpDown className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent border-none text-slate-700 dark:text-slate-300 text-sm focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Newest</option>
                <option value="rating" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Highest Rated</option>
                <option value="cost_asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cost: Low to High</option>
                <option value="cost_desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cost: High to Low</option>
                <option value="duration_asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Duration: Short to Long</option>
                <option value="duration_desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Duration: Long to Short</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Horizontal Carousel */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth mb-6 border-b border-slate-200 dark:border-slate-900">
          <Button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            variant="ghost"
            className={`rounded-full shrink-0 border border-slate-200 dark:border-slate-800 px-4 py-1.5 text-xs font-semibold cursor-pointer ${
              category === ""
                ? "bg-teal-500 hover:bg-teal-500 text-slate-950 hover:text-slate-950 border-teal-400"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Packages
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              variant="ghost"
              className={`rounded-full shrink-0 border border-slate-200 dark:border-slate-800 px-4 py-1.5 text-xs font-semibold cursor-pointer ${
                category === cat
                  ? "bg-teal-500 hover:bg-teal-500 text-slate-950 hover:text-slate-950 border-teal-400"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Collapsible Filters Pane */}
        {showFilters && (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-4 mb-6 transition-all duration-300 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Min Budget ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minCost}
                    onChange={(e) => {
                      setMinCost(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Max Budget ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxCost}
                    onChange={(e) => {
                      setMaxCost(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Duration (Days)</label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    placeholder="E.g., 7"
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Clear All
              </Button>
            </div>
          </Card>
        )}

        {/* Results Count */}
        {!isLoading && data && (
          <div className="mb-4 text-sm text-slate-500">
            Showing {data.itineraries.length} of {data.total} itineraries found
          </div>
        )}

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card key={idx} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-[380px] flex flex-col justify-between">
                <Skeleton className="h-44 w-full bg-slate-100 dark:bg-slate-850 rounded-t-lg" />
                <div className="p-4 space-y-3 flex-grow">
                  <Skeleton className="h-4 w-1/4 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-5 w-3/4 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-10 w-full bg-slate-100 dark:bg-slate-800" />
                </div>
                <CardFooter className="p-4 border-t border-slate-200 dark:border-slate-850 flex justify-between items-center">
                  <Skeleton className="h-5 w-1/3 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-8 w-1/3 bg-slate-100 dark:bg-slate-800" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-rose-500 dark:text-rose-400 font-semibold mb-2">Error Loading Itineraries</p>
            <p className="text-slate-500 text-sm mb-4">Please make sure the backend server is running.</p>
            <Button onClick={() => refetch()} className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold cursor-pointer">
              Try Again
            </Button>
          </div>
        ) : data?.itineraries.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-800 dark:text-slate-300 font-semibold text-lg mb-1">No Itineraries Found</p>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search keywords.</p>
            <Button onClick={handleClearFilters} className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold cursor-pointer">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.itineraries.map((itinerary: ItineraryCardData) => (
              <Card
                key={itinerary._id}
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group shadow-md hover:shadow-xl"
              >
                {/* Image & Tag */}
                <div className="relative h-44 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={itinerary.coverImage}
                    alt={itinerary.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-teal-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center shadow-md">
                    <Tag className="mr-1 h-3 w-3" />
                    {itinerary.category}
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4 flex-grow flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center text-slate-500 text-xs mb-1">
                      <MapPin className="mr-1 h-3 w-3 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="truncate">{itinerary.destination}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                      {itinerary.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-1.5 line-clamp-2">
                      {itinerary.shortDescription}
                    </p>
                  </div>

                  {/* Metadata Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{itinerary.duration} Days</span>
                    </div>
                    <div className="flex items-center text-amber-500 dark:text-amber-400">
                      <Star className="mr-1 h-3.5 w-3.5 fill-amber-400" />
                      <span className="font-bold">{itinerary.rating}</span>
                    </div>
                  </div>
                </CardContent>

                {/* Footer Cost & Action */}
                <CardFooter className="p-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block leading-none">Cost</span>
                    <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">${itinerary.cost.toLocaleString()}</span>
                  </div>
                  <Link
                    href={`/itineraries/${itinerary._id}`}
                    className={buttonVariants({
                      variant: "outline",
                      className: "border-teal-500/30 text-teal-600 dark:text-teal-400 hover:text-white hover:bg-teal-500 h-8 px-3 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
                    })}
                  >
                    View Details
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && data && data.pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-10">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              variant="outline"
              className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-50 cursor-pointer"
            >
              Previous
            </Button>
            {Array.from({ length: data.pages }).map((_, idx) => (
              <Button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`w-9 h-9 font-bold text-xs rounded cursor-pointer ${
                  page === idx + 1
                    ? "bg-teal-500 text-slate-950 hover:bg-teal-600"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              disabled={page === data.pages}
              onClick={() => setPage(page + 1)}
              variant="outline"
              className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-50 cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
