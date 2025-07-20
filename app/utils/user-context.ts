import { decodeJwt } from 'jose';
import { createContext, useContext } from 'react';
import type { CookieData } from '~/shared/types';

type UserContext = CookieData | null;

export async function getTokenData(token?: string | null): Promise<UserContext> {
    if (!token) {
        return null;
    }

    try {
        const { payload } = await decodeJwt(token);
        return payload as CookieData;
    } catch (error) {
        console.error('Error decrypting token:', error);
        return null;
    }
}

export const UserContext = createContext<UserContext>(null);

export function useUserContext(): UserContext {
    const context = useContext(UserContext);
    if (context === undefined) {
        // biome-ignore lint/nursery/noSecrets: <just no secrets>
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
}
