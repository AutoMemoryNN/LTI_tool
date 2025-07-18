import type { AppRole } from '@shared/role-manager';

export interface AppUser {
    id: string;
    email: string;
    name: string;
    givenName?: string;
    role: AppRole[];
}
