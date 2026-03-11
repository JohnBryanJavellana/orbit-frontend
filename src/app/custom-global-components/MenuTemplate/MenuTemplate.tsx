'use client';

import { AppBar, Box, Toolbar, IconButton, Container, Tooltip, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import './MenuTemplate.css';
import { usePathname, useRouter } from 'next/navigation';
import useSystemURLCon from '@/app/hooks/useSystemURLCon';
import axios from 'axios';
import useWebToken from '@/app/hooks/useWebToken';
import useDetectMobileViewport from '@/app/hooks/useDetectMobileViewport';
import useGetCurrentUser from '@/app/hooks/useGetCurrentUser';
import ModalViewUser from '../CustomUserPill/components/ModalViewUser';
import ModalCreateOrUpdateMember from '@/app/authenticated/administrator/members/view-all/components/ModalCreateOrUpdateMember';
import ModalShowMyPointsRecord from './ModalShowMyPointsRecord';

export default function MenuTemplate({ children, menuItems }: { children: React.ReactNode, menuItems: React.ReactNode }) {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const { userData, refreshUser } = useGetCurrentUser();
    const { urlWithoutApi } = useSystemURLCon();
    const isMobileViewPort = useDetectMobileViewport();
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (anchorElNav) {
            setAnchorElNav(null);
        } else {
            setAnchorElNav(event.currentTarget);
        }
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const { urlWithApi } = useSystemURLCon();
    const { getToken, removeToken } = useWebToken();
    const navigate = useRouter();

    const LogoutUser = async () => {
        const confirmed = window.confirm("Are you sure you want to logout? 😭");
        if (!confirmed) return;

        try {
            const token = getToken('csrf-token');
            await axios.get(`${urlWithApi}/logout-user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            removeToken('csrf-token');
            removeToken('role-access');
            navigate.push('/');
        }
    }

    useEffect(() => {
        let intervalId: any;

        const PingUser = async () => {
            try {
                const token = getToken('csrf-token');
                if (!token) return;

                intervalId = setInterval(async () => {
                    try {
                        await axios.get(`${urlWithApi}/ping-user`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            if (error.response?.status === 401) {
                                clearInterval(intervalId);
                            }
                        }
                    }
                }, 15000);
            } catch (error) {
                console.error("Ping failed to initialize", error);
            }
        };

        if (userData) {
            PingUser();
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [userData]);

    return (
        <>
            {
                modalOpenIndex === 0 &&
                <ModalCreateOrUpdateMember
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={'Update Profile Information'}
                    httpMethod={'UPDATE'}
                    callbackFunction={() => {
                        refreshUser();
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                modalOpenIndex === 1 &&
                <ModalShowMyPointsRecord
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={'My Points Record'}
                    callbackFunction={() => {
                        refreshUser();
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                !userData
                    ? <p className='p-4'>Please wait...</p>
                    : <>
                        <AppBar position="fixed" className='custom-bottom-border-dark custom-bg' sx={{ zIndex: 1000 }}>
                            <Container maxWidth="xl">
                                <Toolbar disableGutters>
                                    <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 4 }}>
                                        <img src="/system-images/f2eb6a1d-e5d2-45b5-8c5c-3458f944e97c.png" height={40} />
                                    </Box>

                                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                        <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                                            <MenuIcon />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                        {menuItems}
                                    </Box>

                                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                        {Boolean(anchorElNav) && (
                                            <Box
                                                className="custom-bg custom-border-dark"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    zIndex: 1100,
                                                    minWidth: '200px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    boxShadow: '0px 8px 16px rgba(0,0,0,0.4)',
                                                    p: 1
                                                }}
                                                onMouseLeave={handleCloseNavMenu}
                                            >
                                                {menuItems}
                                            </Box>
                                        )}
                                    </Box>

                                    <Box sx={{ flexGrow: 0 }}>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                <Avatar alt={`${userData?.first_name} ${userData?.last_name}`} className={userData.role === "SUPERADMIN" ? 'rounded-0' : ''} src={userData.role === "SUPERADMIN" ? '/system-images/raw-images/9brubwu9u65f1.gif' : `${urlWithoutApi}/user-images/${userData.profile_picture}`} />
                                            </IconButton>
                                        </Tooltip>

                                        <Menu
                                            sx={{ mt: isMobileViewPort ? '40px' : '47px' }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                            slotProps={{
                                                paper: {
                                                    className: 'custom-bg custom-border-dark rounded-0',
                                                    sx: {
                                                        ml: -2
                                                    }
                                                }
                                            }}
                                        >
                                            <MenuItem className='custom-bottom-border-dark' onClick={() => {
                                                handleCloseUserMenu();
                                                setModalOpenData(userData);
                                                setModalOpenId(userData.id);
                                                setModalOpenIndex(0);
                                            }} data-toggle="modal" data-target={`#create_or_update_member_${userData?.id}`}>
                                                <Typography className='text-sm' sx={{ textAlign: 'left' }}>Update Profile</Typography>
                                            </MenuItem>

                                            {
                                                userData.role === 'MEMBER' &&

                                                <MenuItem className='custom-bottom-border-dark' onClick={() => {
                                                    handleCloseUserMenu();
                                                    setModalOpenId(userData.id);
                                                    setModalOpenIndex(1);
                                                }} data-toggle="modal" data-target={`#show_my_points_record_${userData?.id}`}>
                                                    <Typography className='text-sm' sx={{ textAlign: 'left' }}>Points Record</Typography>
                                                </MenuItem>
                                            }

                                            <MenuItem onClick={() => LogoutUser()}>
                                                <Typography className='text-sm' sx={{ textAlign: 'left' }}>
                                                    <i className="fas fa-sign-out-alt text-danger mr-1"></i> Logout
                                                </Typography>
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                </Toolbar>
                            </Container>
                        </AppBar>

                        <Box component="main" sx={{ mt: 12 }}>
                            <Container maxWidth="xl">
                                {children}
                            </Container>
                        </Box>
                    </>
            }
        </>
    );
}
