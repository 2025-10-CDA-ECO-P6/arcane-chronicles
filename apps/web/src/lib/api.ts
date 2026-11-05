const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type RequestOptions = Omit<RequestInit, 'method' | 'body'>;
type RequestBody = FormData | Blob | Record<string, unknown> | unknown[];

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(status: number, data: unknown, path: string) {
    super(`API error ${status} on ${path}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const isFile = (value: unknown): value is Blob => value instanceof Blob;

function containsFile(body: Record<string, unknown>): boolean {
  return Object.values(body).some(
    (value) => isFile(value) || (Array.isArray(value) && value.some(isFile)),
  );
}

export function toFormData(values: Record<string, unknown>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (isFile(value)) {
      formData.append(key, value);
    } else if (Array.isArray(value) && value.every(isFile)) {
      value.forEach((file) => formData.append(key, file));
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}

function serialize(body: RequestBody, headers: Headers): BodyInit {
  if (body instanceof FormData || isFile(body)) {
    return body;
  }
  if (!Array.isArray(body) && containsFile(body)) {
    return toFormData(body);
  }
  headers.set('Content-Type', 'application/json');
  return JSON.stringify(body);
}

async function parse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }
  const contentType = response.headers.get('Content-Type') ?? '';
  return contentType.includes('application/json') ? response.json() : response.text();
}

async function request<T>(
  method: Method,
  path: string,
  body?: RequestBody,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const payload = body === undefined ? undefined : serialize(body, headers);

  const response = await fetch(`${API_URL}/api${path}`, {
    credentials: 'include',
    ...options,
    method,
    headers,
    body: payload,
  });

  const data = await parse(response);

  if (!response.ok) {
    throw new ApiError(response.status, data, path);
  }

  return data as T;
}

export const apiFetch = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: RequestBody, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body?: RequestBody, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: RequestBody, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};
