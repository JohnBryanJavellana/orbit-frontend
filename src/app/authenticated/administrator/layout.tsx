'use client';

import { usePathname, useRouter } from "next/navigation";
import MenuTemplate from "../../custom-global-components/MenuTemplate/MenuTemplate";
import useWebToken from "../../hooks/useWebToken";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, MenuItem } from "@mui/material";
import useGetCurrentUser from "../../hooks/useGetCurrentUser";
import AuthGuard from "@/app/guard/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { getToken } = useWebToken();
    const navigate = useRouter();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [currentActiveLink, setCurrentActiveLink] = useState<string>('dashboard');
    const location = usePathname();
    const { userData } = useGetCurrentUser();
    const [anchorElAssets, setAnchorElAssets] = useState(null);
    const [anchorElMembers, setAnchorElMembers] = useState(null);

    const handleOpenAssetsMenu = (event: any) => setAnchorElAssets(event.currentTarget);
    const handleCloseAssetsMenu = () => setAnchorElAssets(null);

    const handleOpenMembersMenu = (event: any) => setAnchorElMembers(event.currentTarget);
    const handleCloseMembersMenu = () => setAnchorElMembers(null);

    useEffect(() => {
        if (location.includes('/authenticated/administrator/profile')) {
            return setCurrentActiveLink('profile');
        } else if (location.includes('/authenticated/administrator/projects')) {
            return setCurrentActiveLink('projects');
        } else if (location.includes('/authenticated/administrator/leaderboard')) {
            return setCurrentActiveLink('leaderboard');
        } else if (location.includes('/authenticated/administrator/members')) {
            return setCurrentActiveLink('members');
        } else if (location.includes('/authenticated/administrator/announcements')) {
            return setCurrentActiveLink('announcements');
        } else if (location.includes('/authenticated/administrator/custom-assets')) {
            return setCurrentActiveLink('custom-assets');
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
                        <Link href='/authenticated/administrator/profile' style={{ height: '50px' }} className={`nav-link-orbit ${currentActiveLink === 'profile' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}>Profile</Link>
                        <Link href='/authenticated/administrator/projects' style={{ height: '50px' }} className={`nav-link-orbit ${currentActiveLink === 'projects' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}>Projects</Link>
                        <Link href='/authenticated/administrator/leaderboard' style={{ height: '50px' }} className={`nav-link-orbit ${currentActiveLink === 'leaderboard' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}>Leaderboard</Link>

                        {
                            userData?.role === "SUPERADMIN" &&
                            <>
                                <Link href='/authenticated/administrator/announcements' style={{ height: '50px' }} className={`nav-link-orbit ${currentActiveLink === 'announcements' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}>Announcements</Link>

                                <span
                                    onClick={handleOpenAssetsMenu}
                                    className={`nav-link-orbit cursor-pointer ${currentActiveLink === 'custom-assets' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Custom Assets {anchorElAssets ? '▴' : '▾'}
                                </span>

                                <Menu
                                    sx={{ mt: '13.4px' }}
                                    anchorEl={anchorElAssets}
                                    open={Boolean(anchorElAssets)}
                                    onClose={handleCloseAssetsMenu}
                                    disableScrollLock={true}
                                    slotProps={{
                                        paper: {
                                            className: 'custom-bg custom-border-dark rounded-0'
                                        }
                                    }}
                                >
                                    <MenuItem className={`text-sm ${location.includes('/authenticated/administrator/custom-assets/borders') && 'bg-dark'}`} onClick={handleCloseAssetsMenu}>
                                        <Link href='/authenticated/administrator/custom-assets/borders' style={{ textDecoration: 'none', color: 'inherit' }}>
                                            Borders
                                        </Link>
                                    </MenuItem>

                                    <MenuItem className={`text-sm ${location.includes('/authenticated/administrator/custom-assets/avatars') && 'bg-dark'}`} onClick={handleCloseAssetsMenu}>
                                        <Link href='/authenticated/administrator/custom-assets/avatars' style={{ textDecoration: 'none', color: 'inherit' }}>
                                            Avatars
                                        </Link>
                                    </MenuItem>
                                </Menu>

                                <span
                                    onClick={handleOpenMembersMenu}
                                    className={`nav-link-orbit cursor-pointer ${currentActiveLink === 'members' ? 'rpg-button px-3' : 'd-flex align-items-center justify-content-center'}`}
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
                                    <MenuItem className={`text-sm ${location.includes('/authenticated/administrator/members/view-all') && 'bg-dark'}`} onClick={handleCloseMembersMenu}>
                                        <Link href='/authenticated/administrator/members/view-all' style={{ textDecoration: 'none', color: 'inherit' }}>
                                            View All Members
                                        </Link>
                                    </MenuItem>

                                    <MenuItem className={`text-sm ${location.includes('/authenticated/administrator/members/roles') && 'bg-dark'}`} onClick={handleCloseMembersMenu}>
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
    } />
};