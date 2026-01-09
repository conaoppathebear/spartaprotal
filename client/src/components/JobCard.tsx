import { Link } from "wouter";
import { MapPin, Briefcase, Clock, Building2, ChevronRight } from "lucide-react";
import { type Job, type Company } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job & { company: Company };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="group relative bg-white border border-slate-100 rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-emerald-100 hover:-translate-y-1 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      {/* Logo */}
      <div className="shrink-0 w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
        {job.company.logoUrl ? (
          <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
        ) : (
          <Building2 className="w-8 h-8 text-slate-300" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link href={`/jobs/${job.id}`} className="block">
            <h3 className="font-display font-semibold text-lg text-slate-900 truncate group-hover:text-emerald-600 transition-colors cursor-pointer">
              {job.title}
            </h3>
          </Link>
          {job.status === 'active' && (
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>
        
        <p className="text-slate-500 font-medium mb-3">{job.company.name}</p>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            <MapPin className="w-3.5 h-3.5" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{job.jobType}</span>
          </div>
          {job.createdAt && (
            <div className="flex items-center gap-1.5 text-slate-400 pl-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="w-full sm:w-auto mt-2 sm:mt-0">
        <Link href={`/jobs/${job.id}`}>
          <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-sm transition-all hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-2 group/btn">
            View Details
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
