import { useUserContext } from '~/utils/user-context';

export default function Home() {
    const userData = useUserContext();
    return (
        <div>
            <h1>Home</h1>
            <p>{userData?.userGivenName}</p>
        </div>
    );
}
