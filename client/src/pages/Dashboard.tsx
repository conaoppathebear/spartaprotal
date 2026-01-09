import { useAuth } from "@/hooks/use-auth";
import { useMyApplications } from "@/hooks/use-applications";
import { useJobs } from "@/hooks/use-jobs"; // For employer jobs
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MoreVertical,
  Plus
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-width">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user.name || user.username}!</p>
          </div>
          {user.role === "employer" && (
            <Link href="/post-job">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </Link>
          )}
        </div>

        {user.role === "candidate" ? <CandidateDashboard /> : <EmployerDashboard />}
      </div>
    </div>
  );
}

function CandidateDashboard() {
  const { data: applications, isLoading } = useMyApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-50 text-blue-700 border-blue-200";
      case "reviewed": return "bg-purple-50 text-purple-700 border-purple-200";
      case "interview": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "hired": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications?.filter(a => a.status === 'interview').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-display font-bold text-lg">Recent Applications</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading applications...</div>
        ) : applications && applications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div key={app.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{app.job.title}</h3>
                    <p className="text-sm text-slate-500">{app.job.company.name}</p>
                    <p className="text-xs text-slate-400 mt-1">Applied {app.appliedAt ? format(new Date(app.appliedAt), 'MMM d, yyyy') : 'Recently'}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border w-fit capitalize ${getStatusColor(app.status)}`}>
                  {app.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-semibold text-slate-900">No applications yet</h3>
            <p className="text-slate-500 mb-6">Start browsing jobs and apply today!</p>
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployerDashboard() {
  // Mock employer data fetch - in real app would use specific hook
  const { data: jobs, isLoading } = useJobs(); 
  
  return (
    <div className="space-y-6">
       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-display font-bold text-lg">Posted Jobs</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading jobs...</div>
        ) : jobs && jobs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.jobType}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium capitalize">{job.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm">Edit</Button>
                   <Link href={`/jobs/${job.id}`}>
                    <Button size="sm" variant="ghost">View</Button>
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-500 mb-4">You haven't posted any jobs yet.</p>
            <Link href="/post-job">
              <Button>Post a Job</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
