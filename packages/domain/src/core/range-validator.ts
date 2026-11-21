import { DomainRangeError } from "./invariant-error.js";
/**
 * Range validator helper for Domain Invariants (e.g. INV-01).
 */
import { type Result, err, ok } from "./result.js";

export function validateRange(
  fieldName: string,
  value: number,
  min: number,
  max: number,
): Result<number, DomainRangeError> {
  if (Number.isNaN(value) || value < min || value > max) {
    return err(new DomainRangeError(fieldName, value, min, max));
  }
  return ok(value);
}
