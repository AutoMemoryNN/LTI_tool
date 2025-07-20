import type { AppUser } from '@shared/types';
import type { UserDatabase } from './user.database.interface';
import type { UserService } from './user.service.interface';

export class UserServiceImpl implements UserService {
    private db: UserDatabase;

    constructor(db: UserDatabase) {
        this.db = db;
    }

    async createUser(user: Omit<AppUser, 'id'>): Promise<AppUser> {
        try {
            return await this.db.createUser(user);
        } catch (error) {
            throw new Error(`Error creating user: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async getUserById(id: string): Promise<AppUser | null> {
        try {
            return await this.db.getUserById(id);
        } catch (error) {
            throw new Error(`Error getting user by id: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async getUserByEmail(email: string): Promise<AppUser | null> {
        try {
            return await this.db.getUserByEmail(email);
        } catch (error) {
            throw new Error(`Error getting user by email: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async updateUser(id: string, user: Partial<Omit<AppUser, 'id'>>): Promise<AppUser | null> {
        try {
            return await this.db.updateUser(id, user);
        } catch (error) {
            throw new Error(`Error updating user: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            return await this.db.deleteUser(id);
        } catch (error) {
            throw new Error(`Error deleting user: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async getAllUsers(): Promise<AppUser[]> {
        try {
            return await this.db.getAllUsers();
        } catch (error) {
            throw new Error(`Error getting all users: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
