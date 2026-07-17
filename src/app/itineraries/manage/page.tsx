"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AlertCircle, Eye, Trash2, Calendar, Plane, Plus, MapPin } from "lucide-react";

interface ItineraryRow {
  _id: string;
  title: string;
  destination: string;
  category: string;
  duration: number;
  cost: number;
  coverImage: string;
  createdAt: string;
  isPublic?: boolean;
}

interface BookingRow {
  _id: string;
  itineraryId: ItineraryRow | null;
  price: number;
  numberOfTravelers: number;
  totalPrice: number;
  startDate: string;
  status: string;
  createdAt: string;
}

export default function ManageDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = authClient.useSession();
  const [deleteError, setDeleteError] = useState("");
  const [activeTab, setActiveTab] = useState<"booked" | "created">("booked");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Fetch only my itineraries (created)
  const {
    data: itineraries,
    isLoading: isCreatedLoading,
    isError: isCreatedError
  } = useQuery<ItineraryRow[]>({
    queryKey: ["my-itineraries"],
    queryFn: () => apiFetch("/api/itineraries/my"),
    enabled: !!session
  });

  // Fetch only my bookings (purchased)
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    isError: isBookingsError
  } = useQuery<BookingRow[]>({
    queryKey: ["my-bookings"],
    queryFn: () => apiFetch("/api/bookings/my"),
    enabled: !!session
  });

  const isLoading = activeTab === "booked" ? isBookingsLoading : isCreatedLoading;
  const isError = activeTab === "booked" ? isBookingsError : isCreatedError;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/itineraries/${id}`, {
        method: "DELETE"
      }),
    onSuccess: () => {
      // Invalidate query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["my-itineraries"] });
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
    },
    onError: (err: any) => {
      setDeleteError(err.message || "Failed to delete itinerary.");
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this itinerary? This action cannot be undone.")) {
      setDeleteError("");
      deleteMutation.mutate(id);
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

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Traveler Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your booked travel itineraries and custom schedules</p>
          </div>
          <Link
            href="/itineraries/add"
            className={buttonVariants({
              className: "bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold shrink-0 cursor-pointer flex items-center justify-center"
            })}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Itinerary
          </Link>
        </div>

        {deleteError && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-lg flex items-center space-x-2 text-sm mb-4">
            <AlertCircle className="h-4 w-4" />
            <span>{deleteError}</span>
          </div>
        )}

        {/* Custom Tabs */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab("booked")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "booked"
                ? "text-teal-400 border-b-2 border-teal-400 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            My Booked Trips
          </button>
          <button
            onClick={() => setActiveTab("created")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "created"
                ? "text-teal-400 border-b-2 border-teal-400 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            My Custom Itineraries
          </button>
        </div>

        {isLoading ? (
          <Card className="bg-slate-900 border-slate-800 p-6 space-y-3">
            <Skeleton className="h-8 w-full bg-slate-850" />
            <Skeleton className="h-8 w-full bg-slate-850" />
            <Skeleton className="h-8 w-full bg-slate-850" />
          </Card>
        ) : isError ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800">
            <p className="text-rose-400 font-semibold mb-2">Error Loading Dashboard</p>
            <p className="text-slate-500 text-sm">Failed to connect to the backend server.</p>
          </div>
        ) : activeTab === "booked" ? (
          /* BOOKED TRIPS VIEW */
          bookings?.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800">
              <Plane className="mx-auto h-12 w-12 text-slate-600 mb-4 animate-bounce" />
              <p className="text-slate-300 font-semibold text-lg mb-1">No Booked Trips Yet</p>
              <p className="text-slate-500 text-sm mb-6">Explore public itineraries and book your next journey.</p>
              <Link
                href="/itineraries"
                className={buttonVariants({
                  className: "bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold cursor-pointer inline-flex items-center justify-center"
                })}
              >
                Browse Itineraries
              </Link>
            </div>
          ) : (
            <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl">
              <Table>
                <TableHeader className="bg-slate-950">
                  <TableRow className="border-slate-800 hover:bg-slate-950">
                    <TableHead className="text-slate-400 w-[80px] hidden md:table-cell">Cover</TableHead>
                    <TableHead className="text-slate-400">Itinerary</TableHead>
                    <TableHead className="text-slate-400">Start Date</TableHead>
                    <TableHead className="text-slate-400 hidden sm:table-cell">Travelers</TableHead>
                    <TableHead className="text-slate-400 text-right">Total Price</TableHead>
                    <TableHead className="text-slate-400 text-center w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings?.map((booking) => (
                    <TableRow key={booking._id} className="border-slate-850 hover:bg-slate-850/30">
                      <TableCell className="hidden md:table-cell">
                        <div className="h-10 w-12 rounded overflow-hidden relative bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={booking.itineraryId?.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828"}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-white max-w-[200px] truncate">
                        <div>
                          <span className="block truncate">{booking.itineraryId?.title || "Deleted Itinerary"}</span>
                          <span className="text-[10px] text-slate-500 flex items-center mt-0.5 font-normal">
                            <MapPin className="mr-1 h-3 w-3 text-teal-400 shrink-0" />
                            <span className="truncate">{booking.itineraryId?.destination || "Unknown"}</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(booking.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </TableCell>
                      <TableCell className="text-slate-300 hidden sm:table-cell">
                        {booking.numberOfTravelers} Guests
                      </TableCell>
                      <TableCell className="text-right font-extrabold text-teal-400">
                        ${booking.totalPrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {booking.itineraryId ? (
                          <Link
                            href={`/itineraries/${booking.itineraryId._id}`}
                            className={buttonVariants({
                              variant: "ghost",
                              size: "icon",
                              className: "h-8 w-8 text-teal-400 hover:text-teal-300 hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                            })}
                            title="View Itinerary Schedule"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-600">Unavailable</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )
        ) : (
          /* CREATED ITINERARIES VIEW */
          itineraries?.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800">
              <Plane className="mx-auto h-12 w-12 text-slate-600 mb-4 animate-bounce" />
              <p className="text-slate-300 font-semibold text-lg mb-1">No Custom Itineraries Created</p>
              <p className="text-slate-500 text-sm mb-6">Design custom travel packages and share them with the world.</p>
              <Link
                href="/itineraries/add"
                className={buttonVariants({
                  className: "bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold cursor-pointer inline-flex items-center justify-center"
                })}
              >
                Create Itinerary
              </Link>
            </div>
          ) : (
            <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl">
              <Table>
                <TableHeader className="bg-slate-950">
                  <TableRow className="border-slate-800 hover:bg-slate-950">
                    <TableHead className="text-slate-400 w-[80px] hidden md:table-cell">Cover</TableHead>
                    <TableHead className="text-slate-400">Title</TableHead>
                    <TableHead className="text-slate-400">Destination</TableHead>
                    <TableHead className="text-slate-400 hidden sm:table-cell">Status</TableHead>
                    <TableHead className="text-slate-400 hidden sm:table-cell">Category</TableHead>
                    <TableHead className="text-slate-400 hidden sm:table-cell">Duration</TableHead>
                    <TableHead className="text-slate-400 text-right">Cost</TableHead>
                    <TableHead className="text-slate-400 text-center w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itineraries?.map((itinerary) => (
                    <TableRow key={itinerary._id} className="border-slate-850 hover:bg-slate-850/30">
                      <TableCell className="hidden md:table-cell">
                        <div className="h-10 w-12 rounded overflow-hidden relative bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={itinerary.coverImage}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-white max-w-[200px] truncate">
                        {itinerary.title}
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-[150px] truncate">
                        {itinerary.destination}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          itinerary.isPublic !== false
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {itinerary.isPublic !== false ? "Public" : "Private"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="bg-slate-800 text-teal-400 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                          {itinerary.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300 hidden sm:table-cell">
                        {itinerary.duration} Days
                      </TableCell>
                      <TableCell className="text-right font-extrabold text-teal-400">
                        ${itinerary.cost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <Link
                            href={`/itineraries/${itinerary._id}`}
                            className={buttonVariants({
                              variant: "ghost",
                              size: "icon",
                              className: "h-8 w-8 text-teal-400 hover:text-teal-300 hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                            })}
                            title="View Itinerary"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(itinerary._id)}
                            disabled={deleteMutation.isPending}
                            className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                            title="Delete Itinerary"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
