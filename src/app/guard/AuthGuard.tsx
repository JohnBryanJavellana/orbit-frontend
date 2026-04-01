'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingPopup from '../custom-global-components/LoadingPopup/LoadingPopup';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const roleAccess = localStorage.getItem('role-access');
        const csrfToken = localStorage.getItem('csrf-token');

        if (!roleAccess || !csrfToken) {
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return <LoadingPopup isMainDarkBg />;
    }

    return <>{children}</>;
}