import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

export default function useAuth(shouldRedirect: any) {
    const { data: session }: { data: any } = useSession();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            signOut({ callbackUrl: '/login', redirect: shouldRedirect });
        }

        if (session === null) {
            if (router.route !== '/login') {
                router.replace('/login');
            }
            setIsAuthenticated(false);
        } else if (session !== undefined) {
            if (router.route === '/login') {
                router.replace('/');
            }
            setIsAuthenticated(true);
        }
    }, [session]);

    return isAuthenticated;
}