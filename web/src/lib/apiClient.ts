const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function request<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = response.ok ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export default request;
