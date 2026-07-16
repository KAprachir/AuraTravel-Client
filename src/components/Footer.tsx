import Link from "next/link";
import { Plane, Mail, Phone, MapPin, Github, Twitter, Linkedin, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl">
              <Plane className="h-6 w-6 text-teal-400" />
              <span>
                Aura<span className="text-teal-400">Travel</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              Transforming travel planning with smart AI-driven itineraries, instant receipt expense
              parsing, and a context-aware chat assistant.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://github.com/KAprachir"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-teal-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-teal-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-teal-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://google.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-teal-400 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Discover Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Discover
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/itineraries" className="hover:text-teal-400 transition-colors">
                  Explore Blueprints
                </Link>
              </li>
              <li>
                <Link
                  href="/itineraries?category=Adventure"
                  className="hover:text-teal-400 transition-colors"
                >
                  Adventure Trips
                </Link>
              </li>
              <li>
                <Link
                  href="/itineraries?category=Beach"
                  className="hover:text-teal-400 transition-colors"
                >
                  Beach Getaways
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-teal-400 transition-colors">
                  Travel Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-teal-400 transition-colors">
                  Help Center / FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Details
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
                <span>100 Travel Way, Sky Tower, CA</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <a href="mailto:support@auratravel.com" className="hover:text-teal-400">
                  support@auratravel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {currentYear} AuraTravel Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/help" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/help" className="hover:text-teal-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
