import type { ApiError } from './types';

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, body: ApiError) {
    super(body.message);
    this.status = status;
    this.code = body.code;
  }
}

type RequestInitX = RequestInit & { token?: string | null };

export async function api<T>(url: string, init: RequestInitX = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (init.token) {
    headers.set('Authorization', `Bearer ${init.token}`);
  }

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  const data = text.length > 0 ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const errBody: ApiError =
      data && typeof data === 'object' && 'code' in data && 'message' in data
        ? (data as ApiError)
        : { code: 'unknown', message: res.statusText || 'Request failed' };
    throw new ApiClientError(res.status, errBody);
  }

  return data as T;
}
