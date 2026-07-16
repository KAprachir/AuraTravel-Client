"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Menu, X, Plane, User, LogOut } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
              <DropdownMenuTrigger className="flex items-center space-x-2 text-slate-300 hover:text-white focus:outline-none bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                <div className="h-6 w-6 bg-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 uppercase">
                  {session.user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{session.user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-slate-900 border-slate-800 text-slate-200"
              >
                <DropdownMenuItem className="p-0">
                  <Link
                    href="/itineraries/manage"
                    className="flex items-center w-full px-4 py-2 hover:bg-slate-800 cursor-pointer text-slate-200 hover:text-white text-xs font-medium"
                  >
                    <User className="mr-2 h-4 w-4 text-teal-400" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 hover:bg-slate-850 text-rose-400 hover:text-rose-350 cursor-pointer text-xs font-medium focus:outline-none"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  className: "text-slate-300 hover:text-white hover:bg-slate-800 font-medium cursor-pointer"
                })}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  className: "bg-teal-500 hover:bg-teal-600 text-slate-950 hover:text-slate-950 font-bold cursor-pointer"
                })}
              >
                Sign Up
              </Link>
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
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full text-center border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={buttonVariants({
                    className: "w-full text-center bg-teal-500 hover:bg-teal-600 text-slate-950 hover:text-slate-950 font-bold cursor-pointer"
                  })}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
