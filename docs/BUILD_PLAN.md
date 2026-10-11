# Alpha-Like School Platform — Solo, Pilot-First Build Plan
**v1.1 — AI-executable edition · Oct 11, 2026 · @Hussam**
*Changes from v1.0: Section 0 added (AI execution conventions); seam register and gates now carry mandatory evidence requirements; "How we build together" extended with evidence bundles and git-commit policy; rule 3 confirmed (was inferred in v1.0); open decisions collected in §0.5. Build content is unchanged.*

---

## 0. How an AI executes this plan (read first)

This document is written to be executed by an AI coding partner (Claude Code or equivalent) working solo with @Hussam. These conventions are part of the plan, not commentary.

### 0.1 Standing instructions
- The repo root contains **`CLAUDE.md`** — the standing instruction file. Any AI session on this project reads it first; it encodes the rules in §1, the session loop, the evidence spec, and the gate protocol. Do not duplicate or contradict it; update it only via ADR.
- Each working session begins with the **session kickoff prompt** (`docs/PROMPT_START_SESSION.md`): state the open step, quote its "Done when" criterion, list blockers. One step per session, closed before the next opens.

### 0.2 Evidence bundles (mandatory, committed to git)
After every step, the AI produces an evidence bundle at `docs/evidence/<phase>/<step>/` and references it in the session report. Closing a step requires a **single git commit (or PR) containing the code, tests, AND the evidence bundle** — git history is the audit trail.

Each bundle contains:
| File | Content |
|---|---|
| `tests.txt` | Full test-run output (command + results), 100% green on new code |
| `coverage.txt` | Coverage for new code: ≥80% lines on new logic; learning-engine ≥90% |
| `trace.json` or `trace.png` | One OTel trace spanning app → API → engine → DB |
| `lint.txt` | Boundary lint + typecheck output, clean |
| `deploy.txt` | Staging deploy log excerpt proving the step is live |
| `demo.md` | 3–6 screenshots, screen recording, or curl transcript showing the feature working |
| `decisions.md` | ADR reference, or "no decision made" |
| `risks.md` | Anything deferred, with trigger conditions |

UX steps (Phases 1–2) additionally attach usability notes from 1–2 real users (a child or the guide). Infra steps attach `terraform apply`/`docker compose` output and, where relevant, timed backup/restore drill results.

### 0.3 Gates are hard stops
Each phase ends with a gate. The AI compiles `docs/evidence/gate-N.md` — a checklist linking every required artifact — and **stops until @Hussam approves in writing**. No gate criterion may be rationalized around; if one cannot be met, the AI stops and presents options with tradeoffs.

### 0.4 Seam upgrades require interface-unchanged proof
When a seam is upgraded (Phases 4–5, or earlier if a trigger fires), the evidence bundle must include **before/after contract diffs (must be empty)** and **all pre-existing tests green without modification**. This proves the permanent interface held.

### 0.5 Open decisions (defaults in force until @Hussam changes them)
| # | Item | Default in force |
|---|---|---|
| 1 | The third build rule (v1.0 listed two; rule 3 was inferred) | **Confirmed.** Architecture boundaries are real from day one. |
| 2 | Pilot school, guide, start date | Decided by Step 0.1 output; the AI drafts, @Hussam confirms in writing. |
| 3 | Jurisdiction (COPPA/FERPA vs PDPL) | Decided by pilot location; consent + pseudonymization built either way. |
| 4 | Part-time content reviewer | Math teacher, ~5 h/week, from week 6; @Hussam arranges. |

---

## 1. The three rules

1. **Build only what a 20-student pilot needs.** If a feature doesn't change what those 20 students, their guide or their parents experience in the pilot, it waits.
2. **Every shortcut is a seam, not a hack.** A seam is a designed placeholder behind a permanent interface. Upgrading it means swapping the implementation behind that interface — never rewriting callers. Each seam is listed in the seam register (§3) with its upgrade trigger and its upgrade-evidence requirement (§0.4).
3. **The architecture's boundaries are real from day one.** Same modules, same contracts, same data ownership and same event schemas as the architecture doc. Only the implementations behind them start small. *(Confirmed; see §0.5.)*

