import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ArrowRight, Tag } from "lucide-react";

export default function BlogPage() {
  const blogs = [
    {
      id: 1,
      title: "10 Essential Tips for Backpacking Southern Patagonia",
      excerpt: "Uncover preparation hacks, gear essentials, and trail safety requirements for the legendary W-Trek.",
      author: "Alex Mercer",
      date: "July 12, 2026",
      readTime: "8 min read",
      category: "Adventure",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "How We Use Gemini AI to Streamline Travel Budgeting",
      excerpt: "An inside look at our engineering pipeline converting photos of crumpled receipts into structured charts.",
      author: "Marcus Aurelius",
      date: "July 08, 2026",
      readTime: "5 min read",
      category: "AI & Tech",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "Finding Peace: The Ultimate Kyoto Zen Garden Guide",
      excerpt: "Wander through centuries-old stone structures, serene bamboo groves, and hidden moss gardens.",
      author: "Sarah Connor",
      date: "June 28, 2026",
      readTime: "6 min read",
      category: "Cultural",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Travel Blog</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Stories, technical guides, and budgeting hacks from our global traveler community.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group shadow-md"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-teal-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center shadow-md">
                  <Tag className="mr-1 h-3 w-3" />
                  {blog.category}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5 flex-grow space-y-3">
                <div className="flex items-center space-x-3 text-[10px] text-slate-500">
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3 text-teal-600 dark:text-teal-400" />
                    {blog.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3 w-3 text-teal-600 dark:text-teal-400" />
                    {blog.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
              </CardContent>

              {/* Author & Action */}
              <CardFooter className="p-5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="h-3 w-3" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">{blog.author}</span>
                </div>
                <Button
                  variant="link"
                  className="h-auto p-0 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-bold text-xs flex items-center group-hover:translate-x-0.5 transition-transform cursor-pointer"
                >
                  Read Article
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
