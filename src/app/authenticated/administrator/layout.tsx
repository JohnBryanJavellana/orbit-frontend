'use client';

import { usePathname, useRouter } from "next/navigation";
import MenuTemplate from "../../custom-global-components/MenuTemplate/MenuTemplate";
import useWebToken from "../../hooks/useWebToken";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, MenuItem } from "@mui/material";
import useGetCurrentUser from "../../hooks/useGetCurrentUser";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { getToken } = useWebToken();
    const navigate = useRouter();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [currentActiveLink, setCurrentActiveLink] = useState<string>('dashboard');
    const location = usePathname();
    const { userData } = useGetCurrentUser();
    const [anchorElMembers, setAnchorElMembers] = useState(null);

    const handleOpenMembersMenu = (event: any) => {
        setAnchorElMembers(event.currentTarget);
    };

    const handleCloseMembersMenu = () => {
        setAnchorElMembers(null);
    };

    useEffect(() => {
        if (location.includes('/authenticated/administrator/profile')) {
            return setCurrentActiveLink('profile');
        } else if (location.includes('/authenticated/administrator/projects')) {
            return setCurrentActiveLink('projects');
        } else if (location.includes('/authenticated/administrator/leaderboard')) {
            return setCurrentActiveLink('leaderboard');
        } else if (location.includes('/authenticated/administrator/members')) {
            return setCurrentActiveLink('members');
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
                    <Link href='/authenticated/administrator/profile' className={`nav-link-orbit ${currentActiveLink === 'profile' && 'rounded-sm elevation-2 custom-bg-maroon custom-border-dark text-white'}`}>Profile</Link>
                    <Link href='/authenticated/administrator/projects' className={`nav-link-orbit ${currentActiveLink === 'projects' && 'rounded-sm elevation-2 custom-bg-maroon custom-border-dark text-white'}`}>Projects</Link>
                    <Link href='/authenticated/administrator/leaderboard' className={`nav-link-orbit ${currentActiveLink === 'leaderboard' && 'rounded-sm elevation-2 custom-bg-maroon custom-border-dark text-white'}`}>Leaderboard</Link>

                    {
                        userData?.role === "SUPERADMIN" &&
                        <>
                            <span
                                onClick={handleOpenMembersMenu}
                                className={`nav-link-orbit cursor-pointer ${currentActiveLink === 'members' && 'rounded-sm elevation-2 custom-bg-maroon custom-border-dark text-white'}`}
                                style={{ cursor: 'pointer' }}
                            >
                                Members {anchorElMembers ? '▴' : '▾'}
                            </span>

                            <Menu
                                sx={{ mt: '13.4px' }}
                                anchorEl={anchorElMembers}
                                open={Boolean(anchorElMembers)}
                                onClose={handleCloseMembersMenu}
                                disableScrollLock={true}
                                slotProps={{
                                    paper: {
                                        className: 'custom-bg custom-border-dark rounded-0'
                                    }
                                }}
                            >
                                <MenuItem className="text-sm" onClick={handleCloseMembersMenu}>
                                    <Link href='/authenticated/administrator/members/view-all' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        View All Members
                                    </Link>
                                </MenuItem>

                                <MenuItem className="text-sm" onClick={handleCloseMembersMenu}>
                                    <Link href='/authenticated/administrator/members/roles' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Member Roles
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </>
                    }
                </>
            }
        />
    </> : <></>
};