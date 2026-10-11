# Step 0.1 — Risks / deferred items

| Risk | Trigger / when to resolve |
|---|---|
| No Oracle Cloud region in Syria; plan §5 step 0.6 asks for "a region in the pilot's country" | Decide the nearest acceptable region in step 0.6; record it in an ADR |
| Free-tier services (Oracle, Cloudflare, WorkOS, Resend/Brevo, Sanity, Grafana, Sentry, GitHub) may restrict accounts or users in Syria | Check each provider's terms and sign-up before step 0.6; swap a provider behind its seam interface if one is blocked |
| App language undecided (Q1); Arabic would bring RTL + content translation into pilot scope | Answer before step 0.8 (design tokens) and step 2.1 (content) |
| Ramadan 2027 (~Feb–Mar) overlaps the proposed pilot start | Confirm the start date (Q3) |
| Unreliable connectivity/power could stress the offline outbox | Capture conditions (Q5) before step 1.5 |

Other bundle files (tests, coverage, trace, lint, deploy) are N/A: this is a documents-only step with no code.
