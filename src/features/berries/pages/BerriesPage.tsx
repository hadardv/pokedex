import { useMemo, useState } from "react";
import { useAllBerries } from "../queries/useAllBerries";
import type { Berry } from "../types/berry";
import styles from "./BerriesPage.module.css";
import BerryCard from "../components/BerryCard";
import SearchInput from "../components/SearchInput";
import { labelize } from "../../../utils/labelize";
import FirmnessSlider, { type FirmnessOption, type FirmnessValue } from "../components/FirmnessSlider";
import EmptyState from "../components/EmptyState";
import { useDebounceValue } from "../../../hooks/useDebounceValue";

const FIRMNESS_ORDER: Berry['firmness'][] = [
    'super-hard',
    'very-hard',
    'hard',
    'soft',
    'very-soft'
];

export default function BerriesPage() {
    const {data: berries, isLoading, isError, error} = useAllBerries();
    const [selectedFirmness, setSelectedFirmness] = useState<FirmnessValue>('very-soft');
    const [searchTerm, setSearchTerm] = useState('');
    
    const debouncedSearchTerm = useDebounceValue(searchTerm, 300);

     const countsByFirmness = useMemo(() => {
        const map = new Map<Berry['firmness'], number>();
        FIRMNESS_ORDER.forEach((f) => map.set(f,0));
        (berries ?? []).forEach((b) => 
            map.set(b.firmness, (map.get(b.firmness) ?? 0) + 1));
        return map;
    }, [berries]);

    const sliderOptions: FirmnessOption[] = useMemo(() => {
        const opts: FirmnessOption[] = FIRMNESS_ORDER.map((f) => ({
            value: f,
            label: labelize(f),
            count: countsByFirmness.get(f) ?? 0,
        }));
        return opts;
    }, [countsByFirmness]);
       
  
    const filtered = useMemo(() => {
        if(!berries) return [];
        const byFirmness = berries.filter(b => b.firmness === selectedFirmness);
        const term = debouncedSearchTerm.trim().toLowerCase();
        if(term === '') return byFirmness;
        return byFirmness.filter(b => b.name.toLowerCase().includes(term));
    },[berries, selectedFirmness, debouncedSearchTerm]);

   
    if (isLoading) return <div className={styles.center}>Loading berries…</div>;
    if (isError) return <div className={`${styles.center} ${styles.error}`}>{String(error)}</div>;

    return (
        <div className={styles.shell}>
            <div className={styles.card}>
                <FirmnessSlider
                    options={sliderOptions}
                    selected={selectedFirmness}
                    onChange={setSelectedFirmness}
                    title="Pok`e Berries"
                    subtitle="How tough are you?"
                />

                <main className={styles.collection}>
                        <SearchInput 
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search berries..."
                            ariaLabel="Search berries by name"
                        />
                        <div className={styles.scrollList}>
                            {filtered.length === 0 ? (<EmptyState query={searchTerm}/>) : (filtered.map((b) => (
                                <BerryCard key={b.id} berry={b} />
                            )))}
                        </div>
                </main>
            </div>
        </div>
    )
}

