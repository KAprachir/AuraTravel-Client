import Link from "next/link";
import { Plane, Mail, Phone, MapPin, Globe } from "lucide-react";

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
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-teal-400 transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.098 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-teal-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://google.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-teal-400 transition-colors"
                aria-label="Website"
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
