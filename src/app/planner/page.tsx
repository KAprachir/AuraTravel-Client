"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Plus,
  MapPin,
  Eye,
  Trash2,
  Edit,
  XCircle,
  AlertCircle,
  CheckCircle,
  Tag
} from "lucide-react";

interface Itinerary {
  _id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  destination: string;
  duration: number;
  cost: number;
  category: string;
  coverImage: string;
  isPublic?: boolean;
  createdAt: string;
}

interface Booking {
  _id: string;
  itineraryId: Itinerary | null;
  price: number;
  numberOfTravelers: number;
  totalPrice: number;
  startDate: string;
  status: string;
  createdAt: string;
}

interface SalesResponse {
  bookings: Booking[];
  stats: {
    totalBookings: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
}

export default function PlannerDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = authClient.useSession();

  const [activeTab, setActiveTab] = useState<"sales" | "itineraries">("sales");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit Modal State
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editShortDesc, setEditShortDesc] = useState("");
  const [editFullDesc, setEditFullDesc] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editCategory, setEditCategory] = useState("Adventure");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);

  // Redirect if not authorized as planner or admin
  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if (!["planner", "admin"].includes(session.user.role || "")) {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  // Fetch sales stats
  const { data: salesData, isLoading: isSalesLoading } = useQuery<SalesResponse>({
    queryKey: ["planner-sales"],
    queryFn: () => apiFetch("/api/bookings/sales"),
    enabled: !!session && ["planner", "admin"].includes(session.user.role || "")
  });

  // Fetch planner's created itineraries
  const { data: myItineraries, isLoading: isItinerariesLoading } = useQuery<Itinerary[]>({
    queryKey: ["my-itineraries"],
    queryFn: () => apiFetch("/api/itineraries/my"),
    enabled: !!session && ["planner", "admin"].includes(session.user.role || "")
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) =>
      apiFetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planner-sales"] });
      setSuccessMessage("Booking transaction cancelled successfully.");
      setErrorMessage("");
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to cancel booking.");
    }
  });

  // Delete itinerary mutation
  const deleteItineraryMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/itineraries/${id}`, {
        method: "DELETE"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-itineraries"] });
      queryClient.invalidateQueries({ queryKey: ["planner-sales"] });
      setSuccessMessage("Itinerary deleted successfully.");
      setErrorMessage("");
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to delete itinerary.");
    }
  });

  // Update itinerary mutation
  const updateItineraryMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/itineraries/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          shortDescription: editShortDesc,
          fullDescription: editFullDesc,
          destination: editDestination,
          duration: Number(editDuration),
          cost: Number(editCost),
          category: editCategory,
          coverImage: editCoverImage,
          isPublic: editIsPublic
        })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-itineraries"] });
      setEditingItinerary(null);
      setSuccessMessage("Itinerary updated successfully.");
      setErrorMessage("");
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to update itinerary.");
    }
  });

  const openEditModal = (it: Itinerary) => {
    setEditingItinerary(it);
    setEditTitle(it.title);
    setEditShortDesc(it.shortDescription || "");
    setEditFullDesc(it.fullDescription || "");
    setEditDestination(it.destination);
    setEditDuration(String(it.duration));
    setEditCost(String(it.cost));
    setEditCategory(it.category);
    setEditCoverImage(it.coverImage);
    setEditIsPublic(it.isPublic !== false);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this customer booking transaction?")) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  const handleDeleteItinerary = (id: string) => {
    if (confirm("Are you sure you want to delete this itinerary product?")) {
      deleteItineraryMutation.mutate(id);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center text-slate-900 dark:text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    );
  }

  const { bookings = [], stats = { totalBookings: 0, totalRevenue: 0, avgOrderValue: 0 } } = salesData || {};

  // Aggregate Recharts data by day
  const aggregatedEarnings: Record<string, number> = {};
  [...bookings].reverse().forEach((b) => {
    if (b.status === "cancelled") return;
    const dateStr = new Date(b.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
    aggregatedEarnings[dateStr] = (aggregatedEarnings[dateStr] || 0) + b.totalPrice;
  });

  const chartData = Object.entries(aggregatedEarnings).map(([date, amount]) => ({
    date,
    amount
  }));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <span>Seller Dashboard</span>
              <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold px-2.5 py-0.5 rounded border border-teal-500/20">
                Planner Portal
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage listed itineraries, sales revenue, payment transactions, and listings</p>
          </div>
          <Link
            href="/itineraries/add"
            className="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-4 py-2 rounded-md text-sm transition-colors cursor-pointer"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add New Itinerary
          </Link>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 p-3 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 p-3 rounded-lg flex items-center space-x-2 text-sm">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Sales Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Cumulative sales income</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings} Transactions</div>
              <p className="text-xs text-slate-500 mt-1">Confirmed traveler reservations</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(stats.avgOrderValue).toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Average transaction size</p>
            </CardContent>
          </Card>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "sales"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 dark:border-teal-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Sales Analytics & Transactions
          </button>
          <button
            onClick={() => setActiveTab("itineraries")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "itineraries"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 dark:border-teal-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            My Listed Itineraries ({myItineraries?.length || 0})
          </button>
        </div>

        {activeTab === "sales" ? (
          <div className="space-y-8">
            {/* Revenue Chart */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden shadow-xl">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 pb-4">
                <CardTitle className="text-lg">Revenue Earnings Progression</CardTitle>
                <CardDescription className="text-slate-500">Sales volume performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {chartData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                    No active transaction data available to plot trends.
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.3} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                          labelStyle={{ color: "#94a3b8", fontSize: "12px", fontWeight: "bold" }}
                          itemStyle={{ color: "#14b8a6", fontSize: "12px" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          name="Revenue"
                          stroke="#14b8a6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorAmount)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sales Orders & Payments Management Table */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden shadow-xl">
              <CardHeader className="bg-slate-50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 pb-3">
                <CardTitle className="text-base">Customer Sales & Payment Transactions</CardTitle>
                <CardDescription className="text-slate-500">
                  Review customer bookings and manage payment cancellations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isSalesLoading ? (
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                    <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No sales transactions completed yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-100 dark:bg-slate-950">
                      <TableRow className="border-slate-200 dark:border-slate-800">
                        <TableHead className="text-slate-600 dark:text-slate-400">Itinerary Product</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400">Trip Start Date</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400">Travelers</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400">Payment Status</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400 text-right">Total Paid</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400 text-center w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((b) => (
                        <TableRow key={b._id} className="border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/20">
                          <TableCell className="font-semibold text-slate-900 dark:text-slate-200">
                            {b.itineraryId?.title || "Deleted Itinerary"}
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300 text-xs">
                            {new Date(b.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300 text-xs">
                            {b.numberOfTravelers} Guests
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              b.status === "cancelled"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {b.status === "cancelled" ? "Cancelled" : "Paid"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-teal-600 dark:text-teal-400 font-extrabold">
                            ${b.totalPrice.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {b.status !== "cancelled" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelBooking(b._id)}
                                disabled={cancelBookingMutation.isPending}
                                className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              >
                                Cancel Order
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-500">Refunded</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* LISTED ITINERARIES VIEW (Edit & Delete) */
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden shadow-xl">
            <CardHeader className="bg-slate-50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">My Listed Itineraries</CardTitle>
                <CardDescription className="text-slate-500">
                  Edit, delete, or manage public visibility of your created travel packages
                </CardDescription>
              </div>
              <Link
                href="/itineraries/add"
                className="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition-colors cursor-pointer"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add New Listing
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {isItinerariesLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                  <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                </div>
              ) : !myItineraries || myItineraries.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No itineraries created yet. Click "Add New Listing" to create your first itinerary package!
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-100 dark:bg-slate-950">
                    <TableRow className="border-slate-200 dark:border-slate-800">
                      <TableHead className="text-slate-600 dark:text-slate-400 w-[80px] hidden md:table-cell">Cover</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Title & Destination</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Category</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Visibility</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-right">Cost</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-center w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myItineraries.map((it) => (
                      <TableRow key={it._id} className="border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/20">
                        <TableCell className="hidden md:table-cell">
                          <div className="h-10 w-12 rounded overflow-hidden relative bg-slate-200 dark:bg-slate-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={it.coverImage} alt="" className="object-cover w-full h-full" />
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-white max-w-[220px] truncate">
                          <div>
                            <span className="block truncate">{it.title}</span>
                            <span className="text-[10px] text-slate-500 flex items-center mt-0.5 font-normal">
                              <MapPin className="mr-1 h-3 w-3 text-teal-600 dark:text-teal-400 shrink-0" />
                              <span className="truncate">{it.destination} ({it.duration} Days)</span>
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                            {it.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            it.isPublic !== false
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}>
                            {it.isPublic !== false ? "Public" : "Private"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-teal-600 dark:text-teal-400 font-extrabold">
                          ${it.cost.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <Link
                              href={`/itineraries/${it._id}`}
                              className="h-8 w-8 text-teal-600 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center justify-center cursor-pointer"
                              title="View Listing"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(it)}
                              className="h-8 w-8 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Edit Listing"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItinerary(it._id)}
                              disabled={deleteItineraryMutation.isPending}
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Delete Listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* EDIT ITINERARY MODAL */}
        {editingItinerary && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Edit className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <span>Edit Itinerary Product</span>
                </h3>
                <button
                  onClick={() => setEditingItinerary(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Destination</label>
                    <input
                      type="text"
                      value={editDestination}
                      onChange={(e) => setEditDestination(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Adventure">Adventure</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Budget">Budget</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Relaxation">Relaxation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Duration (Days)</label>
                    <input
                      type="number"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Cost ($)</label>
                    <input
                      type="number"
                      value={editCost}
                      onChange={(e) => setEditCost(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Short Description</label>
                  <input
                    type="text"
                    value={editShortDesc}
                    onChange={(e) => setEditShortDesc(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Cover Image URL</label>
                  <input
                    type="text"
                    value={editCoverImage}
                    onChange={(e) => setEditCoverImage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-teal-600"
                  />
                  <label htmlFor="editIsPublic" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Publish Publicly (Visible in Explore Directory)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItinerary(null)}
                  className="border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => updateItineraryMutation.mutate(editingItinerary._id)}
                  disabled={updateItineraryMutation.isPending}
                  className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold"
                >
                  {updateItineraryMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
