# Pilot Brief — Alpha-Like School Platform

**Step 0.1 · Draft v0.1 · 2026-10-11 · Status: awaiting written confirmation from @Hussam and the pilot school**

> Done when (plan §5): *"Pilot school agrees in writing."*
> Fields marked **TBC** are still open. Nothing here was invented; defaults come from `docs/BUILD_PLAN.md`.

## 1. School
| Field | Value |
|---|---|
| School | **TBC** (name and city) |
| Country | Syria |
| Type | **TBC** (school or micro-school) |
| Signatory for written agreement | **TBC** (name and role at the school) |

## 2. Students
| Field | Value |
|---|---|
| Number | 20 |
| Grades | 4–5 |
| Subject | Math only: multiplication, division and fractions (~60 skills, ~600 items) |
| Language of instruction in the app | **TBC** (English or Arabic; see open question Q1) |
| Devices | **TBC** (iPads or Chromebooks in a browser, per plan §2) |

## 3. Guide
| Field | Value |
|---|---|
| Guide | Hussam (mentor at the school) |
| Role in pilot | Runs the room, uses the guide panel, labels waste flags, gives feedback in the weekly review |

## 4. Parents
~20 parents. Weekly email + magic-link `/parent` page (plan §12).

## 5. Dates
| Milestone | Plan week | Proposed date (week 1 = 2026-10-11) |
|---|---|---|
| Build starts | 1 | 2026-10-11 |
| Prototype test with 3–5 children (step 1.8) | 8 | ~2026-11-29 |
| Dress rehearsal (step 2.12) | 18 | ~2027-02-07 |
| **Pilot start / pre-test (step 3.1)** | 19 | **~2027-02-14 — TBC** |
| Post-test and pilot report (step 3.6) | 30 | ~2027-05-02 |

## 6. Success metrics (plan step 0.1 defaults)
| # | Metric | Definition | Target |
|---|---|---|---|
| 1 | Productive minutes per day | Minutes of on-task practice per student per school day, excluding flagged waste (rapid guessing, idle, hint abuse) | **TBC** (plan suggests a 30-minute daily goal) |
| 2 | Skills mastered per week | Skills passed at the 90% mastery quiz, per student per week | **TBC** |
| 3 | Pre/post test growth | Score change on the same fractions assessment at week 19 and week 30 | **TBC** |

## 7. Decisions made in this step
| # | Decision | Source |
|---|---|---|
| D1 | Pilot runs in Syria. | @Hussam, 2026-10-11 |
| D2 | Privacy law is out of scope for this phase (resolves plan §0.5 item 3 for now). | @Hussam, 2026-10-11 |
| D3 | The guide is Hussam, a mentor at the school. | @Hussam, 2026-10-11 |

**Note on D2:** the plan lists pseudonymous student IDs and the consent ledger as **"not seams"** (plan §3): they are built from day one whatever the law says, and Gate 2 requires "all 20 consents collected". Ignoring the law therefore changes **no plan work**. It only means we don't need a legal review against a specific statute. This needs confirming (Q4).

## 8. Open questions for @Hussam
| # | Question | Why it matters |
|---|---|---|
| Q1 | Will the students use the app in **English or Arabic**? | The plan ships one theme with "Arabic later" (§4, §10 step 5.7). If the pilot needs Arabic, content (step 2.1), the UI (step 0.8) and RTL become pilot scope. That would change the plan and needs an ADR. |
| Q2 | School name, city and signatory? | Needed to meet the "Done when" criterion. |
| Q3 | Is a pilot start of **~2027-02-14** acceptable? | Ramadan 2027 is expected around early February to early March, with Eid al-Fitr around 10 March. Shorter school days could lower productive minutes in the first pilot weeks. |
| Q4 | Can you confirm that "ignore privacy law" still keeps parent consent and pseudonymous IDs (D2 note)? | Keeps the plan unchanged. |
| Q5 | Devices and connectivity at school: iPads or Chromebooks? How reliable are Wi-Fi and power? | Affects step 1.5 (offline outbox) and the device test in step 1.2. |
| Q6 | Targets for the three metrics? | Needed to judge Gate 3. |

## 9. Risks surfaced (details in `docs/evidence/phase-0/0.1/risks.md`)
- **Hosting region (step 0.6).** The plan says "a region in the pilot's country". Oracle Cloud has no Syrian region, so a nearby region is needed. Decide in step 0.6.
- **Service availability from Syria.** Oracle Cloud, Cloudflare, WorkOS, Resend/Brevo, Sanity, Grafana Cloud and Sentry must all be usable by accounts and end users in Syria. Check before step 0.6. Do not assume.

## 10. Sign-off
| Party | Name | Agreement (written) | Date |
|---|---|---|---|
| Project owner | @Hussam | ☐ | |
| Pilot school | TBC | ☐ | |
