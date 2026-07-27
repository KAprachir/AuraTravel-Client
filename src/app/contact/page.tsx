"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Contact Us</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Have questions about itineraries or our Gemini integrations? Reach out to our engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6 shadow-lg h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                  Get in Touch
                </h3>
                <ul className="space-y-6 text-sm">
                  <li className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Office Address</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">100 Travel Way, Sky Tower, CA</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Phone Support</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">+1 (555) 123-4567</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Email Address</span>
                      <a
                        href="mailto:support@auratravel.com"
                        className="text-teal-600 dark:text-teal-400 hover:underline text-xs"
                      >
                        support@auratravel.com
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="text-xs text-slate-500 pt-6 border-t border-slate-200 dark:border-slate-800/40 mt-6">
                Our support team is available Monday through Friday, 9:00 AM - 6:00 PM EST.
              </div>
            </Card>
          </div>

          {/* Form Column */}
          <div className="md:col-span-2">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Send a Message</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Fill out the form below and we will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300 p-6 rounded-lg text-center space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-teal-600 dark:text-teal-400 mx-auto animate-bounce" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Message Sent Successfully!</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Thank you for contacting AuraTravel. An AI representative or engineer has
                      logged your ticket.
                    </p>
                    <Button
                      onClick={() => setSuccess(false)}
                      className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 p-3 rounded-lg flex items-center space-x-2 text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">
                          Your Name *
                        </label>
                        <Input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus-visible:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus-visible:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Subject</label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Itinerary Questions / API Key Setup..."
                        className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus-visible:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">
                        Message Content *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your details here..."
                        className="w-full rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm p-3 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder:text-slate-400 dark:placeholder:text-slate-700"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold cursor-pointer"
                    >
                      {loading ? "Submitting..." : "Submit Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
