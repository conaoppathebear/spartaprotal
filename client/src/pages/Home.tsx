import { useState } from "react";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, TrendingUp, Users, Building } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const { data: jobs, isLoading } = useJobs(); // Fetch all for featured list

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (location) params.append("location", location);
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 pb-20 pt-24 lg:pt-32">
        {/* Abstract shapes/gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-500 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[60%] rounded-full bg-blue-500 blur-[120px]" />
        </div>

        <div className="container-width relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white tracking-tight mb-6"
          >
            Find your dream job <br className="hidden sm:block" />
            <span className="text-emerald-400">build your future.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Connect with top employers and discover opportunities that match your skills and ambitions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input 
                  placeholder="Job title, keywords, or company" 
                  className="pl-10 h-12 bg-white border-0 text-slate-900 placeholder:text-slate-500 focus-visible:ring-0 rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input 
                  placeholder="City, state, or zip code" 
                  className="pl-10 h-12 bg-white border-0 text-slate-900 placeholder:text-slate-500 focus-visible:ring-0 rounded-xl"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20">
                Search Jobs
              </Button>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16"
          >
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/10 rounded-lg">
                <TrendingUp className="text-emerald-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xl">10k+</p>
                <p className="text-sm text-slate-400">Live Jobs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/10 rounded-lg">
                <Building className="text-blue-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xl">500+</p>
                <p className="text-sm text-slate-400">Companies</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/10 rounded-lg">
                <Users className="text-purple-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xl">1M+</p>
                <p className="text-sm text-slate-400">Candidates</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="py-20 bg-slate-50">
        <div className="container-width">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900">Featured Jobs</h2>
              <p className="text-slate-500 mt-2">Top opportunities hand-picked for you</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="hidden sm:flex items-center gap-2 group text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                View all jobs
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-white rounded-xl animate-pulse border border-slate-200" />
              ))
            ) : jobs && jobs.length > 0 ? (
              jobs.slice(0, 4).map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No jobs posted yet.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/jobs">
              <Button variant="outline" className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                View all jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
