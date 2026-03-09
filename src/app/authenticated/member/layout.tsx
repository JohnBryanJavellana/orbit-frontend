'use client';

import { usePathname, useRouter } from "next/navigation";
import MenuTemplate from "../../custom-global-components/MenuTemplate/MenuTemplate";
import useWebToken from "../../hooks/useWebToken";
import { useEffect, useState } from "react";
import Link from "next/link";
import useGetCurrentUser from "../../hooks/useGetCurrentUser";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { getToken } = useWebToken();
    const navigate = useRouter();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [currentActiveLink, setCurrentActiveLink] = useState<string>('dashboard');
    const location = usePathname();
    const { userData } = useGetCurrentUser();

    useEffect(() => {
        if (location.includes('/authenticated/member/profile')) {
            return setCurrentActiveLink('profile');
        } else if (location.includes('/authenticated/member/leaderboard')) {
            return setCurrentActiveLink('leaderboard');
        } else if (location.includes('/authenticated/member/projects')) {
            return setCurrentActiveLink('projects');
        } else {
            return navigate.push('/access-denied');
        }
    }, [location]);

    useEffect(() => {
        const token = getToken('csrf-token');
        if (!token) {
            navigate.push('/access-denied');
        } else {
            if (userData) setShowMenu(true);
        }
    }, [userData]);

    return showMenu ? <>
        <MenuTemplate
            children={children}
            menuItems={
                <>
                    <Link href='/authenticated/member/profile' className={`nav-link-orbit ${currentActiveLink === 'profile' && 'rounded-sm elevation-2 custom-bg-maroon custom-border-dark text-white'}`}>Profile</Link>
                    <Link href='/authenticated/member/leaderboard' className={`nav-link-orbit ${currentActiveLink === 'leaderboard' && 'rounded-sm elevation-2 custom-bg-maroon custom-border-dark text-white'}`}>Leaderboard</Link>
                    <Link href='/authenticated/member/projects' className={`nav-link-orbit ${currentActiveLink === 'projects' && 'rounded-sm elevation-2 custom-bg-maroon custom-border-dark text-white'}`}>My Projects</Link>
                </>
            }
        />
    </> : <></>
};