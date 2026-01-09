import { useRoute } from "wouter";
import { useJob } from "@/hooks/use-jobs";
import { ApplyDialog } from "@/components/ApplyDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Briefcase, DollarSign, Calendar, Globe, Share2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function JobDetails() {
  const [, params] = useRoute("/jobs/:id");
  const id = Number(params?.id);
  const { data: job, isLoading, error } = useJob(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-slate-200 rounded mb-4" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Job not found</h2>
        <p className="text-slate-500 mb-6">The job you are looking for might have been removed or is no longer active.</p>
        <Link href="/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-width">
        <Link href="/jobs" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company.name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-sm">{job.status}</span>
                  </div>
                </div>
                {job.company.logoUrl && (
                  <img src={job.company.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                )}
              </div>

              <div className="flex flex-wrap gap-4 py-6 border-y border-slate-100 mb-8">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase className="w-5 h-5 text-emerald-500" />
                  <span>{job.jobType}</span>
                </div>
                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <span>
                      {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : ''} 
                      {job.salaryMin && job.salaryMax ? ' - ' : ''}
                      {job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : ''}
                      /yr
                    </span>
                  </div>
                )}
                {job.createdAt && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    <span>Posted {formatDistanceToNow(new Date(job.createdAt))} ago</span>
                  </div>
                )}
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold font-display text-slate-900 mb-4">Job Description</h3>
                <ReactMarkdown>{job.description}</ReactMarkdown>

                {job.requirements && (
                  <>
                    <h3 className="text-xl font-bold font-display text-slate-900 mt-8 mb-4">Requirements</h3>
                    <ReactMarkdown>{job.requirements}</ReactMarkdown>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Interested in this job?</h3>
              <ApplyDialog jobId={job.id} jobTitle={job.title} />
              <p className="text-xs text-slate-400 text-center mt-4">
                You'll need a profile to apply. It takes 30 seconds.
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Share this job</span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100">
                      <Share2 className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-4">About the Company</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                   {job.company.logoUrl ? (
                     <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                   ) : (
                     <Building2 className="w-6 h-6 text-slate-400" />
                   )}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{job.company.name}</p>
                  {job.company.website && (
                    <a 
                      href={job.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-500 line-clamp-4">
                {job.company.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
