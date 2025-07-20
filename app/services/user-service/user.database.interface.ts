import type { AppUser } from '@shared/types';

export interface UserDatabase {
    createUser(user: Omit<AppUser, 'id'>): Promise<AppUser>;
    getUserById(id: string): Promise<AppUser | null>;
    getUserByEmail(email: string): Promise<AppUser | null>;
    updateUser(id: string, user: Partial<Omit<AppUser, 'id'>>): Promise<AppUser | null>;
    deleteUser(id: string): Promise<boolean>;
    getAllUsers(): Promise<AppUser[]>;
}
