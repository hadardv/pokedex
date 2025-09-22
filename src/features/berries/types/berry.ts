export type Flavor = {
    name: string,
     potency: number;
    }

export type Berry = {
    id: number;
    name: string;
    firmness: "very-soft" | "soft" | "hard" | "very-hard" | "super-hard";
    flavors: Flavor[];
}

export type BerryListDTO = {
    count: number;
    results: {
        name: string;
        url: string;
    }[];
}

export type BerryDetailDTO = {
    id: number;
    name: string;
    firmness: {
        name: Berry["firmness"];
        url: string;
    }
    flavors: {
        potency: number;
        flavor: {
            name: Flavor["name"];
            url: string;
    }[];
}
}