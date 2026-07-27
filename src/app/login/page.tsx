"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Plane, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/"
      }, {
        onError: (ctx: any) => {
          setError(ctx.error.message || "Invalid email or password.");
          setLoading(false);
        },
        onSuccess: () => {
          router.push("/");
          router.refresh();
        }
      });
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo.traveler@auratravel.com");
    setPassword("DemoPass123!");
    setError("");
    // Trigger login with a short delay so user can see autofill
    setTimeout(async () => {
      setLoading(true);
      try {
        await authClient.signIn.email({
          email: "demo.traveler@auratravel.com",
          password: "DemoPass123!",
          callbackURL: "/"
        }, {
          onError: (ctx: any) => {
            setError(ctx.error.message || "Failed to log in with demo account.");
            setLoading(false);
          },
          onSuccess: () => {
            router.push("/");
            router.refresh();
          }
        });
      } catch (err) {
        setError("Failed to sign in demo traveler.");
        setLoading(false);
      }
    }, 600);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`
      }, {
        onError: (ctx: any) => {
          setError(ctx.error.message || "Failed to initialize Google authentication.");
          setLoading(false);
        }
      });
    } catch (err) {
      setError("Failed to initialize Google authentication.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-200">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <Link href="/" className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-2xl mb-8 z-10">
        <Plane className="h-7 w-7 text-teal-600 dark:text-teal-400" />
        <span>Aura<span className="text-teal-600 dark:text-teal-400">Travel</span></span>
      </Link>

      <Card className="w-full max-w-md bg-white/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 backdrop-blur-md text-slate-900 dark:text-white z-10 shadow-2xl">
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="text-2xl text-center font-bold tracking-tight text-slate-900 dark:text-white" style={{fontFamily: 'var(--font-jakarta)'}}>Welcome Back</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 text-center text-sm">
            Sign in to access your travel dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 p-3 rounded-lg flex items-center space-x-2 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-teal-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-teal-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 mt-2 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30 rounded-xl text-sm tracking-wide cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In with Email"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer"
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              onClick={handleDemoLogin}
              variant="outline"
              className="border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold rounded-xl transition-all duration-200 text-sm cursor-pointer"
            >
              Demo Traveler
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-200 dark:border-slate-800/50 py-4 bg-transparent">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-teal-600 dark:text-teal-400 hover:underline">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
