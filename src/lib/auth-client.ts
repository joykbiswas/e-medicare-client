export const API_BASE = "http://localhost:5000/api";

export async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
