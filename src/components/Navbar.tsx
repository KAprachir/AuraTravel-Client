"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Menu, X, Plane, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        }
      }
    });
  };

  const navLinks = session
    ? [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/itineraries" },
        { name: "Add Itinerary", href: "/itineraries/add" },
        { name: "Manage Dashboard", href: "/itineraries/manage" },
        { name: "Expense Tracker", href: "/expenses" }
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/itineraries" },
        { name: "About", href: "/about" }
      ];

  const activeClass = (path: string) =>
    pathname === path
      ? "text-teal-400 font-semibold border-b-2 border-teal-400 pb-1"
      : "text-slate-300 hover:text-white transition-colors duration-200";

  const activeMobileClass = (path: string) =>
    pathname === path
      ? "text-teal-400 font-semibold bg-slate-800 px-3 py-2 rounded-md block"
      : "text-slate-300 hover:text-white px-3 py-2 rounded-md block transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl group">
          <Plane className="h-6 w-6 text-teal-400 transform group-hover:rotate-12 transition-transform duration-300" />
          <span>
            Aura<span className="text-teal-400">Travel</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={activeClass(link.href)}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isPending ? (
            <div className="h-9 w-20 bg-slate-800 rounded animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 text-slate-300 hover:text-white focus:outline-none bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="h-6 w-6 bg-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 uppercase">
                    {session.user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{session.user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-slate-900 border-slate-800 text-slate-200"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/itineraries/manage"
                    className="flex items-center px-4 py-2 hover:bg-slate-800 cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4 text-teal-400" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 hover:bg-slate-800 text-rose-400 hover:text-rose-300 cursor-pointer focus:text-rose-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                asChild
                className="text-slate-300 hover:text-white hover:bg-slate-800 font-medium"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 px-2 pt-2 pb-4 space-y-1 bg-slate-950/95 rounded-lg border border-slate-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={activeMobileClass(link.href)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2 px-3">
            {session ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="h-8 w-8 bg-teal-500 rounded-full flex items-center justify-center font-bold text-slate-950">
                    {session.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{session.user.name}</div>
                    <div className="text-xs text-slate-400">{session.user.email}</div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  variant="destructive"
                  className="w-full justify-start font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Link href="/login" className="w-full text-center">
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold"
                >
                  <Link href="/register" className="w-full text-center">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
