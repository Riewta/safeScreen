const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("safescreen-auth");
    if (!raw) return null;
    return (JSON.parse(raw) as { state?: { accessToken?: string } }).state?.accessToken ?? null;
  } catch {
    return null;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers, ...rest } = options;

  const url = new URL(path, BASE_URL || "http://localhost");
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const token = getAccessToken();

  const res = await fetch(BASE_URL ? url.toString() : path, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get:    <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "GET", ...options }),

  post:   <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "POST", body, ...options }),

  put:    <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PUT", body, ...options }),

  patch:  <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PATCH", body, ...options }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};
