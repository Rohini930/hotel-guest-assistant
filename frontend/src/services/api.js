const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

async function request(path, options = {}) {
  const r = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const d = await r.json().catch(() => ({}));

  if (!r.ok) throw new Error(d.error || "Something went wrong.");

  return d;
}

export const sendChat = (message, conversation) =>
  request("/chat", {
    method: "POST",
    body: JSON.stringify({ message, conversation })
  });

export const checkAvailability = (payload) =>
  request("/availability", {
    method: "POST",
    body: JSON.stringify(payload)
  });