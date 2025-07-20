import { Outlet, useLoaderData } from '@remix-run/react';
import { UserContext } from '~/utils/user-context';
import type { loader } from './loader';

export { loader } from './loader';

export default function AppLayout() {
    const userData = useLoaderData<typeof loader>();
    console.log('UserContext:', UserContext);
    console.log('userData:', userData);
    return (
        <UserContext.Provider value={userData.session}>
            <div className='min-h-screen bg-gray-50'>
                <Outlet />
            </div>
        </UserContext.Provider>
    );
}
