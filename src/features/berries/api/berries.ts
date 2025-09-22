import { get } from "../../../lib/http";
import { concurrentMap } from "../../../lib/concurrency";
import type { Berry, BerryDetailDTO, BerryListDTO } from "../types/berry";

const PAGE_LIMIT = 2000;
const DETAIL_CONCURRENCY = 8;

function toDomain(dto: BerryDetailDTO): Berry {
  return {
    id: dto.id,
    name: dto.name,
    firmness: dto.firmness.name,
    flavors: Array.isArray(dto.flavors)
      ? dto.flavors
          .filter((f) => f.potency > 0)
          .map((f) => ({ name: f.flavor.name, potency: f.potency }))
      : [],
  };
}

export async function fetchAllBerries(): Promise<Berry[]> {
    const list = await get<BerryListDTO>(`/berry?limit=${PAGE_LIMIT}`);
    const urls = list.results.map((r) => r.url.replace("https://pokeapi.co/api/v2", ""));
    const details = await concurrentMap(urls, DETAIL_CONCURRENCY, async (path) => get<BerryDetailDTO>(path));
    return details.map(toDomain);
}