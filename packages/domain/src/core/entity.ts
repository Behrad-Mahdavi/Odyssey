/**
 * Base classes for Domain-Driven Design (DDD).
 * Guarantees immutability and identity equality semantics.
 */

export abstract class ValueObject<TProps> {
  protected readonly props: Readonly<TProps>;

  constructor(props: TProps) {
    this.props = Object.freeze(props);
  }

  public equals(other?: ValueObject<TProps>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}

export abstract class Entity<TProps> {
  public readonly id: string;
  protected readonly props: TProps;
  public readonly createdAt: number;
  public readonly updatedAt: number;

  constructor(id: string, props: TProps, createdAt?: number, updatedAt?: number) {
    this.id = id;
    this.props = props;
    this.createdAt = createdAt ?? Date.now();
    this.updatedAt = updatedAt ?? this.createdAt;
  }

  public equals(other?: Entity<TProps>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this.id === other.id;
  }
}

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private _domainEvents: unknown[] = [];

  public get domainEvents(): readonly unknown[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: unknown): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
