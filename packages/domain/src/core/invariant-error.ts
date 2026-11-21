/**
 * Standard typed domain errors and invariants.
 */
export abstract class DomainError extends Error {
  public abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DomainInvariantError extends DomainError {
  public readonly code = "DOMAIN_INVARIANT_VIOLATION";
  constructor(
    public readonly invariantId: string,
    message: string,
  ) {
    super(`[${invariantId}] Invariant violation: ${message}`);
  }
}

export class DomainRangeError extends DomainError {
  public readonly code = "DOMAIN_RANGE_ERROR";
  constructor(
    public readonly fieldName: string,
    value: number,
    min: number,
    max: number,
  ) {
    super(`Field "${fieldName}" value ${value} is outside valid range [${min}, ${max}].`);
  }
}

export class WordCountInvariantError extends DomainError {
  public readonly code = "WORD_COUNT_INVARIANT_ERROR";
  constructor(
    public readonly maxWords: number,
    public readonly actualWords: number,
  ) {
    super(`Word count exceeds maximum limit of ${maxWords} words (actual: ${actualWords}).`);
  }
}
