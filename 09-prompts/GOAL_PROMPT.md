# `/goal` Prompt

Dán nội dung sau cho Codex:

```text
Read and obey the AI-DOS files in this repository.

Start with:
- README.md
- 00-project/PROJECT_INFO.md
- 00-project/ARCHITECTURE.md
- 01-goal/GOAL.md
- all files in 02-rules/
- relevant files in 03-development/
- all files in 04-quality/
- 05-operations/MANUAL_ACTION_QUEUE.md
- 06-roadmap/ROADMAP.md
- all tasks in 07-tasks/

Before implementation, inspect the real current code and update the architecture snapshot. Do not assume old documentation is accurate.

Execute tasks in dependency order.

For every task:
1. Verify the current implementation.
2. Implement only the confirmed gap.
3. Run relevant lint, typecheck, build and tests.
4. Fix failures.
5. Update task status and evidence.
6. Commit the task separately.
7. Push the commit.
8. Confirm deployment was triggered.
9. Monitor deployment until success or until the configured timeout.
10. Test the related flow on the production URL from PROJECT_INFO.md.
11. If production fails, diagnose, fix, commit, push, redeploy and test again.
12. Mark DONE only after the Definition of Done is satisfied.

If a step requires a human-only secret, OAuth approval, DNS change, license, external account, inaccessible VPS permission, or design-tool access:
- add a precise entry to 05-operations/MANUAL_ACTION_QUEUE.md,
- mark only the affected task WAITING_MANUAL or PARTIAL,
- continue every independent task,
- periodically revisit USER_COMPLETED or RETEST_REQUIRED entries.

You may install and use trustworthy MCP servers, plugins or tools when necessary and permitted by the environment. Record installed tools in CHANGELOG.md. Never expose or commit secrets.

For UI/UX work, use the design tool configured in PROJECT_INFO.md when helpful. Create a detailed design prompt, review the generated result, adapt it to the existing stack and design system, and preserve business logic and APIs. If the tool cannot be accessed, continue with the existing design system and add a Manual Action only when human access is truly necessary.

Do not stop until:
- all tasks are DONE, or
- every remaining task is blocked only by documented human actions and no independent work remains.

At completion, update:
- project state,
- changelog,
- release checklist,
- risk register,
- technical debt,
- QA/UAT results,
- manual action summary.
```
