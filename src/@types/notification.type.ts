type notificationType = {
    id: string;
    title: string;
    description?: string;
    type?: 'ACTION' | 'CHECKLIST' | 'VMC' | 'EQUIPMENT' | 'FORMATION' | 'SYSTEM';
    link?: string;
    ago?: string;
    viewed?: boolean;
    created_at?: string;
};

export type { notificationType };