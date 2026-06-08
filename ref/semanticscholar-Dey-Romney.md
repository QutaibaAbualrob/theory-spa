# Dey-Romney TM Visualization Paper — Reference Summary

**Paper:** Visualization of a Mathematical Model of Dey-Romney
**Source:** https://www.semanticscholar.org/paper/Visualization-of-a-Mathematical-Model-of-Dey-Romney/1895073109cc0cf350238424cc5c25dd3898ed4a
**(Full text behind paywall/verification — abstract only)**

## Relevance to Our MVP

This paper is cited in the project spec to support the claim that **Turing Machine visualization benefits from dynamic tape representation with mutable memory**. Specifically:

> **"Dynamic visualization is especially useful for computation models with mutable memory"**
> — used to argue that TM addition should show tape state + head movement per step

## Key Takeaway

For our TM Addition module, the visual approach should emphasize:
1. **Tape rendering as cells** — each cell shows its symbol clearly
2. **Head position indicator** — the user can see where the read/write head is
3. **State alongside tape** — connecting tape changes to state transitions
4. **Per-step actions** — show read → write → move as an animation sequence

This validates our TapeView component design.
