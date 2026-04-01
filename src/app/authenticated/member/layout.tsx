'use client';

import { usePathname, useRouter } from "next/navigation";
import MenuTemplate from "../../custom-global-components/MenuTemplate/MenuTemplate";
import useWebToken from "../../hooks/useWebToken";
import { useEffect, useState } from "react";
import Link from "next/link";
import useGetCurrentUser from "../../hooks/useGetCurrentUser";
import AuthGuard from "@/app/guard/AuthGuard";

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
            return setCurrentActiveLink('');
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

    return <AuthGuard children={
        showMenu ? <>
            <MenuTemplate
                children={children}
                menuItems={
                    <>
                        <Link href='/authenticated/member/profile' className={`nav-link-orbit ${currentActiveLink === 'profile' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}>Profile</Link>
                        <Link href='/authenticated/member/leaderboard' className={`nav-link-orbit ${currentActiveLink === 'leaderboard' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}>Leaderboard</Link>
                        <Link href='/authenticated/member/projects' className={`nav-link-orbit ${currentActiveLink === 'projects' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}>My Projects</Link>
                    </>
                }
            />
        </> : <></>
    } />
};