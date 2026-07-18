"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Clock,
  Star,
  Tag,
  Calendar,
  User,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  CalendarDays,
  Users,
  Check,
  AlertCircle
} from "lucide-react";

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
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // Booking states
  const [startDate, setStartDate] = useState("");
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Payment form states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Auto-set tomorrow's date as default start date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    // Format with spaces: 4242 4242 4242 4242
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardCvv(value.slice(0, 4));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    if (!startDate) {
      setBookingError("Please select a travel start date.");
      return;
    }

    // Basic CC validation
    const rawCardNum = cardNumber.replace(/\s/g, "");
    if (rawCardNum.length < 16) {
      setBookingError("Please enter a valid 16-digit card number.");
      return;
    }

    if (!cardExpiry.includes("/") || cardExpiry.length < 5) {
      setBookingError("Please enter a valid expiration date (MM/YY).");
      return;
    }

    if (cardCvv.length < 3) {
      setBookingError("Please enter a valid CVV code.");
      return;
    }

    if (!cardName.trim()) {
      setBookingError("Please enter the cardholder's name.");
      return;
    }

    setBookingError("");
    setBookingLoading(true);

    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 1800));

      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          itineraryId: itinerary._id,
          numberOfTravelers,
          startDate
        })
      });

      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.message || "Payment transaction failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Fetch itinerary detail by ID (retrieves { itinerary, related })
  const { data, isLoading, isError } = useQuery({
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
          <Link
            href="/itineraries"
            className={buttonVariants({
              className: "bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold cursor-pointer"
            })}
          >
            Back to Explore
          </Link>
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
                Trip Details & Booking
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
                
                {/* Travel Start Date Selection */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-400 flex items-center">
                    <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
                    Travel Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500 h-9 text-xs"
                  />
                </div>

                {/* Travelers Count Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 flex items-center">
                    <Users className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
                    Number of Travelers
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={numberOfTravelers}
                    onChange={(e) => setNumberOfTravelers(Math.max(1, Number(e.target.value)))}
                    className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500 h-9 text-xs"
                  />
                </div>

                <div className="pt-4 flex justify-between items-end border-t border-slate-800/50">
                  <div>
                    <span className="text-xs text-slate-500 uppercase block">Total Cost</span>
                    <span className="text-2xl font-extrabold text-teal-400">
                      ${(itinerary.cost * numberOfTravelers).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    if (!session) {
                      router.push(`/login?callbackURL=${encodeURIComponent(window.location.pathname)}`);
                    } else {
                      setIsCheckoutOpen(true);
                    }
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold py-2"
                >
                  {session ? "Book This Trip" : "Login to Book"}
                </Button>
                <Link
                  href={`/contact?subject=Question regarding ${encodeURIComponent(itinerary.title)}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full border-slate-800 text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer font-medium"
                  })}
                >
                  Inquire for Details
                </Link>
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
                    <Link
                      href={`/itineraries/${item._id}`}
                      className={buttonVariants({
                        variant: "link",
                        className: "h-auto p-0 text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
                      })}
                    >
                      Details
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        {/* Checkout Modal Overlay */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <Card className="bg-slate-900 border-slate-800 text-white max-w-lg w-full shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-800 bg-slate-950/40 pb-4">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-teal-400" />
                  <span>Secure Itinerary Checkout</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Complete payment to book your custom travel schedule
                </CardDescription>
              </CardHeader>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="h-16 w-16 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Payment Confirmed!</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Your trip has been booked successfully! We have added the schedule and detail plans to your personal dashboard.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <Link
                      href="/itineraries/manage"
                      className={buttonVariants({
                        className: "bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold"
                      })}
                    >
                      Go to Dashboard
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        setBookingSuccess(false);
                        setCardName("");
                        setCardNumber("");
                        setCardExpiry("");
                        setCardCvv("");
                      }}
                      className="border-slate-800 text-slate-300 hover:text-white"
                    >
                      Close Window
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <CardContent className="pt-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {bookingError && (
                      <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-lg flex items-center space-x-2 text-xs">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{bookingError}</span>
                      </div>
                    )}

                    {/* Booking Details Summary */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 text-xs">
                      <h4 className="font-bold text-teal-400 uppercase tracking-wide">Trip Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <div>
                          <span className="text-slate-500 block">Itinerary:</span>
                          <span className="font-medium text-white truncate block">{itinerary.title}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Destination:</span>
                          <span className="font-medium text-white block">{itinerary.destination}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Start Date:</span>
                          <span className="font-medium text-white block">
                            {startDate ? new Date(startDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            }) : ""}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Travelers Count:</span>
                          <span className="font-medium text-white block">{numberOfTravelers} Guests</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-850 flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-400">Total Price:</span>
                        <span className="font-extrabold text-teal-400 text-base">
                          ${(itinerary.cost * numberOfTravelers).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Credit Card Inputs */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wide">Payment Details</h4>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Cardholder Name</label>
                        <Input
                          required
                          placeholder="E.g., John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            required
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Expiration Date</label>
                          <Input
                            required
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleCardExpiryChange}
                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500 font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">CVV</label>
                          <Input
                            required
                            type="password"
                            placeholder="123"
                            value={cardCvv}
                            onChange={handleCardCvvChange}
                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-teal-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-slate-800 bg-slate-950/20 pt-4 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        setBookingError("");
                      }}
                      className="border-slate-800 text-slate-300 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={bookingLoading}
                      className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold"
                    >
                      {bookingLoading ? "Processing Payment..." : `Pay $${(itinerary.cost * numberOfTravelers).toLocaleString()}`}
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