## 2. Assumptions
- **Team:** you, solo, full-time, pairing with an AI on specs, code, tests and reviews. One part-time helper for content review (a math teacher, ~5 h/week) from week 6.
- **Pilot:** 20 students, one school or micro-school, grades 4–5 math only, one guide, ~20 parents. Devices: iPads or Chromebooks in a browser.
- **Content scope:** one strand path — multiplication, division and fractions (~60 skills, ~600 items). Enough for a 12-week pilot.
- **Jurisdiction:** decided by where the pilot runs — COPPA/FERPA for the US, PDPL for Saudi Arabia. Consent and pseudonymization are built either way.
- **Budget:** $0 for cloud and tools during the pilot — free tiers only. The one real cost is a domain name (~$10–15/year). Startup credit applications go in now to fund the move to AWS in Phase 4.
- **Pace:** realistic solo output is one meaningful step per week. Timeline assumes that.

## 3. Seam register
Each row is a deliberate shortcut. The **Permanent interface** column is the contract every caller uses; it never changes, so the upgrade touches only the implementation. Upgrades happen when the trigger fires, not before — and each upgrade ships the §0.4 proof (empty contract diff + green unmodified tests).

| Architecture target | Pilot implementation (the seam) | Permanent interface | Upgrade trigger |
|---|---|---|---|
| Kinesis/Kafka event stream | Transactional outbox table in Postgres + relay worker publishing to an in-process bus | `EventPublisher.publish(event)` with JSON Schema–validated events in `packages/contracts/events` | >50 events/s sustained or a second consumer service → relay targets Kinesis |
| ClickHouse warehouse | `analytics` schema in the same Postgres, built by dbt-postgres | dbt models + reporting module queries | Report queries >2 s or >500 students → switch dbt adapter to ClickHouse |
| Redis cache / next-item queue | Postgres table + in-memory LRU | `QueueStore`, `Cache` interfaces | p95 next-item >150 ms → Redis implementation of same interfaces |
| WebSocket gateway | GraphQL subscriptions over WebSocket inside the NestJS app (single instance) | `GraphQL subscription roomUpdates(roomId)` | >1 API instance needed → AWS API Gateway WebSocket; schema unchanged |
| OpenFGA authorization | SQL relationship tables (`guardian_of`, `guides`, `member_of`) | `authz.check(user, relation, object)` | Multi-school tenancy (Phase 5) → OpenFGA backend, same tuples |
| Separate control-panel apps | One Next.js staff app with route groups `/guide`, `/admin`, `/author`, `/ops`; each panel its own package | `packages/panel-guide`, `panel-admin`, `panel-author`, `panel-ops` | A panel needs its own deploy or domain → mount the same package in a new app |
| React Native student app | Expo + React Native Web: one codebase, runs in the browser for the pilot | Same Expo app | Need App Store / offline-heavy iPads → ship native build of the same code |
| Placement CAT (IRT) | Fixed-form diagnostic per skill cluster, scored per skill | `POST /placement/{subject}/start`, `/next`, `/finish` | ≥200 responses per item → CAT selection behind same endpoints |
| Learning engine BKT/DKT | Python FastAPI service, BKT with hand-set parameters, Connect-RPC (speaks gRPC and HTTP/JSON from one `.proto`) | `UpdateMastery`, `RecommendNext`, `PlanDay` | Enough data → fitted BKT, then DKT behind the same RPCs |
| AI tutor | Authored hints (2 per item) via the help flow | `POST /help/{itemId}` returns a help turn | After pilot → tutor-gateway answers the same endpoint |
| Parent app | Weekly email + read-only `/parent` web page via magic link | reporting GraphQL `weeklyReport(studentId)` | Phase 4 → parent screens in the Expo app on the same query |
| Authoring studio | Sanity Studio with item, lesson and skill schemas | content module API (Sanity is behind it) | Need item review workflow + LLM drafts → custom panel on the same API |
| SSO (Clever, ClassLink, SAML) | WorkOS AuthKit: Google login + magic links + picture passwords for students | identity module, JWT claims | District customer → enable more WorkOS connections, no code change |
| Rostering (OneRoster) | CSV import in admin panel | `roster.importEnrollments(rows)` | District customer → OneRoster sync calls the same function |
| Datadog observability | OpenTelemetry → Grafana Cloud free tier + Sentry free | OTel SDK | Volume exceeds free tier → point the OTel exporter elsewhere |
| AWS hosting (ECS Fargate, CloudFront, WAF) | One always-free Oracle Cloud Arm VM (2 OCPU, 12 GB) running Docker Compose: API, engine, staff app, student web app, Postgres. Cloudflare free plan for DNS, TLS, CDN and Tunnel | Same Docker images (multi-arch arm64 + amd64), env-based config, one Terraform module set per hosting target | Gate 3 passed or startup credits arrive → ECS Fargate + CloudFront (step 4.0); Phase 5 adds EKS modules |
| RDS Postgres (Aurora) | Postgres container on the VM, same major version as RDS, encrypted volume; nightly encrypted backups to the cloud's free object storage plus an off-site copy | Module migrations; `pg_dump` / restore | Move to AWS (step 4.0) → restore the dump into RDS |
| SES email | Resend or Brevo free tier | notification module `EmailProvider` interface | Free-tier sending limit reached or move to AWS → SES provider |
| SOC 2 controls | Written policies, encrypted DB, audit log table, access via SSO only | `audit.log(actor, action, target)` | First district deal → Vanta/Drata on top of the same controls |

