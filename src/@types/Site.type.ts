export type SiteLocationType = {
    id?: number;
    label?: string;
    locality?: string;
    province?: string;
    latitude?: number | null;
    longitude?: number | null;
    dms?: string | null;
};

export type SiteType = {
    id: number;
    name: string;
    code: string;
    type: string;
    qr_code?: string | null;
    location_id?: number | null;
    location?: SiteLocationType | null;
    created_at?: string;
    updated_at?: string;
};

export type SiteFormType = {
    id?: number;
    name: string;
    code: string;
    type: string;
    locality?: string;
    province?: string;
    latitude?: number | null;
    longitude?: number | null;
    dms?: string;
    qr_code?: string;
};

export type SiteFilterType = {
    search?: string;
    type?: string[];
    province?: string[];
    page?: number;
    per_page?: number;
};
