import { type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { sessionCookie } from '@utils/cookie.server';
import { jwtManager } from '@utils/jwt.server';

export async function loader({ request }: LoaderFunctionArgs) {
    const cookie = await sessionCookie.parse(request.headers.get('Cookie'));

    if (!cookie) {
        throw redirect('/wrong-door');
    }

    const cookieName = process.env.COOKIE_NAME;
    if (!cookieName) {
        throw redirect('/wrong-door');
    }

    const session = cookie[cookieName];

    if (!(await jwtManager.verify(session))) {
        throw redirect('/wrong-door');
    }

    return { session: await jwtManager.verify(session) };
}
