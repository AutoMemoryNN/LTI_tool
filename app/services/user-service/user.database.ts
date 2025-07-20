/** biome-ignore-all lint/style/useNamingConvention: <> */
import type { AppUser } from '@shared/types';
import mongoose, { type Document, model, Schema } from 'mongoose';
import type { UserDatabase } from './user.database.interface';

export type SimpleRole = 'admin' | 'instructor' | 'student' | 'guest';

const RoleSchema = new Schema(
    {
        roleName: { type: String, required: true },
        permissions: [{ type: String, required: true }],
    },
    { _id: false }
);

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        givenName: String,
        roles: { type: [RoleSchema], required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc: Document, ret: Record<string, unknown>) => {
                ret.id = (ret._id as mongoose.Types.ObjectId).toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const UserModel = mongoose.models.User || model<AppUser>('User', UserSchema);

export class MongoUserDatabase implements UserDatabase {
    constructor(databaseUri: string) {
        connectMongo(databaseUri);
    }

    async createUser(user: Omit<AppUser, 'id'>): Promise<AppUser> {
        const created = await UserModel.create(user);
        return created.toJSON();
    }

    async getUserById(id: string): Promise<AppUser | null> {
        const user = await UserModel.findById(id);
        return user?.toJSON() || null;
    }

    async getUserByEmail(email: string): Promise<AppUser | null> {
        const user = await UserModel.findOne({ email });
        return user?.toJSON() || null;
    }

    async updateUser(id: string, updates: Partial<Omit<AppUser, 'id'>>): Promise<AppUser | null> {
        const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
        return user?.toJSON() || null;
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return !!result;
    }

    async getAllUsers(): Promise<AppUser[]> {
        const users = await UserModel.find();
        return users.map((u) => u.toJSON());
    }
}

async function connectMongo(uri: string) {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(uri);
    }
}
