# 🏗 System Architecture — Multi-Tenant ATS SaaS Backend

> **Note:** This document includes both implemented and planned components to reflect a real-world scalable SaaS architecture.

------------------------------------------------------------------

# 📌 High-Level Architecture

Client
   ↓
API Layer (Express.js)
   ↓
Middleware Layer
   ↓
Service Layer
   ↓
Cache Layer (Redis - planned)
   ↓
Database Layer (MongoDB)
   ↓
Queue Layer (BullMQ - planned)
   ↓
Workers / Background Jobs


✔ Follows production-grade layered architecture
❌ Avoids direct route → database coupling

-------------------------------------------------------------------

# 🧱 Layered Architecture Breakdown

-------------------------------------------------------------------

## 1. Client Layer

**Responsibility:**

* Consumes backend APIs

**Examples:**

* Web frontend
* Admin dashboard
* Internal recruiter tools
* API clients (Postman)

> Backend is designed independently of the frontend.

-------------------------------------------------------------------

## 2. API Layer (Express)

**Responsibility:**

* Maps HTTP requests to controllers

**Examples:**

POST /auth/register
POST /jobs
PATCH /applications/:id/stage

**Rules:**

* No business logic
* No database access
* Routes must remain thin

-------------------------------------------------------------------

## 3. Middleware Layer

Handles cross-cutting concerns before business logic executes.

-------------------------------------------------------------------

### 🔐 Authentication Middleware

* Verifies JWT access token
* Validates user from database
* Attaches `req.user`

-------------------------------------------------------------------

### 🧩 RBAC Middleware

* Enforces role-based access
* Uses `authorizeRoles(...allowedRoles)`

-------------------------------------------------------------------

### ✅ Validation Middleware

* Validates request inputs at boundary
* Ensures data correctness before processing

-------------------------------------------------------------------

### 🧼 Sanitization Middleware

* Cleans safe text fields
* Removes unsafe content

**Applied to:**

* name
* organizationName
* notes

**Not applied to:**

* passwords
* tokens

-------------------------------------------------------------------

### ⚠️ Error Handling Middleware

* Centralized global error handler
* Eliminates scattered try/catch blocks

-------------------------------------------------------------------

## 4. Controller Layer

**Responsibility:**

* Orchestrates request handling

**Handles:**

* Calling services
* Sending responses
* Setting cookies

**Does NOT handle:**

* Business logic
* Database queries

> Controllers remain intentionally thin.

-------------------------------------------------------------------

## 5. Service Layer (Core Engine)

All business logic resides here.

**Examples:**

* Authentication (register, login, token rotation)
* Application pipeline rules
* Interview scheduling and feedback

> This layer represents the core backend engine.

-------------------------------------------------------------------

## 6. Cache Layer (Redis — Planned)

**Purpose:**

* Improve performance for read-heavy operations

**Use cases:**

* Dashboard statistics
* Analytics results
* Aggregation caching

**Rule:**

> Cache must be invalidated on writes to prevent stale data.

-------------------------------------------------------------------

## 7. Database Layer (MongoDB)

**Role:**

* Primary source of truth

**Strategy:**

* Referential modeling (primary)
* Selective embedding (limited use)

-------------------------------------------------------------------

## 8. Queue Layer (BullMQ — Planned)

Handles asynchronous processing outside request-response cycle.

**Flow:**


API → Queue → Worker


**Use cases:**

* Emails
* Notifications
* Bulk operations

-------------------------------------------------------------------

## 9. Workers & Background Jobs

**Includes:**

* Queue workers (async tasks)
* Cron jobs (scheduled tasks)

**Examples:**

* Interview reminders
* Token cleanup
* Notification dispatch

-------------------------------------------------------------------

# 🏢 Multi-Tenant Architecture

## Core Rule

Each company is treated as a **separate organization (tenant)**.

Every business document must include:


organizationId


🚨 Prevents cross-tenant data leakage
🚨 Mandatory for all queries

-------------------------------------------------------------------

# 🧩 Core Domain Models

## Organization

* name
* companyDomain (unique)
* ownerId
* status
* timestamps

-------------------------------------------------------------------

## User

* name
* email
* password
* role
* organizationId

-------------------------------------------------------------------

## Job

* title
* description
* status
* organizationId

-------------------------------------------------------------------

## Candidate

* name
* email
* phone
* organizationId

> Unique per organization

-------------------------------------------------------------------

## Application (Core Workflow Entity)

* candidateId
* jobId
* stage
* organizationId

-------------------------------------------------------------------

## Interview

* applicationId
* interviewerId
* feedback
* score
* organizationId

-------------------------------------------------------------------

# ⚙️ Tenant Onboarding Architecture

## Flow


register
→ create organization
→ create owner user
→ link ownerId


> Registration represents **tenant creation**, not just user signup.

-------------------------------------------------------------------

## Circular Dependency Handling

**Problem:**

* Organization requires `ownerId`
* User requires `organizationId`

**Solution:**


create organization (ownerId = null)
→ create owner user
→ update ownerId


**Planned Improvement:**

* MongoDB transactions for atomic onboarding

-------------------------------------------------------------------

# 🔐 Security Architecture

## Authentication

### Access Token

* JWT
* Short-lived
* Sent via Authorization header

-------------------------------------------------------------------

### Refresh Token

* Stored in HTTP-only cookie
* Hashed in database
* Rotation enabled

-------------------------------------------------------------------

## Security Goals

* Prevent token leakage
* Avoid user enumeration
* Database as source of truth

-------------------------------------------------------------------

## Authorization (RBAC)

**Hierarchy:**


owner > admin > recruiter > interviewer


**Principle:**

* Least privilege access control

-------------------------------------------------------------------

# 📊 Logging Architecture

Centralized structured logging system.

**Levels:**

* info
* warn
* error

Used across:

* middleware
* controllers
* services

-------------------------------------------------------------------

# 🔍 Query Architecture

Designed for production usage:

* Pagination
* Filtering
* Sorting
* Search

> Avoids shallow CRUD design.

-------------------------------------------------------------------

# 📈 Analytics Architecture

Built using MongoDB Aggregation Pipelines.

**Examples:**

* Hiring funnel
* Candidate stage distribution
* Conversion rates
* Recruiter performance

-------------------------------------------------------------------

# 🚀 Planned Production Enhancements

* MongoDB transactions
* Redis caching
* BullMQ queues
* Cron-based scheduling
* Graceful shutdown
* Strict tenant-level query enforcement
* Index optimization
* Cache invalidation strategy

-------------------------------------------------------------------

# 🧠 Engineering Principles

* No business logic in routes
* Controllers remain thin
* Services own business logic
* Middleware handles auth, RBAC, validation
* organizationId required in all queries
* Security-first design
* Async work handled via queues

-------------------------------------------------------------------

# 🎯 Final Goal

Build a backend that demonstrates:

* Real SaaS architecture
* Multi-tenant system design
* Secure authentication
* Production-grade RBAC
* Scalable backend thinking
* Workflow engine design

-------------------------------------------------------------------

## ⭐ Summary

This project is designed as a **backend engineering system**, not a CRUD tutorial, focusing on real-world scalability, security, and maintainability.
