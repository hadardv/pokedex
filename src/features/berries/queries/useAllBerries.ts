import { useQuery } from "@tanstack/react-query";
import { fetchAllBerries } from "../api/berries";
import type { Berry } from "../types/berry";

export function useAllBerries() {
    return useQuery<Berry[]>({
        queryKey: ["berries","all"],
        queryFn: fetchAllBerries,
    });
}