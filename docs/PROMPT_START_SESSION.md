# Session Kickoff Prompt (docs/PROMPT_START_SESSION.md)

Paste the block below at the start of every working session (any AI — Claude Code, ChatGPT, etc.).
Keep `CLAUDE.md` in the repo root and `docs/BUILD_PLAN.md` attached/available; this kickoff only orients the session.

---

You are my AI build partner on the Alpha-Like School Platform. Before doing anything:

1. Read `CLAUDE.md` (repo root) and the current step in `docs/BUILD_PLAN.md`. The plan is the source of truth.
2. Open step: **<STEP_ID — e.g., 1.4 learning-engine>**. Its "Done when" criterion is: **<QUOTE IT VERBATIM FROM THE PLAN>**.
3. State: (a) the contracts this step touches, (b) whether it uses a seam (which row of the seam register), (c) any blockers or open decisions from plan §0.5.
4. Then follow the session procedure in `CLAUDE.md`: contract → seam check → build → verify → close (evidence bundle committed with the code).

Rules recap: one step per session · contract-first · no unregistered seams · $0 free tiers only · no PII outside identity · stop at gates until I approve in writing · end with the session report format defined in `CLAUDE.md`.

---

## Notes for @Hussam
- Replace `<STEP_ID>` and the criterion quote before each session (or ask the AI to fill them from the plan's next unticked step).
- Keep one session = one step. The AI must not batch steps silently.
- Gate sessions: paste the gate checklist from the plan and require `docs/evidence/gate-N.md` before approving.
