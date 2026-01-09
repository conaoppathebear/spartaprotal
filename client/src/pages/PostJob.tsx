import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateJob } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PostJob() {
  const [_, setLocation] = useLocation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { mutate: createJob, isPending } = useCreateJob();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "Full-time",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
  });

  if (isAuthLoading) return null;
  
  if (!user || user.role !== "employer") {
    // Redirect or show error
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-4">You need an employer account to post jobs.</p>
          <Link href="/">
             <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Ensure user has a company ID (in real app, redirect to company creation if null)
  const companyId = user.companyId || 1; // Fallback for dev if not set

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createJob({
      ...formData,
      companyId,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
      status: "active",
    }, {
      onSuccess: () => {
        toast({
          title: "Job Posted Successfully!",
          description: "Your job listing is now live.",
          className: "bg-emerald-50 border-emerald-200 text-emerald-800",
        });
        setLocation("/dashboard");
      },
      onError: (err) => {
        toast({
          title: "Failed to post job",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-width max-w-3xl">
        <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h1 className="text-2xl font-display font-bold text-slate-900">Post a New Job</h1>
            <p className="text-slate-500">Reach thousands of qualified candidates.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Senior Frontend Engineer" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="e.g. Remote, New York, NY" 
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select 
                  value={formData.jobType}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, jobType: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minSalary">Min Salary ($)</Label>
                  <Input 
                    id="minSalary" 
                    type="number" 
                    placeholder="50000" 
                    value={formData.salaryMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSalary">Max Salary ($)</Label>
                  <Input 
                    id="maxSalary" 
                    type="number" 
                    placeholder="80000" 
                    value={formData.salaryMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the role responsibilities, team culture, etc. Markdown supported." 
                className="min-h-[200px] font-mono text-sm"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea 
                id="requirements" 
                placeholder="- 3+ years React experience&#10;- Knowledge of TypeScript&#10;- Good communication skills" 
                className="min-h-[150px] font-mono text-sm"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              />
              <p className="text-xs text-slate-500">Tip: Use hyphens for bullet points.</p>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Link href="/dashboard">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[150px]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Job"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
