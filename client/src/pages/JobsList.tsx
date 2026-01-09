import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "all",
  });

  const { data: jobs, isLoading } = useJobs(
    { 
      search: filters.search, 
      location: filters.location, 
      type: filters.type === "all" ? undefined : filters.type 
    }
  );

  const clearFilters = () => {
    setFilters({ search: "", location: "", type: "all" });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header / Filter Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="container-width py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Location..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="w-full lg:w-48">
              <Select 
                value={filters.type} 
                onValueChange={(val) => setFilters(prev => ({ ...prev, type: val }))}
              >
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            { (filters.search || filters.location || filters.type !== "all") && (
               <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-red-500">
                 <X className="w-4 h-4 mr-2" />
                 Clear
               </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container-width py-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">
              {isLoading ? "Loading jobs..." : `${jobs?.length || 0} Jobs Found`}
            </h1>
            <p className="text-slate-500 mt-1">
              Explore the latest opportunities
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 h-32 flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))
          ) : jobs?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">
                Try adjusting your search criteria or clear filters to see more results.
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-6">
                Clear Filters
              </Button>
            </div>
          ) : (
            jobs?.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
