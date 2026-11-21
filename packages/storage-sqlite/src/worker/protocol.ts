export type WorkerAction = "INIT" | "EXEC" | "RUN" | "ALL" | "GET" | "SEARCH" | "MIGRATE" | "CLOSE";

export interface WorkerRequest<T = unknown> {
  id: string;
  action: WorkerAction;
  payload: T;
}

export interface WorkerResponse<T = unknown> {
  id: string;
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface InitPayload {
  dbName: string;
  vfs?: string;
}

export interface QueryPayload {
  sql: string;
  params?: unknown[];
}

export interface SearchPayload {
  query: string;
  cycleId?: string;
  limit?: number;
}