**Not seams** (built properly from day one, because retrofitting them is a rewrite): pseudonymous student IDs, consent ledger, module boundaries, event schemas, the item JSON schema, the client event outbox (offline-safe), and tenant ID on every table.

## 4. Component map
Every component from the architecture doc, what exists by pilot day (end of Phase 2), and what waits.

| Layer | Component | Pilot scope (by week 18) | Later |
|---|---|---|---|
| UI/UX | Design system `@platform/ui` | Tokens, 15 core components, item renderer, one age theme (grades 4–5), RTL-safe layout rules | More age themes, Arabic, WCAG AA audit |
| Client | Student app (Expo + RN Web) | Login, placement, today's plan, lesson player, mastery quiz, hints, XP and streak | Native build, tutor, other subjects, rewards store |
| Control panel | Guide panel (`/guide`) | Live room grid, student drill-down, nudge, placement override, weekly summary | Goal meetings, messaging, tutor flag queue |
| Control panel | Admin panel (`/admin`) | School and cohort setup, CSV roster import, parent invites | Multi-school, roster sync, exports |
| Control panel | Authoring (Sanity Studio) | Skill, lesson, item and hint schemas; review status field | Custom authoring panel with LLM drafts |
| Control panel | Ops panel (`/ops`) | User lookup with audit, feature flags, event replay | Tenant lifecycle, model releases |
| Client | Parent view | Weekly email + magic-link `/parent` page, consent form | Parent screens in the app, messaging |
| Backend | identity | WorkOS login, roles, consent ledger, privacy export/delete | More SSO connections, OpenFGA |
| Backend | roster | Tenant, school, cohort, enrollment; CSV import | OneRoster/Clever sync |
| Backend | content | Skill graph (~60 skills), lessons, items via Sanity | More subjects, LTI apps |
| Backend | assessment | Scoring, mastery quiz (90% gate), fixed-form placement | CAT, IRT calibration, benchmark import |
| Backend | session | Sessions, next, time-on-task, waste rules, outbox sync | Smarter waste model |
| Backend | gamification | XP for productive minutes and mastery, daily goal, streak | Store, teams, leaderboards |
| Backend | notification | Email (Resend or Brevo free tier) | Push, SMS |
| Backend | reporting | Weekly parent email, guide summary, pilot metrics view | Cohort dashboards, LLM narratives |
| Python | learning-engine | BKT, RecommendNext, PlanDay | Fitted BKT, FSRS, DKT, bandit |
| Python | tutor-gateway | — (help endpoint served by authored hints) | Phase 4 |
| Data | Postgres | Postgres container on the free VM, schema per module, tenant ID everywhere, outbox, analytics schema | RDS (Phase 4), read replica, ClickHouse, Redis |
| Infra | Hosting + CI/CD | Oracle always-free VM with Docker Compose (staging + prod projects), Cloudflare, GitHub Actions deploys, encrypted backups | AWS ECS Fargate + RDS (Phase 4), preview envs, EKS, multi-region |
| Infra | Observability | OTel → Grafana Cloud, Sentry | Datadog if needed |

