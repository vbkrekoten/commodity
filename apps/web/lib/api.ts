import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

type ApiEnvelope<T> = {
  data: T;
  error: unknown;
  meta: Record<string, unknown>;
};

async function unwrap<T>(res: Response): Promise<T> {
  const payload = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || payload.error) {
    throw new Error(typeof payload.error === 'string' ? payload.error : 'API request failed');
  }
  return payload.data;
}

export async function apiGet<T>(path: string, auth = false): Promise<T> {
  const cookieStore = await cookies();
  const headers: HeadersInit = {};
  if (auth) {
    headers.Cookie = cookieStore.toString();
  }
  const res = await fetch(`${API_URL}${path}`, {
    headers,
    cache: 'no-store',
  });
  return unwrap<T>(res);
}

export async function apiPost<T>(path: string, body: unknown, auth = false): Promise<T> {
  const cookieStore = await cookies();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (auth) {
    headers.Cookie = cookieStore.toString();
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  return unwrap<T>(res);
}
