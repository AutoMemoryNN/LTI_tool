import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { RoleManager } from '@services/role-service';
import { MongoUserDatabase, UserServiceImpl } from '@services/user-service';
import type { AppUser, CookieData, CourseLaunchData } from '@shared/types';
import { sessionCookie } from '@utils/cookie.server';
import { jwtManager } from '@utils/jwt.server';

if (!(process.env.MONGODB_URI && process.env.MONGODB_USER_DB)) {
    throw new Error('MONGODB_URI or MONGODB_USER_DB is not defined in environment variables');
}

export async function loader({ request }: LoaderFunctionArgs) {
    const userService = new UserServiceImpl(
        new MongoUserDatabase(`${process.env.MONGODB_URI}${process.env.MONGODB_USER_DB}`)
    );

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

    const headerLtiaas = {
        Authorization: `LTIK-AUTH-V2 ${API_KEY}:${ltik}`,
    };

    const res = await fetch('https://test-leaningobjt.ltiaas.com/api/idtoken', {
        headers: headerLtiaas,
    });

    if (!res.ok) {
        const err = await res.json();
        console.error('Failed to fetch ID token:', err);
        return Response.json({ error: 'Failed to fetch ID token', details: err }, { status: res.status });
    }

    const idToken = await res.json();

    const moodleUser = idToken.user;

    const user: AppUser = {
        id: moodleUser.id,
        email: moodleUser.email,
        name: moodleUser.name,
        givenName: moodleUser.given_name,
        roles: RoleManager.getAppRolesFromLtiRoles(moodleUser.roles),
    };

    const _courseLaunch: CourseLaunchData = {
        courseId: idToken.launch.context.id,
        courseName: idToken.launch.context.title,
        courseType: idToken.launch.context.type[0],
        resourceName: idToken.launch.resource.title,
        returnUrl: idToken.launch.presentation.returnUrl,
        membershipsUrl: idToken.launch.custom.context_memberships_url,
    };

    if (!(await userService.getUserByEmail(user.email))) {
        console.log('Creating new user:', user);
        await userService.createUser(user);
    }

    const userDb = await userService.getUserByEmail(user.email);

    if (!userDb?.id) {
        console.error('User is not defined:', userDb);
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const COOKIE_NAME = process.env.COOKIE_NAME;
    if (!COOKIE_NAME) {
        throw new Error('COOKIE_NAME is not defined in environment variables');
    }

    const cookieData: CookieData = {
        userId: userDb.id,
        userEmail: userDb.email,
        userName: userDb.name,
        userGivenName: userDb.givenName,
    };

    const jwtToken = await jwtManager.sign(cookieData);

    const cookieObject = {
        [COOKIE_NAME]: jwtToken,
    };

    console.log('Cookie data with JWT:', cookieObject);

    return redirect('/home', {
        status: 302,
        headers: {
            'Set-Cookie': await sessionCookie.serialize(cookieObject),
        },
    });
}