## 5. Phase 0 — Groundwork (weeks 1–3)
**Goal:** the permanent skeleton — repo, contracts, data model, infra and design tokens — so nothing built later has to move.

| Step | Week | What we build | Done when |
|---|---|---|---|
| 0.1 | 1 | Pilot brief: school, 20 students, guide, start date, 3 success metrics (productive minutes/day, skills mastered/week, pre/post test growth) | Pilot school agrees in writing |
| 0.2 | 1 | Monorepo (Turborepo + pnpm): `apps/student` (Expo), `apps/staff` (Next.js), `services/api` (NestJS), `services/learning-engine` (FastAPI), `packages/ui`, `packages/contracts`, `packages/panel-*` | CI builds and lints; boundary rules block cross-module imports |
| 0.3 | 1 | ADRs 001–008: modular monolith, pseudonymous IDs, outbox events, Connect-RPC, seam policy, tenant ID everywhere, item JSON schema, no school-hours deploys | ADRs merged in `/docs/adr` |
| 0.4 | 2 | Contracts: OpenAPI for lesson-player REST, GraphQL schema for panels, `engine.proto`, JSON Schemas for `response.scored`, `session.*`, `skill.mastered` | Typed clients generated for both apps and the engine |
| 0.5 | 2 | Data model: Postgres schemas per module, migrations (Prisma or Drizzle), outbox table, audit table, consent ledger | `pnpm db:migrate` builds a clean database |
| 0.6 | 2 | Hosting: claim an Oracle always-free Arm VM in a region in the pilot's country (upgrade to pay-as-you-go but stay inside free limits, which avoids idle reclaim); Terraform (OCI provider) for VM, network and object storage; Docker Compose with staging and prod projects; Cloudflare DNS + Tunnel; encrypted disk; secrets with SOPS | `terraform apply` + `docker compose up` recreates the server from scratch |
| 0.7 | 3 | CI/CD with GitHub Actions: test → build multi-arch images → push to GitHub Container Registry → deploy to staging over the Cloudflare Tunnel on merge; manual promote to prod; OTel → Grafana Cloud and Sentry wired | One trace spans student app → API → engine → DB |
| 0.8 | 3 | Design tokens + 15 core components in Storybook; wireframes of the lesson player and guide room grid | Pilot guide reviews wireframes |
| 0.9 | 3 | identity v0: WorkOS login, roles (student, guide, parent, admin, author, ops), JWT claims with tenant + pseudonymous ID | Each role signs in and lands on its empty home |

**Gate 0 → 1:** sign-in works on both apps in staging; contracts and ADRs merged; wireframes approved.
**Gate 0 evidence (`docs/evidence/gate-0.md`):** checklist linking — staging sign-in demo for all 6 roles, contracts PR, ADRs 001–008, guide-approved wireframes (screenshot or note), step 0.2–0.9 evidence bundles.

