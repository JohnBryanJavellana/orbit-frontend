'use client';

import { AppBar, Box, Toolbar, IconButton, Container, Tooltip, Avatar, Menu, MenuItem, Typography, Badge } from '@mui/material';
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
import ModalChangeAvatarBorder from './ModalChangeAvatarBorder';
import ModalChangeAvatar from './ModalChangeAvatar';
import ModalGetDailyActivities from './ModalGetDailyActivities';
import ModalUserLogout from './ModalUserLogout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ModalGetNotifications from './ModalGetNotifications';

export default function MenuTemplate({ children, menuItems }: { children: React.ReactNode, menuItems: React.ReactNode }) {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const { userData, refreshUser } = useGetCurrentUser();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const isMobileViewPort = useDetectMobileViewport();
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const { getToken, removeToken } = useWebToken();
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
    const navigate = useRouter();

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

    const GetNotifications = async () => {
        try {
            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/administrator/notification/notification/check_ishas_unread_notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setHasUnreadNotifications(response.data.notifications);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                }
            }
        } finally { }
    }

    useEffect(() => {
        if (userData) {
            let intervalId: any;
            intervalId = setInterval(() => { GetNotifications(); }, 5000);

            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };
        }
    }, [userData]);

    useEffect(() => {
        let intervalId: any;
        const token = getToken('csrf-token');

        const PingUser = async () => {
            try {
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

        if (userData && token) {
            PingUser();
        }

        return () => {
            if (intervalId || !token) {
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
                modalOpenIndex === 2 &&
                <ModalChangeAvatarBorder
                    userBorderId={userData?.custom_border_id}
                    id={modalOpenId}
                    titleHeader={'Change Avatar Border'}
                    callbackFunction={(e) => {
                        refreshUser();
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);

                        if (e) window.location.reload();
                    }}
                />
            }

            {
                modalOpenIndex === 3 &&
                <ModalChangeAvatar
                    userCustomAvatarId={userData?.user_custom_avatar_id}
                    id={modalOpenId}
                    titleHeader={'Change Avatar'}
                    callbackFunction={(e) => {
                        refreshUser();
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);

                        if (e) window.location.reload();
                    }}
                />
            }

            {
                modalOpenIndex === 4 &&
                <ModalGetDailyActivities
                    data={userData?.user_custom_avatar_id}
                    id={modalOpenId}
                    titleHeader={'Play Games'}
                    callbackFunction={(e) => {
                        refreshUser();
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);

                        if (e) window.location.reload();
                    }}
                />
            }

            {
                modalOpenIndex === 5 &&
                <ModalUserLogout
                    id={modalOpenId}
                    titleHeader={'Logout Confirmation'}
                    callbackFunction={(e) => {
                        refreshUser();
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                modalOpenIndex === 6 &&
                <ModalGetNotifications
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={'Notifications'}
                    callbackFunction={(e) => {
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
                                        <Tooltip title="Open notifications">
                                            <IconButton onClick={() => {
                                                handleCloseUserMenu();
                                                setModalOpenData(null);
                                                setModalOpenId(userData.id);
                                                setModalOpenIndex(6);
                                            }} data-toggle="modal" data-target={`#get_notifications_${userData?.id}`}>
                                                <Badge color="error" variant="dot" invisible={hasUnreadNotifications === false}>
                                                    <NotificationsNoneIcon color='inherit' />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Play Games">
                                            <Link href={'#'} className='mr-4 ml-3 play_daily_games' onClick={() => {
                                                handleCloseUserMenu();
                                                setModalOpenData(null);
                                                setModalOpenId(userData.id);
                                                setModalOpenIndex(4);
                                            }} data-toggle="modal" data-target={`#get_daily_activities_${userData?.id}`}>
                                                <img src={`/system-images/play_now.gif`} height={50} />
                                            </Link>
                                        </Tooltip>

                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                <Avatar alt={`${userData?.first_name} ${userData?.last_name}`} className={'rounded-circle'} src={`${urlWithoutApi}/${userData.custom_avatar.shown_avatar === "MAIN" ? 'user-images' : 'custom-avatar-images'}/${userData.custom_avatar.shown_avatar === "MAIN" ? userData.custom_avatar.profile_picture : userData.custom_avatar.custom_avatar.filename}`} />
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
                                                setModalOpenData({
                                                    ...userData,
                                                    editor: ["SUPERADMIN", "ADMINISTRATOR"].includes(userData?.role) ? 'OMEGA' : 'MEMBER',
                                                    reloadAfter: true
                                                });
                                                setModalOpenId(userData.id);
                                                setModalOpenIndex(0);
                                            }} data-toggle="modal" data-target={`#create_or_update_member_${userData?.id}`}>
                                                <Typography className='text-sm' sx={{ textAlign: 'left' }}>Update Profile</Typography>
                                            </MenuItem>

                                            <MenuItem className='custom-bottom-border-dark' onClick={() => {
                                                handleCloseUserMenu();
                                                setModalOpenData(userData);
                                                setModalOpenId(userData.id);
                                                setModalOpenIndex(3);
                                            }} data-toggle="modal" data-target={`#change_avatar_${userData?.id}`}>
                                                <Typography className='text-sm' sx={{ textAlign: 'left' }}>Change Avatar</Typography>
                                            </MenuItem>

                                            <MenuItem className='custom-bottom-border-dark' onClick={() => {
                                                handleCloseUserMenu();
                                                setModalOpenData(userData);
                                                setModalOpenId(userData.id);
                                                setModalOpenIndex(2);
                                            }} data-toggle="modal" data-target={`#change_avatar_border_${userData?.id}`}>
                                                <Typography className='text-sm' sx={{ textAlign: 'left' }}>Change Avatar Border</Typography>
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

                                            <MenuItem onClick={() => {
                                                handleCloseUserMenu();
                                                setModalOpenId(userData.id);
                                                setModalOpenIndex(5);
                                            }} data-toggle="modal" data-target={`#logout_user_${userData?.id}`}>
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
