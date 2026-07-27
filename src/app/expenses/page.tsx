"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, UploadCloud, Plus, Calendar, DollarSign, Tag, Landmark, MapPin, Sparkles, BrainCircuit } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

interface ExpenseRow {
  _id: string;
  title: string;
  amount: number;
  category: "Accommodation" | "Transport" | "Dining" | "Activities" | "Shopping" | "Misc";
  date: string;
  location?: string;
  merchant?: string;
  confidenceScore: number;
}

export default function ExpenseDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, isPending } = authClient.useSession();

  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Parsed Modal state
  const [parsedData, setParsedData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Manual Add Form State
  const [manualTitle, setManualTitle] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualCategory, setManualCategory] = useState<ExpenseRow["category"]>("Misc");
  const [manualMerchant, setManualMerchant] = useState("");
  const [manualDate, setManualDate] = useState(new Date().toISOString().split("T")[0]);
  const [manualLocation, setManualLocation] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Fetch expenses
  const { data: expenses, isLoading, isError } = useQuery<ExpenseRow[]>({
    queryKey: ["expenses"],
    queryFn: () => apiFetch("/api/expenses"),
    enabled: !!session
  });

  // Save expense mutation
  const saveMutation = useMutation({
    mutationFn: (expense: any) =>
      apiFetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(expense)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setModalOpen(false);
      setParsedData(null);
      resetManualForm();
    },
    onError: (err: any) => {
      setError(err.message || "Failed to save expense.");
    }
  });

  const resetManualForm = () => {
    setManualTitle("");
    setManualAmount("");
    setManualCategory("Misc");
    setManualMerchant("");
    setManualDate(new Date().toISOString().split("T")[0]);
    setManualLocation("");
  };

  // Convert browser file to base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const raw = reader.result as string;
        resolve(raw.split(",")[1]);
      };
      reader.onerror = (err) => reject(err);
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const base64Str = await toBase64(file);
      const parsed = await apiFetch("/api/expenses/upload", {
        method: "POST",
        body: JSON.stringify({
          file: base64Str,
          mimeType: file.type || "image/jpeg",
          fileName: file.name
        })
      });

      // Set parsed details in form and open modal
      setParsedData(parsed);
      setManualTitle(parsed.title);
      setManualAmount(parsed.amount.toString());
      setManualCategory(parsed.category);
      setManualMerchant(parsed.merchant || "");
      setManualDate(parsed.date || new Date().toISOString().split("T")[0]);
      setManualLocation(parsed.location || "");
      setModalOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to process receipt with AI. Try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualAmount || !manualCategory) {
      setError("Please fill in the required fields.");
      return;
    }

    saveMutation.mutate({
      title: manualTitle,
      amount: Number(manualAmount),
      category: manualCategory,
      merchant: manualMerchant,
      date: manualDate,
      location: manualLocation,
      confidenceScore: parsedData ? parsedData.confidenceScore : 1.0
    });
  };

  // Aggregated Stats
  const totalSpent = expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const avgExpense = expenses && expenses.length > 0 ? totalSpent / expenses.length : 0;
  const receiptCount = expenses?.length || 0;

  // Chart Data preparation
  const categoryTotals = expenses?.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {}) || {};

  const pieData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat]
  }));

  const COLORS = {
    Accommodation: "#0f172a", // Deep Slate Blue
    Transport: "#0d9488", // Teal
    Dining: "#eab308", // Sandy Gold
    Activities: "#3b82f6", // Blue
    Shopping: "#ec4899", // Pink
    Misc: "#64748b" // Slate Grey
  };

  // Monthly Chart Data
  const monthlyTotals = expenses?.reduce((acc: any, curr) => {
    const month = new Date(curr.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + curr.amount;
    return acc;
  }, {}) || {};

  const barData = Object.keys(monthlyTotals).map((m) => ({
    month: m,
    spent: monthlyTotals[m]
  }));

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center text-slate-900 dark:text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Dashboard Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              <span>Travel Expense Tracker</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Upload receipts or manually add travel expenses to track your budget.</p>
          </div>
          <Button
            onClick={() => {
              setParsedData(null);
              resetManualForm();
              setModalOpen(true);
            }}
            className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold shrink-0 cursor-pointer"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 p-3 rounded-lg flex items-center space-x-2 text-sm mb-6">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="py-4">
              <CardDescription className="text-slate-500 font-semibold uppercase text-xs">Total Spent</CardDescription>
              <CardTitle className="text-3xl font-black text-teal-600 dark:text-teal-400">${totalSpent.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="py-4">
              <CardDescription className="text-slate-500 font-semibold uppercase text-xs">Total Receipts</CardDescription>
              <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">{receiptCount} Receipts</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-md">
            <CardHeader className="py-4">
              <CardDescription className="text-slate-500 font-semibold uppercase text-xs">Average Expense</CardDescription>
              <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">${avgExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Uploader Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6 flex flex-col items-center justify-center min-h-[250px] shadow-lg">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,application/pdf,text/plain"
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto" />
                  <div>
                    <p className="font-bold text-teal-600 dark:text-teal-400 animate-pulse flex items-center justify-center">
                      <Sparkles className="mr-2 h-4 w-4 text-amber-500 dark:text-amber-400" />
                      Gemini Parsing Receipt...
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Reading amount, items, and merchants</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-teal-500/50 rounded-xl p-8 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-all duration-300 cursor-pointer"
                >
                  <UploadCloud className="h-12 w-12 text-slate-400 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:scale-110 transition-all duration-300" />
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-300 mt-4 group-hover:text-slate-900 dark:group-hover:text-white">Upload Travel Receipt</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-600 mt-2 block">Supports PNG, JPG, PDF, TXT files</span>
                </button>
              )}
            </Card>

            {/* Pie Chart Analytics */}
            {mounted && pieData.length > 0 && (
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-4 shadow-lg">
                <CardHeader className="p-2 mb-2">
                  <CardTitle className="text-sm font-bold">Category Distribution</CardTitle>
                </CardHeader>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name as keyof typeof COLORS] || "#94a3b8"}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 text-xs">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center space-x-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: COLORS[d.name as keyof typeof COLORS] || "#94a3b8"
                        }}
                      />
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">{d.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Bar Chart & Recent Expenses Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Trend */}
            {mounted && barData.length > 0 && (
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-4 shadow-lg">
                <CardHeader className="p-2 mb-2">
                  <CardTitle className="text-sm font-bold">Monthly Expenditure Trend</CardTitle>
                </CardHeader>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Bar dataKey="spent" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Expenses List */}
            {isLoading ? (
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 space-y-3">
                <div className="h-6 w-full bg-slate-100 dark:bg-slate-850 rounded animate-pulse" />
                <div className="h-6 w-full bg-slate-100 dark:bg-slate-850 rounded animate-pulse" />
              </Card>
            ) : isError ? (
              <div className="text-center py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-500">
                Failed to load expense list.
              </div>
            ) : expenses?.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-500">
                No travel expenses logged yet.
              </div>
            ) : (
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg text-slate-900 dark:text-white">
                <Table>
                  <TableHeader className="bg-slate-100 dark:bg-slate-950">
                    <TableRow className="border-slate-200 dark:border-slate-850 hover:bg-transparent">
                      <TableHead className="text-slate-600 dark:text-slate-400">Title</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 hidden sm:table-cell">Merchant</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 hidden sm:table-cell">Category</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Date</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-right">Amount</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 text-center hidden md:table-cell">Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses?.map((expense) => (
                      <TableRow key={expense._id} className="border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/40">
                        <TableCell className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                          {expense.title}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 hidden sm:table-cell truncate max-w-[120px]">
                          {expense.merchant || "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block mr-1.5 align-middle"
                            style={{
                              backgroundColor: COLORS[expense.category as keyof typeof COLORS] || "#94a3b8"
                            }}
                          />
                          <span className="text-xs text-slate-700 dark:text-slate-300 align-middle">{expense.category}</span>
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400 text-xs">
                          {new Date(expense.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </TableCell>
                        <TableCell className="text-right font-extrabold text-teal-600 dark:text-teal-400">
                          ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center hidden md:table-cell">
                          {expense.confidenceScore < 1.0 ? (
                            <span
                              className="bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded text-[10px] font-bold"
                              title={`Gemini matched with ${Math.round(expense.confidenceScore * 100)}% accuracy`}
                            >
                              AI ({Math.round(expense.confidenceScore * 100)}%)
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">Manual</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation & Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {parsedData ? (
                <>
                  <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400 animate-bounce" />
                  <span className="text-slate-900 dark:text-white">Review AI Extracted Expense</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <span className="text-slate-900 dark:text-white">Log New Expense</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {parsedData
                ? `Verification required. Gemini successfully parsed the receipt with ${Math.round(parsedData.confidenceScore * 100)}% confidence score.`
                : "Add details below to record a travel expenditure."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmSave} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Expense Description *</label>
              <Input
                required
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="E.g., Dinner at Sushi Ginza"
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus-visible:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Amount ($) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus-visible:ring-teal-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Category *</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {["Accommodation", "Transport", "Dining", "Activities", "Shopping", "Misc"].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Merchant</label>
                <div className="relative">
                  <Landmark className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={manualMerchant}
                    onChange={(e) => setManualMerchant(e.target.value)}
                    placeholder="Merchant Name"
                    className="pl-8 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus-visible:ring-teal-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Transaction Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="pl-8 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus-visible:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  placeholder="City, Country"
                  className="pl-8 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus-visible:ring-teal-500"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold cursor-pointer"
              >
                {saveMutation.isPending ? "Saving..." : "Save Expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