## 6. Phase 1 — Walking skeleton (weeks 4–8)
**Goal:** one thin slice through every layer — a student practices one skill cluster (e.g., equivalent fractions, ~5 skills, ~50 items), the engine adapts, the mastery gate works, and the guide sees it live. This is the prototype, and every line of it survives into the pilot.

| Step | Week | What we build | Layer | Done when |
|---|---|---|---|---|
| 1.1 | 4 | Sanity schemas (skill, prerequisite, lesson, item, hint); content module reads Sanity behind its API; author 5 skills, 50 items, 2 hints each | Content + Backend | `GET /skills/{id}/prereqs` and `GET /lessons/{id}` return Sanity data |
| 1.2 | 4–5 | Item renderer in `@platform/ui`: multiple choice, numeric, fraction input; emits telemetry events | UI/UX + Frontend | All three types work in Chrome and iPad Safari |
| 1.3 | 5 | assessment: score response, write `response.scored` to outbox; mastery quiz with 90% gate | Backend | Quiz pass unlocks next skill in the graph |
| 1.4 | 6 | learning-engine: BKT per skill, UpdateMastery, RecommendNext (≈75% success target, prerequisite fallback) over Connect-RPC | Python | Simulated student script masters all 5 skills with no dead ends |
| 1.5 | 6 | session: start, `GET /next`, time-on-task ledger; client event outbox with idempotent IDs and `POST /sync/outbox` | Backend + Frontend | Unplugging Wi-Fi for 5 minutes loses no responses |
| 1.6 | 7 | Student app slice: login → lesson → practice → hint → quiz → celebration | Frontend | A child completes the slice unaided |
| 1.7 | 7 | Guide panel slice: room grid with live status via GraphQL subscription | Control panel | Status updates within 5 s of a student action |
| 1.8 | 8 | Prototype test: 3–5 children, 30-minute sessions, guide watching; usability notes | UX research | Findings logged; top 5 fixes scheduled into Phase 2 |

**Phase 1 mandatory test evidence (attached to the relevant step bundles):**
- **Engine simulation** (step 1.4): scripted simulated student masters all 5 skills, no dead ends — attach run log.
- **Offline test** (step 1.5): Wi-Fi unplugged 5 minutes mid-session, reconnect, zero lost responses — attach client outbox log + server dedup log.
- **Live latency test** (step 1.7): room-grid update within 5 s of a student action — attach timestamps.
- **Child test** (steps 1.6/1.8): usability notes + top-5 fixes list.

**Gate 1 → 2:** children finish the slice without help, the engine adapts sensibly, no data loss, and the guide says the room view is useful.
**Gate 1 evidence (`docs/evidence/gate-1.md`):** links to the four test artifacts above + all step 1.1–1.8 bundles.

## 7. Phase 2 — Pilot build (weeks 9–18)
**Goal:** widen the skeleton to everything the 20-student pilot needs, then harden it. No new architecture — only more content, more screens and the operational basics.

