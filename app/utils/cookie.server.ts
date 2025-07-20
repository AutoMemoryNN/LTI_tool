import { createCookie } from '@remix-run/node';

const COOKIE_NAME = process.env.COOKIE_NAME || 'moodle_session';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'default-secret';
const COOKIE_PATH = process.env.COOKIE_PATH || '/';

export const sessionCookie = createCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true, // iframe requires secure cookies
    path: COOKIE_PATH,
    sameSite: 'none', // 'none' is required for cross-site cookies
    secrets: [COOKIE_SECRET],
    maxAge: 60 * 60 * 24, // 1 day
});
