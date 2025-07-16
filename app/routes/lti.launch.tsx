import type { LoaderFunctionArgs } from '@remix-run/node';
import { createCookie } from '@remix-run/node';

export const sessionCookie = createCookie('ltiaas_session', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 3600,
});

export async function loader({ request }: LoaderFunctionArgs) {
    const API_KEY = process.env.API_KEY_LTIAAS;
    if (!API_KEY) {
        throw new Error('API_KEY_LTIAAS is not defined in environment variables');
    }
    const BASE_URL = process.env.URL_LTIAAS;
    if (!BASE_URL) {
        throw new Error('URL_LTIAAS is not defined in environment variables');
    }

    const url = new URL(request.url);
    const ltik = url.searchParams.get('ltik');

    if (!ltik) {
        return Response.json({ error: 'Missing ltik' }, { status: 400 });
    }

    const res = await fetch('https://test-leaningobjt.ltiaas.com/api/idtoken', {
        headers: {
            // biome-ignore lint/style/useNamingConvention: <LTIK-AUTH-V2 is the required format>
            Authorization: `LTIK-AUTH-V2 ${API_KEY}:${ltik}`,
        },
    });

    if (!res.ok) {
        const err = await res.json();
        console.error('Failed to fetch ID token:', err);
        return Response.json({ error: 'Failed to fetch ID token', details: err }, { status: res.status });
    }

    const data = await res.json();

    return Response.json({
        user: data.user,
    });
}