| Step | Week | What we build | Layer | Done when |
|---|---|---|---|---|
| 2.1 | 9–12 | Full content path: ~60 skills, ~600 items, 2 hints each (LLM-drafted in Sanity, reviewed by the part-time teacher) | Content | ≥8 items per skill on every skill; all reviewed |
| 2.2 | 9 | Fixed-form placement: ~25 items across clusters, sets initial BKT mastery per skill | Backend + Frontend | Placement ≤30 min; matches teacher estimate for most test students |
| 2.3 | 10 | PlanDay: daily goal (e.g., 30 productive math minutes), ordered skill queue | Python | Each student opens to a sensible today's plan |
| 2.4 | 10 | Waste rules v1: rapid guessing (<3 s), idle (>90 s), repeated hint abuse; productive-minute calculation | Backend | Flags appear in guide panel; XP pauses during waste |
| 2.5 | 11 | gamification: XP for productive minutes + mastery, daily goal ring, streak | Backend + Frontend | XP and streak visible; no XP during flagged waste |
| 2.6 | 12 | Guide panel v1: drill-down (skills, time, flags), nudge, placement override, weekly summary | Control panel | Guide runs a dry-run day from the panel alone |
| 2.7 | 13 | Admin panel v1: school and cohort setup, CSV roster import, parent invites; ops panel v1: user lookup (audited), flags, outbox replay | Control panel | You onboard the pilot school in under an hour |
| 2.8 | 14 | Consent and privacy: parent consent form (digital), consent ledger, privacy export/delete, privacy policy, data-retention job | Backend + Compliance | No student record exists without a consent entry |
| 2.9 | 15 | reporting + notification: dbt-postgres models, weekly parent email, magic-link `/parent` page, pilot metrics view | Backend + Data | Friday email shows correct numbers for test students |
| 2.10 | 16 | Polish from Phase 1 findings: onboarding, celebration screens, accessibility basics (contrast, focus, font size) | UI/UX | Top 5 usability issues closed |
| 2.11 | 17 | Hardening: load test at 5× (100 simulated students), backup/restore drill, basic security review (OWASP top 10, dependency scan), runbook | Infra + Security | Restore in <1 h; no high-severity findings open |
| 2.12 | 18 | Dress rehearsal: full 2-hour block with 5 children and the guide; fix list | All | Zero blocking issues; pilot start date confirmed |

**Step-specific evidence requirements:**
- **2.1:** content QA report — ≥8 items/skill, 100% teacher-reviewed (attach review log).
- **2.2:** placement validation — vs teacher estimates (attach comparison table).
- **2.11:** load-test report at 5× with p95 latencies; timed backup/restore drill; OWASP/dependency scan output; runbook.
- **2.12:** dress-rehearsal report (5 children + guide), zero blocking issues, fix list.

**Gate 2 → 3:** dress rehearsal passes, all 20 consents collected, pre-test scheduled.
**Gate 2 evidence (`docs/evidence/gate-2.md`):** dress-rehearsal report, consent-ledger export (pseudonymized), pre-test schedule, all step bundles.

## 8. Phase 3 — Pilot run (weeks 19–30)
**Goal:** 12 weeks of real use that produce evidence. During the pilot you build almost nothing new: you operate, measure and fix.

| Step | Week | What happens | Done when |
|---|---|---|---|
| 3.1 | 19 | Pre-test (a normed benchmark or a validated fractions assessment) for all 20 students; go-live | Baseline recorded for every student |
| 3.2 | 19–30 | Weekly ritual (Friday, 2 h): review productive minutes, mastery rate, waste flags, guide notes, parent feedback; pick at most 2 fixes for next week | 12 weekly reviews logged |
| 3.3 | 21 | Fit BKT parameters from real responses; update item difficulties | Engine predictions improve on held-out responses |
| 3.4 | 22–24 | Tune waste rules with guide-labeled episodes | Guide agrees with most flags |
| 3.5 | 19–30 | Content fixes: rewrite confusing items, add items to skills where students stall | No skill with >30% quiz failure rate left untouched |
| 3.6 | 30 | Post-test, parent and guide survey, pilot report (growth, minutes, engagement, what failed) | Report written and shared with the school |

**Evidence:** `docs/evidence/pilot/week-N.md` every Friday — metrics (productive minutes/day, skills mastered/week, waste flags, parent feedback) + the ≤2 fixes shipped behind flags.

**Rules during the pilot:** no deploys 07:00–15:00 school time; every fix behind a feature flag; seams upgraded only if a trigger fires.

**Gate 3 → 4:** measurable growth vs baseline, guide and most parents want to continue, and at least one school or funder commits to the next step. *(This gate triggers the AWS move in step 4.0.)*
**Gate 3 evidence (`docs/evidence/gate-3.md`):** pre/post growth table, weekly logs, survey results, commitment note, pilot report link.

