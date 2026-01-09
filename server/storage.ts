import { db } from "./db";
import {
  users, companies, jobs, applications,
  type User, type InsertUser,
  type Company, type InsertCompany,
  type Job, type InsertJob,
  type Application, type InsertApplication,
  type UpdateJobRequest
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  // Company
  createCompany(company: InsertCompany): Promise<Company>;
  getCompany(id: number): Promise<Company | undefined>;
  
  // Job
  createJob(job: InsertJob): Promise<Job>;
  getJob(id: number): Promise<Job | undefined>;
  getJobs(filters?: { search?: string, location?: string, type?: string }): Promise<(Job & { company: Company })[]>;
  updateJob(id: number, updates: UpdateJobRequest): Promise<Job>;
  deleteJob(id: number): Promise<void>;

  // Application
  createApplication(app: InsertApplication): Promise<Application>;
  getApplicationsByJob(jobId: number): Promise<(Application & { candidate: User })[]>;
  getApplicationsByCandidate(candidateId: number): Promise<(Application & { job: Job & { company: Company } })[]>;
}

export class DatabaseStorage implements IStorage {
  // User
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.replitId, replitId));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updated;
  }

  // Company
  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  // Job
  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async getJob(id: number): Promise<Job | undefined> {
    // Basic implementation, relation fetching is better done via query builder if needed, but simple join is ok
    // Drizzle relation queries:
    const result = await db.query.jobs.findFirst({
      where: eq(jobs.id, id),
      with: {
        company: true
      }
    });
    return result;
  }

  async getJobs(filters?: { search?: string, location?: string, type?: string }): Promise<(Job & { company: Company })[]> {
    // Simple filter implementation
    const conditions = [];
    if (filters?.location) conditions.push(eq(jobs.location, filters.location)); // Exact match for MVP
    if (filters?.type) conditions.push(eq(jobs.jobType, filters.type));
    
    // Note: Search implementation in MVP is basic
    
    return await db.query.jobs.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      with: {
        company: true
      },
      orderBy: desc(jobs.createdAt)
    });
  }

  async updateJob(id: number, updates: UpdateJobRequest): Promise<Job> {
    const [updated] = await db.update(jobs).set(updates).where(eq(jobs.id, id)).returning();
    return updated;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Application
  async createApplication(app: InsertApplication): Promise<Application> {
    const [newApp] = await db.insert(applications).values(app).returning();
    return newApp;
  }

  async getApplicationsByJob(jobId: number): Promise<(Application & { candidate: User })[]> {
    return await db.query.applications.findMany({
      where: eq(applications.jobId, jobId),
      with: {
        candidate: true
      }
    });
  }

  async getApplicationsByCandidate(candidateId: number): Promise<(Application & { job: Job & { company: Company } })[]> {
    return await db.query.applications.findMany({
      where: eq(applications.candidateId, candidateId),
      with: {
        job: {
          with: {
            company: true
          }
        }
      }
    });
  }
}

export const storage = new DatabaseStorage();
