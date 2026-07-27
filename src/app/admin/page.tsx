"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertCircle,
  Shield,
  Search,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  XCircle,
  UserCheck,
  FileCheck,
  ExternalLink,
  MapPin
} from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "traveler" | "planner" | "admin";
  createdAt: string;
}

interface PendingPlanner {
  id: string;
  name: string;
  email: string;
  bio?: string;
  yearsOfExperience?: number;
  portfolioUrl?: string;
  plannerApprovalStatus: string;
  createdAt: string;
}

interface PendingItinerary {
  _id: string;
  title: string;
  shortDescription: string;
  destination: string;
  duration: number;
  cost: number;
  category: string;
  coverImage: string;
  creator: string;
  createdAt: string;
}

interface PlatformBooking {
  id: string;
  itinerary: {
    _id: string;
    title: string;
    destination: string;
  } | null;
  traveler: { name: string; email: string };
  planner: { name: string; email: string };
  price: number;
  numberOfTravelers: number;
  totalPrice: number;
  startDate: string;
  status: string;
  createdAt: string;
}

interface PlatformSalesResponse {
  bookings: PlatformBooking[];
  stats: {
    totalBookings: number;
    totalRevenue: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = authClient.useSession();
  const [search, setSearch] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"planner_reviews" | "itinerary_approvals" | "transactions" | "users">("planner_reviews");

  // Redirect if not admin
  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if (session.user.role !== "admin") {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  // Fetch pending planners
  const { data: pendingPlanners, isLoading: isPlannersLoading } = useQuery<PendingPlanner[]>({
    queryKey: ["admin-pending-planners"],
    queryFn: () => apiFetch("/api/users/planners/pending"),
    enabled: !!session && session.user.role === "admin"
  });

  // Fetch pending itineraries
  const { data: pendingItineraries, isLoading: isItinerariesLoading } = useQuery<PendingItinerary[]>({
    queryKey: ["admin-pending-itineraries"],
    queryFn: () => apiFetch("/api/itineraries/pending"),
    enabled: !!session && session.user.role === "admin"
  });

  // Fetch users list
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError
  } = useQuery<UserRow[]>({
    queryKey: ["admin-users", search],
    queryFn: () => apiFetch(`/api/users?search=${encodeURIComponent(search)}`),
    enabled: !!session && session.user.role === "admin"
  });

  // Fetch platform sales
  const { data: salesData, isLoading: isSalesLoading } = useQuery<PlatformSalesResponse>({
    queryKey: ["admin-sales"],
    queryFn: () => apiFetch("/api/bookings/all"),
    enabled: !!session && session.user.role === "admin"
  });

  // Planner approval mutations
  const approvePlannerMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/users/${id}/approve-planner`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-planners"] });
      setSuccessMsg("Planner application approved successfully.");
      setUpdateError("");
    },
    onError: (err: any) => setUpdateError(err.message || "Failed to approve planner.")
  });

  const rejectPlannerMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/users/${id}/reject-planner`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-planners"] });
      setSuccessMsg("Planner application rejected.");
      setUpdateError("");
    },
    onError: (err: any) => setUpdateError(err.message || "Failed to reject planner.")
  });

  // Itinerary approval mutations
  const approveItineraryMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/itineraries/${id}/approve`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-itineraries"] });
      setSuccessMsg("Itinerary approved and published to Explore directory.");
      setUpdateError("");
    },
    onError: (err: any) => setUpdateError(err.message || "Failed to approve itinerary.")
  });

  const rejectItineraryMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/itineraries/${id}/reject`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-itineraries"] });
      setSuccessMsg("Itinerary rejected.");
      setUpdateError("");
    },
    onError: (err: any) => setUpdateError(err.message || "Failed to reject itinerary.")
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/bookings/${id}/cancel`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sales"] });
      setSuccessMsg("Booking cancelled and refunded successfully.");
      setUpdateError("");
    },
    onError: (err: any) => setUpdateError(err.message || "Failed to cancel booking.")
  });

  // Role update mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiFetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSuccessMsg("User role updated successfully.");
      setUpdateError("");
    },
    onError: (err: any) => {
      setUpdateError(err.message || "Failed to update user role.");
    }
  });

  if (isPending || (session && session.user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto" />
            <Skeleton className="h-4 w-48 bg-slate-200 dark:bg-slate-800 mx-auto animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Shield className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              <span>Admin <span className="text-teal-600 dark:text-teal-400">Control Center</span></span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Full governance: Approve Planners, Review Itineraries, and Control Customer Bookings</p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {updateError && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 p-3 rounded-lg mb-6 flex items-center space-x-2 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{updateError}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 p-3 rounded-lg mb-6 flex items-center space-x-2 text-sm">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Platform Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </CardHeader>
            <CardContent>
              {isSalesLoading ? (
                <Skeleton className="h-8 w-24 bg-slate-100 dark:bg-slate-850" />
              ) : (
                <div className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  ${(salesData?.stats.totalRevenue || 0).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Bookings</CardTitle>
              <ShoppingBag className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </CardHeader>
            <CardContent>
              {isSalesLoading ? (
                <Skeleton className="h-8 w-24 bg-slate-100 dark:bg-slate-850" />
              ) : (
                <div className="text-xl font-bold">
                  {salesData?.stats.totalBookings || 0} Trips
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Planners</CardTitle>
              <UserCheck className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-amber-500 dark:text-amber-400">
                {pendingPlanners?.length || 0} Applications
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Itineraries</CardTitle>
              <FileCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-teal-600 dark:text-teal-400">
                {pendingItineraries?.length || 0} Submissions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("planner_reviews")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "planner_reviews"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 dark:border-teal-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Planner Reviews ({pendingPlanners?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("itinerary_approvals")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "itinerary_approvals"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 dark:border-teal-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Itinerary Approvals ({pendingItineraries?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "transactions"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 dark:border-teal-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Who Booked What (Transactions)
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "users"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 dark:border-teal-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            User Accounts
          </button>
        </div>

        {/* VIEW 1: PLANNER ACCOUNTS REVIEW */}
        {activeTab === "planner_reviews" && (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <CardTitle>Planner Account Approval Queue</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Review onboarded planner accounts (Experience, Bio, Portfolio) before granting seller access
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isPlannersLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                  <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                </div>
              ) : !pendingPlanners || pendingPlanners.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No pending planner applications. All applications are up to date!
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-100 dark:bg-slate-950">
                    <TableRow className="border-slate-200 dark:border-slate-800">
                      <TableHead className="text-slate-600 dark:text-slate-400">Applicant</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Experience</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Bio & Portfolio</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-center w-[180px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPlanners.map((planner) => (
                      <TableRow key={planner.id} className="border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/30">
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-200">
                          <div>
                            <span className="block">{planner.name}</span>
                            <span className="text-[10px] text-slate-500 block">{planner.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 text-xs">
                          {planner.yearsOfExperience || 0} Years
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 max-w-[280px]">
                          <p className="text-xs line-clamp-2">{planner.bio || "No bio provided."}</p>
                          {planner.portfolioUrl && (
                            <a
                              href={planner.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center mt-1"
                            >
                              <ExternalLink className="mr-1 h-3 w-3" /> Portfolio Link
                            </a>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => approvePlannerMutation.mutate(planner.id)}
                              disabled={approvePlannerMutation.isPending}
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold cursor-pointer"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectPlannerMutation.mutate(planner.id)}
                              disabled={rejectPlannerMutation.isPending}
                              className="text-xs font-bold cursor-pointer"
                            >
                              Reject
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

        {/* VIEW 2: ITINERARY SUBMISSION APPROVALS */}
        {activeTab === "itinerary_approvals" && (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <CardTitle>Public Itinerary Approval Queue</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Review public itinerary submissions from planners before publishing them to the Explore directory
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isItinerariesLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                  <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                </div>
              ) : !pendingItineraries || pendingItineraries.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No pending itinerary submissions requiring review.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-100 dark:bg-slate-950">
                    <TableRow className="border-slate-200 dark:border-slate-800">
                      <TableHead className="text-slate-600 dark:text-slate-400 w-[80px] hidden md:table-cell">Cover</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Title & Destination</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Category & Duration</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-right">Cost</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-center w-[180px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingItineraries.map((it) => (
                      <TableRow key={it._id} className="border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/30">
                        <TableCell className="hidden md:table-cell">
                          <div className="h-10 w-12 rounded overflow-hidden bg-slate-200 dark:bg-slate-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={it.coverImage} alt="" className="object-cover w-full h-full" />
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-200 max-w-[220px]">
                          <span className="block truncate">{it.title}</span>
                          <span className="text-[10px] text-slate-500 flex items-center mt-0.5 font-normal">
                            <MapPin className="mr-1 h-3 w-3 text-teal-600 dark:text-teal-400 shrink-0" /> {it.destination}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                          <span className="bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded uppercase font-semibold text-[10px] mr-2">
                            {it.category}
                          </span>
                          {it.duration} Days
                        </TableCell>
                        <TableCell className="text-right text-teal-600 dark:text-teal-400 font-extrabold">
                          ${it.cost.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => approveItineraryMutation.mutate(it._id)}
                              disabled={approveItineraryMutation.isPending}
                              className="bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-bold cursor-pointer"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectItineraryMutation.mutate(it._id)}
                              disabled={rejectItineraryMutation.isPending}
                              className="text-xs font-bold cursor-pointer"
                            >
                              Reject
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

        {/* VIEW 3: WHO BOOKED WHAT & FULL CONTROL */}
        {activeTab === "transactions" && (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <CardTitle>Who Booked What (Transaction Control)</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Audit every traveler booking on the platform with seller details, trip dates, and admin cancellation powers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isSalesLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                  <Skeleton className="h-8 w-full bg-slate-100 dark:bg-slate-850" />
                </div>
              ) : salesData?.bookings.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No transaction records found in the database.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-100 dark:bg-slate-950">
                    <TableRow className="border-slate-200 dark:border-slate-800">
                      <TableHead className="text-slate-600 dark:text-slate-400">Itinerary Package</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Traveler (Buyer)</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Planner (Seller)</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Start Date</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-right">Total Price</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-center w-[120px]">Admin Control</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData?.bookings.map((booking) => (
                      <TableRow key={booking.id} className="border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/30">
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-200">
                          {booking.itinerary?.title || "Deleted Itinerary"}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">
                          <div>
                            <span className="block font-medium">{booking.traveler.name}</span>
                            <span className="text-[10px] text-slate-500 block">{booking.traveler.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">
                          <div>
                            <span className="block font-medium">{booking.planner.name}</span>
                            <span className="text-[10px] text-slate-500 block">{booking.planner.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400 text-xs">
                          {new Date(booking.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            booking.status === "cancelled"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {booking.status === "cancelled" ? "Cancelled" : "Paid"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-teal-600 dark:text-teal-400 font-extrabold">
                          ${booking.totalPrice.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {booking.status !== "cancelled" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelBookingMutation.mutate(booking.id)}
                              disabled={cancelBookingMutation.isPending}
                              className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            >
                              Cancel & Refund
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
        )}

        {/* VIEW 4: USER ACCOUNTS & ROLE CONTROL */}
        {activeTab === "users" && (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  View and manage permissions for registered travelers and planners
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isUsersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-slate-100 dark:bg-slate-800/50" />
                  ))}
                </div>
              ) : isUsersError ? (
                <div className="text-center py-8 text-rose-500 dark:text-rose-400 flex flex-col items-center space-y-2">
                  <AlertCircle className="h-10 w-10" />
                  <p>Failed to load users list. Please try again later.</p>
                </div>
              ) : users && users.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No users found matching "{search}"</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                      <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-600 dark:text-slate-400">Name</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400">Email</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400">Joined Date</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400 text-right">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user.id} className="border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                          <TableCell className="font-medium text-slate-900 dark:text-white">{user.name}</TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">{user.email}</TableCell>
                          <TableCell className="text-slate-500 dark:text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <select
                              value={user.role}
                              disabled={updateRoleMutation.isPending}
                              onChange={(e) =>
                                updateRoleMutation.mutate({
                                  userId: user.id,
                                  role: e.target.value
                                })
                              }
                              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-sm text-teal-600 dark:text-teal-400 font-medium focus:outline-none focus:border-teal-500 disabled:opacity-50"
                            >
                              <option value="traveler">Traveler</option>
                              <option value="planner">Planner</option>
                              <option value="admin">Admin</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
