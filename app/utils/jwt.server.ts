import type { CookieData } from '@shared/types';
import { jwtVerify, SignJWT } from 'jose';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const jwtManager = new (class {
    async sign(data: CookieData): Promise<string> {
        return await new SignJWT(data)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(secret);
    }

    async verify(token: string): Promise<CookieData | null> {
        try {
            const { payload } = await jwtVerify(token, secret);
            return payload as CookieData;
        } catch {
            return null;
        }
    }
})();
