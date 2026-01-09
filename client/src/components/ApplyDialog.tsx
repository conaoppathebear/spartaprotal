import { useState } from "react";
import { useApply } from "@/hooks/use-applications";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplyDialogProps {
  jobId: number;
  jobTitle: string;
  trigger?: React.ReactNode;
}

export function ApplyDialog({ jobId, jobTitle, trigger }: ApplyDialogProps) {
  const [open, setOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const { user } = useAuth();
  const { mutate: apply, isPending } = useApply();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      window.location.href = "/api/login";
      return;
    }

    apply(
      {
        jobId,
        candidateId: Number(user.id), // Ensure proper ID typing
        resumeUrl: resumeUrl || undefined,
        coverLetter: coverLetter || undefined,
        status: "applied",
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast({
            title: "Application Sent!",
            description: `You've successfully applied to ${jobTitle}. Good luck!`,
            className: "bg-emerald-50 border-emerald-200 text-emerald-800",
          });
          setResumeUrl("");
          setCoverLetter("");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all">
            Apply Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Submit your application details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume URL</Label>
            <Input
              id="resume"
              placeholder="https://linkedin.com/in/..."
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Link to your LinkedIn, Portfolio, or Resume file.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea
              id="coverLetter"
              placeholder="Introduce yourself and explain why you're a good fit..."
              className="min-h-[120px]"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
