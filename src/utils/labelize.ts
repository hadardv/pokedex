import type { Berry } from "../features/berries/types/berry";

export function labelize(firmness: Berry["firmness"]) {
  return firmness
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}
