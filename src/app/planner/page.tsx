"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { DollarSign, ShoppingBag, TrendingUp, Calendar, MapPin, Eye, ArrowLeft } from "lucide-react";

interface Itinerary {
  _id: string;
  title: string;
  destination: string;
  cost: number;
  coverImage: string;
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
  const { data: session, isPending } = authClient.useSession();

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
  const { data, isLoading, isError } = useQuery<SalesResponse>({
    queryKey: ["planner-sales"],
    queryFn: () => apiFetch("/api/bookings/sales"),
    enabled: !!session && ["planner", "admin"].includes(session.user.role || "")
  });

  if (isPending || isLoading || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    );
  }

  const { bookings = [], stats = { totalBookings: 0, totalRevenue: 0, avgOrderValue: 0 } } = data || {};

  // Aggregate Recharts data by day
  const aggregatedEarnings: Record<string, number> = {};
  [...bookings].reverse().forEach((b) => {
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

  // Aggregate product metrics
  const itinerarySales: Record<string, { title: string; dest: string; sales: number; revenue: number; cost: number }> = {};
  bookings.forEach((b) => {
    if (!b.itineraryId) return;
    const id = b.itineraryId._id;
    if (!itinerarySales[id]) {
      itinerarySales[id] = {
        title: b.itineraryId.title,
        dest: b.itineraryId.destination,
        sales: 0,
        revenue: 0,
        cost: b.itineraryId.cost
      };
    }
    itinerarySales[id].sales += b.numberOfTravelers;
    itinerarySales[id].revenue += b.totalPrice;
  });

  const productStats = Object.values(itinerarySales).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Seller Dashboard</span>
              <span className="bg-teal-500/10 text-teal-400 text-xs font-semibold px-2.5 py-0.5 rounded border border-teal-500/20">
                Planner Portal
              </span>
            </h1>
            <p className="text-slate-400 mt-1">Monitor your listed itinerary sales, bookings and earnings</p>
          </div>
          <Link
            href="/itineraries/add"
            className="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-4 py-2 rounded-md text-sm transition-colors"
          >
            Create New Product
          </Link>
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-400">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Cumulative sales income</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">Total Bookings</CardTitle>
              <ShoppingBag className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings} Orders</div>
              <p className="text-xs text-slate-500 mt-1">Reservations submitted by travelers</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">Avg. Booking Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(stats.avgOrderValue).toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Average transaction size</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart View */}
        <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-slate-800 bg-slate-950/20 pb-4">
            <CardTitle className="text-lg">Revenue Earnings Progression</CardTitle>
            <CardDescription className="text-slate-500">Sales volume performance over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-600 text-sm">
                No transaction data available to plot trends.
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
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

        {/* Split Grid for Product Sales & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Performance Card */}
          <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden">
            <CardHeader className="bg-slate-950/20 border-b border-slate-800 pb-3">
              <CardTitle className="text-base">Listing Performance (Products)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {productStats.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No active listings with bookings.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-900/10">
                      <TableHead className="text-slate-400">Itinerary Title</TableHead>
                      <TableHead className="text-slate-400 text-center">Tickets</TableHead>
                      <TableHead className="text-slate-400 text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productStats.map((prod, idx) => (
                      <TableRow key={idx} className="border-slate-850 hover:bg-slate-850/20">
                        <TableCell className="font-medium max-w-[200px] truncate text-slate-200">
                          <div>
                            <span className="block truncate">{prod.title}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{prod.dest}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{prod.sales}</TableCell>
                        <TableCell className="text-right text-teal-400 font-extrabold">
                          ${prod.revenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Sales Transaction Table */}
          <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden">
            <CardHeader className="bg-slate-950/20 border-b border-slate-800 pb-3">
              <CardTitle className="text-base">Recent Sales Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No purchase transactions completed yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-900/10">
                      <TableHead className="text-slate-400">Product</TableHead>
                      <TableHead className="text-slate-400">Start Date</TableHead>
                      <TableHead className="text-slate-400 text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 8).map((b) => (
                      <TableRow key={b._id} className="border-slate-850 hover:bg-slate-850/20">
                        <TableCell className="font-semibold text-slate-200">
                          {b.itineraryId?.title || "Deleted Itinerary"}
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {new Date(b.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </TableCell>
                        <TableCell className="text-right text-teal-400 font-extrabold">
                          ${b.totalPrice.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
