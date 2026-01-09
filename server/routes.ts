import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Helper to get user from request (works with Replit Auth populated req.user)
  const getUserFromRequest = async (req: any) => {
    if (req.user) {
        // req.user is populated by Replit Auth (via passport)
        // It comes from authStorage.getUser or upsertUser
        // In replitAuth.ts: verified callback returns the user object, which is then serialized.
        // Wait, replitAuth.ts verify function calls upsertUser, then calls verified(null, user).
        // But what is 'user' passed to verified? 
        // In the blueprint I see: `const user = {}; updateUserSession(user, tokens); verified(null, user);`
        // So req.user is NOT the DB user. It's the session object.
        // But registerAuthRoutes uses `req.user.claims.sub` to fetch the DB user.
        
        if (req.user && req.user.claims && req.user.claims.sub) {
            return await storage.getUserByReplitId(req.user.claims.sub);
        }
    }
    return null;
  };

  // Auth Routes (Profile)
  app.get(api.auth.me.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    res.json(user || null);
  });

  app.put(api.auth.updateProfile.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    
    const updates = api.auth.updateProfile.input.parse(req.body);
    const updated = await storage.updateUser(user.id, updates);
    res.json(updated);
  });

  // Companies
  app.post(api.companies.create.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const input = api.companies.create.input.parse(req.body);
    const company = await storage.createCompany(input);
    
    // Auto-assign user to company if they don't have one and created it
    await storage.updateUser(user.id, { companyId: company.id, role: 'employer' });
    
    res.status(201).json(company);
  });

  app.get(api.companies.get.path, async (req, res) => {
    const company = await storage.getCompany(Number(req.params.id));
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  });

  // Jobs
  app.get(api.jobs.list.path, async (req, res) => {
    const filters = req.query as { search?: string, location?: string, type?: string };
    const jobs = await storage.getJobs(filters);
    res.json(jobs);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  app.post(api.jobs.create.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    // Strict check for employer role
    if (!user || user.role !== 'employer' || !user.companyId) {
      return res.status(401).json({ message: "Unauthorized: Need Employer role and Company" });
    }

    const input = api.jobs.create.input.parse(req.body);
    
    // Ensure job belongs to user's company
    const job = await storage.createJob({ ...input, companyId: user.companyId });
    res.status(201).json(job);
  });

  app.put(api.jobs.update.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'employer') return res.status(401).json({ message: "Unauthorized" });
    
    const existingJob = await storage.getJob(Number(req.params.id));
    if (!existingJob) return res.status(404).json({ message: "Job not found" });
    if (existingJob.companyId !== user.companyId) return res.status(401).json({ message: "Unauthorized" });

    const updates = api.jobs.update.input.parse(req.body);
    const updated = await storage.updateJob(existingJob.id, updates);
    res.json(updated);
  });

  // Applications
  app.post(api.applications.create.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const input = api.applications.create.input.parse(req.body);
    
    // Ensure candidateId matches current user
    const appData = { ...input, candidateId: user.id };
    const application = await storage.createApplication(appData);
    res.status(201).json(application);
  });

  app.get(api.applications.listByJob.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'employer') return res.status(401).json({ message: "Unauthorized" });
    
    // Check if job belongs to employer's company
    const jobId = Number(req.params.jobId);
    const job = await storage.getJob(jobId);
    if (!job || job.companyId !== user.companyId) return res.status(401).json({ message: "Unauthorized" });

    const apps = await storage.getApplicationsByJob(jobId);
    res.json(apps);
  });

  app.get(api.applications.listMine.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const apps = await storage.getApplicationsByCandidate(user.id);
    res.json(apps);
  });

  // Seed database
  seedDatabase().catch(console.error);

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const jobs = await storage.getJobs();
  if (jobs.length === 0) {
    console.log("Seeding database...");
    const company = await storage.createCompany({
      name: "TechCorp Inc.",
      description: "Leading tech solutions provider.",
      website: "https://techcorp.com",
      logoUrl: "https://via.placeholder.com/100"
    });

    await storage.createJob({
      title: "Senior Frontend Developer",
      companyId: company.id,
      location: "Remote",
      jobType: "Full-time",
      salaryMin: 120000,
      salaryMax: 160000,
      description: "We are looking for an experienced React developer...",
      requirements: "- 5+ years React\n- TypeScript mastery\n- Node.js knowledge",
      status: "active"
    });

    await storage.createJob({
      title: "Backend Engineer",
      companyId: company.id,
      location: "New York, NY",
      jobType: "Hybrid",
      salaryMin: 130000,
      salaryMax: 170000,
      description: "Join our backend team building scalable APIs...",
      requirements: "- Python/Django or Node.js\n- PostgreSQL\n- AWS",
      status: "active"
    });
    
    console.log("Seeding complete.");
  }
}

