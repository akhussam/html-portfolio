# ADR-008: No school-hours deploys

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md §8 (rules during the pilot), CLAUDE.md rule 7, steps 0.7, 2.7

## Context
During the pilot, children use the platform in class. A failed or disruptive deploy during lessons costs real learning time and the school's trust.

## Decision
- **From the start of Phase 3** (pilot go-live), no deploys to production between **07:00 and 15:00 pilot-local time**. The pilot country is Saudi Arabia (pilot brief D1), so the time zone is **Asia/Riyadh** (UTC+3).
- **The production deploy job enforces this.** The manual promote-to-prod workflow (step 0.7) refuses to run inside the window. An emergency override needs an explicit input and is logged.
- **Every change during the pilot sits behind a feature flag** (ops panel flags, step 2.7). Fixes are switched on outside school hours, or by the guide's choice.
- Staging deploys are not restricted.

## Consequences
- Production fixes land in the afternoon or evening. Behaviour can still be turned off at any time by switching a flag off, which is not a deploy.
- **Open point:** the window applies every day until @Hussam confirms the school week (e.g. Sunday–Thursday). Narrowing it to school days later is a one-line change to the guard.
