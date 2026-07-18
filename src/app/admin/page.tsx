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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AlertCircle, Shield, Search, DollarSign, ShoppingBag } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "traveler" | "planner" | "admin";
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
  const [activeTab, setActiveTab] = useState<"users" | "transactions">("users");

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

  // Role update mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiFetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setUpdateError("");
    },
    onError: (err: any) => {
      setUpdateError(err.message || "Failed to update user role.");
    }
  });

  if (isPending || (session && session.user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full bg-slate-800 mx-auto" />
            <Skeleton className="h-4 w-48 bg-slate-800 mx-auto animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center space-x-2">
              <Shield className="h-8 w-8 text-teal-400" />
              <span>Admin <span className="text-teal-400">Dashboard</span></span>
            </h1>
            <p className="text-slate-400 mt-1">Manage user roles and audit platform sales statistics</p>
          </div>
        </div>

        {/* Platform Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">Total Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              {isSalesLoading ? (
                <Skeleton className="h-8 w-24 bg-slate-850" />
              ) : (
                <div className="text-2xl font-bold text-teal-400">
                  ${(salesData?.stats.totalRevenue || 0).toLocaleString()}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">Platform gross transaction volume</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">Total Bookings Completed</CardTitle>
              <ShoppingBag className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              {isSalesLoading ? (
                <Skeleton className="h-8 w-24 bg-slate-850" />
              ) : (
                <div className="text-2xl font-bold">
                  {salesData?.stats.totalBookings || 0} Transactions
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">Total trips purchased across all users</p>
            </CardContent>
          </Card>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "users"
                ? "text-teal-400 border-b-2 border-teal-400 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            User Accounts
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "transactions"
                ? "text-teal-400 border-b-2 border-teal-400 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Platform Transactions
          </button>
        </div>

        {activeTab === "transactions" ? (
          /* PLATFORM TRANSACTIONS VIEW */
          <Card className="bg-slate-900 border-slate-800 text-white shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle>Platform Bookings History</CardTitle>
              <CardDescription className="text-slate-400">
                Audit all reservation transactions and payments completed on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isSalesLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-8 w-full bg-slate-850" />
                  <Skeleton className="h-8 w-full bg-slate-850" />
                </div>
              ) : salesData?.bookings.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No transaction records found in the database.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">Itinerary</TableHead>
                      <TableHead className="text-slate-400">Traveler</TableHead>
                      <TableHead className="text-slate-400">Planner</TableHead>
                      <TableHead className="text-slate-400">Start Date</TableHead>
                      <TableHead className="text-slate-400 text-right">Total Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData?.bookings.map((booking) => (
                      <TableRow key={booking.id} className="border-slate-850 hover:bg-slate-850/30">
                        <TableCell className="font-semibold text-slate-200">
                          {booking.itinerary?.title || "Deleted Itinerary"}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div>
                            <span className="block font-medium">{booking.traveler.name}</span>
                            <span className="text-[10px] text-slate-500 block">{booking.traveler.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div>
                            <span className="block font-medium">{booking.planner.name}</span>
                            <span className="text-[10px] text-slate-500 block">{booking.planner.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {new Date(booking.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </TableCell>
                        <TableCell className="text-right text-teal-400 font-extrabold">
                          ${booking.totalPrice.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ) : (
          /* USER ACCOUNTS VIEW */
          <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
            <CardHeader className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription className="text-slate-400">
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {updateError && (
                <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-lg mb-6 flex items-center space-x-2 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}

              {isUsersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-slate-800/50" />
                  ))}
                </div>
              ) : isUsersError ? (
                <div className="text-center py-8 text-rose-400 flex flex-col items-center space-y-2">
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
                    <TableHeader className="border-slate-800 hover:bg-transparent">
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Name</TableHead>
                        <TableHead className="text-slate-400">Email</TableHead>
                        <TableHead className="text-slate-400">Joined Date</TableHead>
                        <TableHead className="text-slate-400 text-right">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user.id} className="border-slate-800/50 hover:bg-slate-800/20">
                          <TableCell className="font-medium text-white">{user.name}</TableCell>
                          <TableCell className="text-slate-300">{user.email}</TableCell>
                          <TableCell className="text-slate-400">
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
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-teal-400 font-medium focus:outline-none focus:border-teal-500 disabled:opacity-50"
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
