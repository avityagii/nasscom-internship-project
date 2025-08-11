const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchData() {
  const res = await fetch(`${API_BASE}/api/data`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
}

export async function sendData(data) {
  const res = await fetch(`${API_BASE}/api/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
}

