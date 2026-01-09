import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";

import Home from "@/pages/Home";
import JobsList from "@/pages/JobsList";
import JobDetails from "@/pages/JobDetails";
import Dashboard from "@/pages/Dashboard";
import PostJob from "@/pages/PostJob";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={JobsList} />
      <Route path="/jobs/:id" component={JobDetails} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/post-job" component={PostJob} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
