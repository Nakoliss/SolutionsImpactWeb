

---

## Compliance (Law 25 / Bill 64) — Québec Data Residency Lane
*This lane is mandatory for Québec clients handling PII.*

- **M0–M1:** Data map of all PII, designate DPO/contact, start PIA if data leaves Québec. Maintain sub‑processor inventory (Vercel, Supabase, Stripe, Twilio, Cal.com, email, AI APIs).  
- **M1:** Prefer **Canada Central (Montréal)** for DB/backups; enforce encryption at rest/in transit; enable access logs (≥1 year).  
- **M1–M2:** Execute Québec‑compliant DPAs with sub‑processors; document “comparable protection” for any cross‑border transfers.  
- **M2:** Ship **/export** & **/delete** endpoints for each personal‑data entity (30‑day SLA).  
- **Ongoing:** Breach‑alert webhooks; drill process; **72‑hour CAI notification** workflow.  
- **Go‑Live Gate:** Human legal/DPO sign‑off (AI cannot provide legal sufficiency).

> **Reference (verbatim): bill‑64‑data‑residency‑guide.md**
```
# Québec Bill 64 (Law 25) – Data-Residency Logic Guide

## 1. What is Bill 64 / Law 25?
- **Official name**: *Act to modernize legislative provisions as regards the protection of personal information*  
- **In force**: September 22, 2022 (phased rollout through 2024)  
- **Governs**: Any organisation that **collects, holds, uses, or discloses personal information of Québec residents**, regardless of where the organisation is located.

## 2. Core Data-Residency & Transfer Rules
| Requirement | Practical Impact on Code & Infrastructure |
|---|---|
| **PIA before cross-border transfer** | You must document why data leaves Québec and what safeguards are in place. |
| **“Comparable protection” standard** | If stored outside Québec, encryption, access logging, breach detection, and contractual clauses are mandatory. |
| **Sub-processor list & contracts** | Every cloud, CDN, e-mail, or AI service that touches the data must sign a Québec-compliant DPA (data-processing addendum). |
| **Data portability & erasure** | Provide endpoints or admin tools to export or fully delete any resident’s data within **30 days** of request. |
| **Breach notification** | If data is outside Québec, you must detect, log, and **auto-report to CAI** within **72 hours** of discovery. |

## 3. Technical Checklist for AI-Generated Projects
✅ Host primary database & backups in **Canada Central (Montréal) AWS, Azure, or Google**.  
✅ Enable **server-side encryption at rest (AES-256)** and **TLS 1.2+ in transit**.  
✅ Log **all access events** (IP, timestamp, user ID) with 1-year retention.  
✅ Build **/export** and **/delete** endpoints for each personal-data entity.  
✅ Create **alert webhooks** to your incident-response channel if breach thresholds are met.

## 4. What AI Cannot Automate (N/A)
- Performing the **legal sufficiency review** of hosting regions.  
- Drafting **custom DPA clauses** for each sub-processor.  
- Deciding if a given encryption or tokenisation regime satisfies “comparable protection”.  

> *Always have a Québec-licensed privacy lawyer or DPO review the final design before go-live.*
```

---

## Québec 2025 Pricing Reference (CAD) — EN/FR Deliverables
Use these ranges for **a‑la‑carte** quotes; keep core MRR tiers for subscriptions. Mark pages/content that require **bilingual (EN/FR)** delivery.

> **Reference (verbatim): quebec‑ai‑pricing‑2025.md**
```
# Québec 2025 – Senior-Level AI-Only Service Pricing
*All prices CAD $ • “Senior” ≈ market rate $100-$150/hr if done by a human*  
*Everything below is 100 % deliverable by AI agents (code, content, SEO).*

| Service | Type | Senior-Level Price | Notes |
|---|---|---|---|
| Landing Page (1 page, responsive, SEO-ready) | OT | $1,200 – $2,000 | Copy, layout, schema, bilingual |
| Small Business Site (5-7 pages) | OT | $3,500 – $5,000 | Front-end, on-page SEO, bilingual, CMS-ready |
| E-commerce Site (Shopify / WooCommerce ≤100 SKUs) | OT | $8,000 – $12,000 | Products, payments, bilingual, SEO |
| Custom Web App (React + API, auth, dashboard) | OT | $15,000 – $25,000 | Scaffolding + basic CRUD; complex UX N/A |
| Front-End Enhancements / Bug Fixes | H | $100 – $150 / hr | React, Vue, Tailwind, a11y fixes |
| Auth & Database Setup (Firebase / Supabase) | OT | $800 – $1,200 | Auth flows, roles, schema, API stubs |
| Booking Widget Integration (Setmore, Calendly, API) | OT | $600 – $1,500 | Styling, webhooks, bilingual labels |
| SMS Integration (Twilio, Vonage) | OT | $800 – $2,000 | OTP, reminders, order alerts; voice N/A |
| SEO Technical Audit (≤50 URLs) | OT | $1,000 – $2,000 | Crawl, schema, speed, a11y report |
| Monthly SEO Retainer (on-page + 4 posts) | M | $1,000 – $2,500 | Keyword tracking, updates, bilingual |
| SEO Blog Post (600-800 words, researched, bilingual) | OT | $200 – $400 / post | Keyword map, meta, internal links |
| Monthly Blog Retainer (4 posts) | M | $750 – $1,200 | Strategy, writing, CMS upload, bilingual |
| Monthly Website Maintenance (updates, backups, uptime) | M | $150 – $300 | Core/plugin updates, security scans |

**Legend**  
OT = One-time fee M = Monthly H = Hourly  
N/A = Not automatable by current AI.

```
