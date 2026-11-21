# ADR 0005: Vector PDF Generation via CSS @media print (No jsPDF / html2canvas)

## Status
Accepted

## Context
Chapter 5 requires a clean, single-page landscape Odyssey Plan (Pitch Mode) that users can print or export to PDF to share with mentors and Life Design Teams. Rasterizer libraries (e.g., `html2canvas`, `jsPDF`) produce blurry text, break RTL text layouts, and balloon bundle size.

## Decision
Use standard browser printing with CSS Paged Media (`@media print`, `@page { size: A4 landscape; margin: 0; }`).
- Vector fidelity is preserved.
- Dual-language typography (Vazirmatn / Inter) renders cleanly without font rasterization glitches.
- Zero extra client runtime bundle weight.

## Consequences
### Positive
- 100% crisp vector output with selectable text.
- Perfect bidirectional RTL and LTR support.
### Trade-offs
- Browser print dialog appearance varies across operating systems.