## 9. Phase 4 — Grow (months 8–14)
**Goal:** turn a proven pilot into a full core-academics product for a few schools. This is where the first seams are upgraded and the first hire joins.

| Step | What we build | Seam it fills or upgrades | Done when |
|---|---|---|---|
| 4.0 | Move hosting to AWS on startup credits: Terraform for ECS Fargate, RDS, CloudFront, WAF, SES; restore Postgres; switch DNS; outside school hours | Upgrades the hosting, Postgres and email seams | Same images run on AWS; all pilot data restored and verified |
| 4.1 | First hire: a full-stack engineer (TypeScript); you move toward tech lead | — | Hire onboarded via the ADRs and this plan |
| 4.2 | Math path extended to grades 3–6 | — (content only) | Full year of math per grade |
| 4.3 | Reading path: skill graph, leveled passages, items; LTI 1.3 launch for one licensed reading app with xAPI ingestion | content gains LTI provider | Third-party reading progress updates mastery |
| 4.4 | tutor-gateway v1: Claude via Bedrock, RAG over own lessons (pgvector), Socratic-only prompts, answer-leak and safety classifiers, cost cap; grades 6+ first | Fills the `POST /help/{itemId}` seam | 500-case golden eval passes |
| 4.5 | FSRS spaced review and interleaving in PlanDay | Engine extension, same RPCs | Review items appear in sessions |
| 4.6 | Parent screens in the Expo app (report, goals, messages) | Upgrades parent web page seam | Most parents open weekly |
| 4.7 | Native iPad build of the student app | Upgrades RN Web seam | App on TestFlight / App Store |
| 4.8 | Guide panel v2: goal meetings, notes, messaging, tutor flag queue | — | Guides run 1:1s in the panel |
| 4.9 | Custom authoring panel: item review workflow, LLM drafts with approval | Upgrades Sanity-only seam (Sanity stays for lesson prose) | Teacher publishes without you |
| 4.10 | Compliance: SOC 2 readiness with Vanta/Drata; DPA templates | Builds on existing controls | Type I audit booked |

**Seam-upgrade evidence (§0.4) is required for steps 4.0, 4.4, 4.5, 4.6, 4.7, 4.9:** empty contract diff + all pre-existing tests green unmodified. Step 4.0 additionally attaches row-count verification of the `pg_dump` restore into RDS and the post-switch smoke test.

**Gate 4 → 5:** 3+ schools live, reading and math in use, tutor eval passing, revenue per student covers cloud and content costs.
**Gate 4 evidence (`docs/evidence/gate-4.md`):** per-school activation table, tutor eval report, unit-economics worksheet, seam-upgrade proofs.

## 10. Phase 5 — Scale-out (month 15 onward)
**Goal:** reach the full architecture by upgrading seams as their triggers fire. From here the plan rejoins Phases 3–4 of the architecture doc's roadmap.

| Step | What we build | Seam upgraded |
|---|---|---|
| 5.1 | Multi-school tenancy: Postgres RLS enforced, tenant-scoped keys, admin panel for networks | `authz.check` → OpenFGA |
| 5.2 | District integration: Clever, ClassLink, SAML; OneRoster sync | WorkOS connections; `roster.importEnrollments` fed by sync |
| 5.3 | Event volume: relay publishes to Kinesis (or MSK); ClickHouse warehouse | Outbox relay target; dbt adapter |
| 5.4 | Performance: Redis for queues and leaderboards; WebSocket gateway | `QueueStore`, `Cache`, subscription transport |
| 5.5 | Engine v2: DKT and contextual bandit; GrowthBook A/B on learning outcomes | Same engine RPCs |
| 5.6 | Panels split into separate apps where needed (e.g., ops on internal domain) | Panel packages mounted in new apps |
| 5.7 | SOC 2 Type II, iKeepSafe; multi-region and data residency; Arabic and Spanish | Infra Terraform modules; RTL already supported in `@platform/ui` |
| 5.8 | Science path, K–2 and 9–12 bands, rewards store, team challenges, content marketplace | Extensions on existing modules |

