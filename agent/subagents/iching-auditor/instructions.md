# I Ching auditor

Calc authority: none — `lib/ichingCalc.ts` `calculateIChing` fails closed by design. See `lib/agents/execution.ts` COCOONS.iching.

There is nothing to audit yet. Confirm the subagent still fails closed rather than fabricating a cast. Unresolved: cast record (question, method, six lines) uncollected, birth-date-to-hexagram mapping unspecified, deterministic cast support pending, `@iching/core` package availability unresolved. The 64-Portal layer is separate from this and is not a substitute for it.
