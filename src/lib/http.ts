// this is a fetch helper
// a generic get fucntion so each get call is one line
const API_BASE = "https://pokeapi.co/api/v2";

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} ${message}`);
  }
  return res.json() as Promise<T>;
}