Every step in this phase carries the §0.4 seam-upgrade proof in its evidence bundle.

## 11. Release readiness (final delivery)
When Phase 5 completes (or @Hussam declares "ready to deploy"), the AI compiles **`docs/RELEASE-READINESS.md`**:
1. Full test-suite output across all apps/services (100% green)
2. Coverage summary
3. E2E recordings covering: student login → placement → plan → lesson → quiz → mastery; guide live view + nudge; parent weekly email + magic-link page; admin roster import; author publishing an item
4. Security review: OWASP top-10 check, dependency audit, PII scan results, consent-ledger integrity check
5. Performance report: load tests at expected scale; p95 latencies for next-item, sync, and room updates
6. Infra: Terraform state, timed backup/restore drill, runbook, rollback procedure
7. Observability: Grafana dashboards, Sentry, alert rules, sample traces for every critical flow
8. Seam register: current state of every seam + what remains
9. Known limitations and their triggers
10. Sign-off table: all gates 0–5 with links to their evidence documents

## 12. Control panels and UI/UX
Two deployable apps carry all six surfaces for the pilot. Each surface lists the module that owns its data, so a screen never reaches past its API.

| Surface | Lives in | Pilot screens | Data from |
|---|---|---|---|
| Student | `apps/student` (Expo, RN Web) | Login, placement, today's plan, lesson player, hint, mastery quiz, celebration, XP and streak | session, content, assessment, gamification |
| Guide | `apps/staff` → `/guide` (`panel-guide`) | Room grid, student drill-down, nudge, placement override, weekly summary | session (subscription), learning-engine, reporting |
| Admin | `apps/staff` → `/admin` (`panel-admin`) | School and cohort setup, CSV roster import, parent invites | roster, identity |
| Authoring | Sanity Studio (hosted) | Skills, prerequisites, lessons, items, hints, review status | content |
| Ops | `apps/staff` → `/ops` (`panel-ops`) | User lookup (audited), feature flags, outbox replay, consent records | identity, admin APIs |
| Parent | Email + `apps/staff` → `/parent` (magic link) | Weekly report, consent | reporting, identity |

**UI/UX workflow per screen (solo-sized):** sketch → Figma frame using `@platform/ui` → 15-minute test with 1–2 real users (a child or the guide) → build from Storybook components. No screen ships with one-off styles.

**Design rules for the pilot:**
- One age theme (grades 4–5): large touch targets, short text, audio for instructions optional.
- Time is visible: today's goal and productive minutes always on screen for the student; who is off task always on screen for the guide.
- Help in two taps: hint 1, hint 2, then "raise hand" to the guide.
- XP animates only for productive work.
- RTL-safe layouts and contrast tokens from day one, so Arabic and WCAG AA later need no redesign.

## 13. How we build together
One step at a time, in order. A step is closed before the next opens.

**Session loop (each working session with the AI):**
1. **Pick** the next open step number (kickoff prompt: `docs/PROMPT_START_SESSION.md`).
2. **Contract** — draft or update the contract (OpenAPI, GraphQL, `.proto`, event schema) and its tests; @Hussam checks it against the architecture doc.
3. **Seam check** — if the step takes a shortcut, it gets a row in the seam register first (§0.4 proof at upgrade).
4. **Build** — module code, tests, UI from Storybook components.
5. **Verify** — tests green, no boundary-lint errors, no PII in logs or events, trace visible.
6. **Close** — evidence bundle committed with the code (§0.2), deploy to staging, tick the step, note follow-ups.

**Definition of done (every step):** contract updated · tests on new code · boundary lint clean · OTel trace and Sentry errors visible · no PII outside identity · ADR if a decision was made · deployed to staging · **evidence bundle committed in the same commit/PR**.
