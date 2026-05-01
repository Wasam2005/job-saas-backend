# Multi-Tenant ATS SaaS Backend

A **production-grade backend system** for a Multi-Tenant Applicant Tracking System (ATS) designed to solve real-world hiring workflow problems using scalable architecture, strict tenant isolation, and secure authentication.

---

## Problem Statement

Modern hiring workflows are fragmented across:

* spreadsheets
* emails
* chat tools

This leads to:

* duplicate work
* lost candidates
* poor visibility
* weak pipeline control
* lack of analytics

 This system centralizes the entire hiring lifecycle into a **single scalable backend platform**.

---

##  Key Highlights

* 🏢 Multi-tenant architecture with strict organization isolation
* 🔐 Secure JWT authentication with refresh token rotation & hashing
* 🧩 Role-Based Access Control (RBAC) with fine-grained permissions
* ⚙️ Transaction-safe tenant onboarding (MongoDB transactions planned)
* 🧱 Layered backend architecture (Controller → Service → DB)
* 🛡 Security-first design (no user enumeration, hashed tokens)
* 🚫 Not a CRUD project — built for real SaaS workflows

---

## Architecture Overview

### Multi-Tenant Core Design

* Each company = **one organization (tenant)**
* Every entity includes:

```text
organizationId
```

This ensures:

* strict data isolation
* no cross-tenant leakage

---

### Backend Architecture

```
Routes → Controllers → Services → Repositories → Database
           ↓
       Middleware
 (Auth, RBAC, Validation)
```

Principles:

* No business logic in routes
* Thin controllers
* Services handle logic
* Middleware handles validation, auth, RBAC

---

##  Authentication & Security

* JWT-based authentication
* Short-lived access tokens
* Refresh token rotation
* Hashed refresh tokens stored in database
* HTTP-only cookie storage
* Generic error responses (prevents user enumeration)
* Token invalidation support

---

##  Role-Based Access Control (RBAC)

### Roles

* **Owner**
* **Admin**
* **Recruiter**
* **Interviewer**

### Capabilities

| Role        | Permissions                                       |
| ----------- | ------------------------------------------------- |
| Owner       | Full system control, manages organization & roles |
| Admin       | Manages jobs, candidates, applications            |
| Recruiter   | Handles hiring workflow & pipeline                |
| Interviewer | Views assigned interviews, submits feedback       |

### Implementation

* Auth middleware
* Role middleware (`authorizeRoles`)
* Proper **401 vs 403 separation**
* Denial-path testing

---

##  Multi-Tenant Design

* Every user belongs to exactly **one organization**
* All queries must include `organizationId`
* Prevents cross-tenant data access

👉 This is the **core SaaS isolation guarantee**

---

##  Tenant Onboarding Flow

Registration is not just user creation.

### Flow

1. Create organization
2. Create owner user
3. Link owner to organization

### Request Example

```json
{
  "name": "Owner User",
  "email": "owner@test.com",
  "password": "StrongPass123",
  "organizationName": "Acme Pvt Ltd",
  "companyDomain": "acme.com"
}
```

### ⚠️ Production Risk

If not handled properly:

```
organization created
user creation fails
```

➡️ Leads to broken tenant (orphan data)

### Solution

* MongoDB transactions (planned)
* Ensures:

```
all succeed OR all rollback
```

---

## Data Modeling Strategy

* Primary: **Referential modeling**
* Selective embedding for tightly coupled data

### Examples

* User → Organization
* Application → Candidate + Job
* Interview → Application + Interviewer

---

## Engineering Decisions

### Why MongoDB?

* Flexible schema for evolving workflows
* Faster iteration
* Supports aggregation-heavy analytics

### Additional Decisions

* Manual validation (no heavy libraries)
* Manual sanitization for security
* Centralized logging system
* Strict backend structure

---

## 🛠 Validation & Sanitization

### Validation

* `isNonEmptyString()`
* `isValidEmail()`
* `isValidPassword()`

Handled via middleware:

* `validateRegisterInput()`
* `validateLoginInput()`

---

### Sanitization

* Trimming
* Normalizing spaces
* Removing unsafe HTML/script tags

Used for:

* names
* organization fields

---

## 📊 Logging System

Centralized logger with levels:

* info
* warn
* error

Used across:

* controllers
* services
* middleware

---

## Current Status

### ✅ Completed

* Authentication system
* Refresh token system
* RBAC foundation
* Validation & sanitization
* Logging system
* Multi-tenant architecture design
* Organization + user modeling

---

### 🚧 In Progress

* MongoDB transaction-based onboarding

---

### ⏭ Upcoming

* organizationId enforcement in all queries
* Jobs module
* Candidates module
* Applications module
* Interviews module
* Analytics system
* Redis caching
* Background jobs (BullMQ)
* Cron jobs
* Graceful shutdown

---

## Detailed Documentation

For deeper architecture insights:

👉 See `docs/architecture.md`

---

## Engineering Philosophy

* Security-first design
* No shallow CRUD
* Scalable SaaS architecture
* Clean separation of concerns
* Production-ready mindset

---

## Final Note

This project is designed to demonstrate:

* real-world backend engineering
* system design thinking
* SaaS architecture understanding

---

## Contact

If you want to discuss system design, backend engineering, or collaboration, feel free to reach out.
