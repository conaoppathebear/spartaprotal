PRODUCT REQUIREMENTS DOCUMENT (PRD)
Job Portal Website (MVP → Scalable Product)
1. PRODUCT OVERVIEW
Product Name (Working)

Sparta Career Portal – Job Portal Platform
(Name can be replaced easily; architecture remains same)

Product Type
Web-based Job Portal (B2C + B2B)
Target Users
Job Seekers (Candidates)
Employers / Recruiters
Admin (Company team)
Primary Goal
Enable job seekers to discover jobs, apply easily, and get matched, while allowing employers to post jobs, review candidates, and manage listings.

2. BUSINESS OBJECTIVES
Centralize job listings for the company
Build a scalable hiring funnel
Reduce dependency on third-party portals
Enable future monetization (featured jobs, subscriptions)
Capture user data (CVs, emails, job preferences)

3. MVP DEFINITION (VERY IMPORTANT)
MVP = everything needed to launch + get real users, nothing extra.
MVP WILL INCLUDE:
Job browsing
Job search & filters
Job detail pages
Candidate registration
Resume upload
Job application
Employer job posting
Admin moderation

MVP WILL NOT INCLUDE (Phase-2):
Chat system
Video interviews
AI matching
Payment gateway
Mobile app

4. USER ROLES & PERMISSIONS
4.1 Candidate (Job Seeker)
Browse jobs (without login)
Register / Login
Upload CV
Apply for jobs
Save jobs
Subscribe to job alerts

4.2 Employer
Register / Login
Post job listings
View applicants
Download resumes
Edit / close jobs

4.3 Admin
Approve employers
Approve/reject job listings
Manage categories
Manage users
View analytics

5. USER FLOWS (HIGH LEVEL)
Candidate Flow
Homepage → Search Jobs → Job Detail → Apply → Upload CV → Confirmation
Employer Flow
Register → Dashboard → Post Job → Job Live → View Applicants
Admin Flow
Admin Login → Review Jobs → Approve → Monitor Platform

6. FUNCTIONAL REQUIREMENTS (FEATURE-BY-FEATURE)
6.1 HOMEPAGE (As per Design)
Sections
Header Navigation
Hero Section with Search
Trending Jobs
Job Categories
Featured Jobs
Testimonials
Resume Submission CTA
Newsletter Subscription
Footer
Functional Requirements
Job search bar (keyword + location)

CTA buttons:
Register
Apply Now
Find More Jobs
Dynamic job counts
SEO-friendly URLs

6.2 JOB SEARCH & FILTERING
Search Parameters
Job title / keyword
Location
Category
Job type (Full-time / Remote)
Salary range
requirements
Fast search (<500ms)
Pagination or infinite scroll
Search results page

6.3 JOB LISTING PAGE
Fields per Job
Job title
Company name
Company logo
Location
Job type
Salary
Description
Apply button
Behavior
Apply button → login required
SEO indexed pages
Shareable URL

6.4 JOB DETAIL PAGE
Must Include
Full job description
Responsibilities
Requirements
Salary range
Company profile snippet
Apply Now CTA

6.5 CANDIDATE MODULE
Registration
Name
Email
Password
Optional phone
Profile
Resume upload (PDF/DOC)
Skills (text)
Experience summary
Preferred job category
Actions
Apply for jobs
View applied jobs
Update resume

6.6 EMPLOYER MODULE
Employer Registration
Company name
Email
Password
Company description
Employer Dashboard
Post new job
View job status
View applicants
Download resumes
Edit or close job

6.7 ADMIN PANEL (MVP LEVEL)
Admin Capabilities
Login (secure)
View all jobs
Approve / reject jobs
Manage categories
View users
Delete spam accounts
Admin UI
Simple dashboard (no fancy charts in MVP)

7. NON-FUNCTIONAL REQUIREMENTS
Performance
Page load <2 seconds
API response <300ms
Security
Password hashing (bcrypt)
File upload validation
Role-based access control

SEO
Meta tags
Clean URLs
Sitemap
Scalability
Modular backend
Stateless API
Separate frontend & backend

8. TECH STACK (REPLIT FRIENDLY)
Frontend
React (Vite or Next.js)
Tailwind CSS
Axios

Backend
Node.js + Express
REST API
JWT authentication
Database
PostgreSQL or MongoDB
ORM: Prisma / Mongoose
File Storage
Local server storage (MVP)
Future: S3 compatible storage
Hosting
Development: Replit
Production: Private VPS (Nginx + PM2)

9. DATABASE SCHEMA (MVP)
Users
id
role (candidate/employer/admin)
name
email
password_hash
created_at

Jobs
id
title
description
location
salary
job_type
company_id
status
created_at

Applications
id
job_id
candidate_id
resume_url
applied_at

Companies
id
name
description
logo

10. API ENDPOINTS (CORE)
Auth
POST /auth/register
POST /auth/login
Jobs
GET /jobs
GET /jobs/:id
POST /jobs (employer)
PUT /jobs/:id
DELETE /jobs/:id
Applications
POST /apply
GET /applications (employer)

11. MVP DEVELOPMENT PHASES
Phase 1 (Core)
Auth
Job listing
Apply flow
Phase 2 (Employer)
Employer dashboard
Job posting

Phase 3 (Admin)
Moderation
Control panel

12. DEPLOYMENT PLAN
Build on Replit
Test APIs locally
Configure environment variables
Export project
Deploy to VPS
Setup Nginx + SSL
Enable backups

13. SUCCESS METRICS (MVP)
Number of job listings
Number of applications
Registration conversion rate
Page load speed
Employer retention

14. FUTURE EXTENSIONS (POST-MVP)
Paid featured jobs
Email job alerts automation
Resume parsing
AI job matching
Mobile app
Analytics dashboard
