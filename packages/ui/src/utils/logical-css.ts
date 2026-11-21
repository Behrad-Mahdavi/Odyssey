/**
 * Logical CSS Direction Guardrails.
 * Prohibits physical direction classes (ml, mr, pl, pr, left, right, text-left, text-right).
 */
export const FORBIDDEN_PHYSICAL_CLASSES = [
  "ml-",
  "mr-",
  "pl-",
  "pr-",
  "left-",
  "right-",
  "text-left",
  "text-right",
] as const;

export function containsPhysicalCss(classString: string): boolean {
  return FORBIDDEN_PHYSICAL_CLASSES.some((forbidden) =>
    classString.split(/\s+/).some((cls) => cls.startsWith(forbidden) || cls === forbidden),
  );
}
