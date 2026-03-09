'use client';

import CustomAvatarWithOnlineBadge from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import ModalViewUser from "@/app/custom-global-components/CustomUserPill/components/ModalViewUser";
import useDetectMobileViewport from "@/app/hooks/useDetectMobileViewport";
import useGetRankAttribute from "@/app/hooks/useGetRankAttribute";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Button, FormControl, IconButton, Input, Tooltip } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TablePaginationTemplate from "@/app/custom-global-components/CustomTablePaginationTemplate/CustomTablePaginationTemplate";
import './leaderboard.css';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import ModalViewLeaderboardGuide from "./components/ModalViewLeaderboardGuide";

interface LeaderboardProp { }

export default function Leaderboard({ }: LeaderboardProp) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [friends, setFriends] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { getRankAttribute } = useGetRankAttribute();
    const [searchText, setSearchText] = useState<string>('');
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const isMobileViewPort = useDetectMobileViewport();

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);

    const GetFriends = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/member/friends/get_friends`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFriends(response.data.friends);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        GetFriends(true);
        return () => { };
    }, []);

    const filteredFriends = useMemo(() => {
        let result = Array.isArray(friends) ? friends : [];

        if (searchText.trim()) {
            result = result.filter(friend =>
                (friend?.first_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (friend?.middle_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (friend?.last_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (friend?.suffix || '').toLowerCase().includes(searchText.toLowerCase()) ||
                (friend?.email || '').toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return result;
    }, [friends, searchText]);

    return (
        <>
            {
                isFetching
                    ? <p>Please wait...</p>
                    : <>
                        {
                            modalOpenIndex === 1 &&
                            <ModalViewUser
                                user={modalOpenData}
                                callbackFunction={() => {
                                    GetFriends(false);
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }

                        {
                            modalOpenIndex === 2 &&
                            <ModalViewLeaderboardGuide
                                titleHeader="Master the Ascension Hierarchy"
                                id={modalOpenId}
                                callbackFunction={() => {
                                    GetFriends(false);
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }

                        <div className="text-right d-flex align-items-center justify-content-end mb-2">
                            <Tooltip title="Master the Ascension Hierarchy" arrow>
                                <button data-toggle="modal"
                                    data-target={`#view_leaderboard_guide_0`}
                                    onClick={() => {
                                        setModalOpenData(null);
                                        setModalOpenId(0);
                                        setModalOpenIndex(2);
                                    }} className="rpg-button px-3">View Rank Protocol</button>
                            </Tooltip>
                        </div>

                        {
                            friends.length > 0
                                ? <div className="mb-5">
                                    <FormControl fullWidth sx={{ mb: 1 }}>
                                        <Input
                                            id="email"
                                            type="email"
                                            className='custom-field-bg'
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            disableUnderline
                                            size="small"
                                            autoComplete='off'
                                            placeholder='Search friend...'
                                        />
                                    </FormControl>

                                    {
                                        filteredFriends.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((friend: any, index: number) => (
                                            <div key={index}>
                                                <div className={`row px-2 my-2`}>
                                                    <div className={`col-xl-12 py-1 custom-bg custom-border-dark ${friend.role === "SUPERADMIN" ? 'superadmin-glow' : friend.role === "ADMINISTRATOR" ? 'administrator-glow' : ''}`}>
                                                        <div className="row">
                                                            <div className={`col-${isMobileViewPort ? 2 : 1} d-flex align-items-center justify-content-center text-center`}>
                                                                <CustomAvatarWithOnlineBadge height={50} width={50} src={`${urlWithoutApi}/user-images/${friend.profile_picture}`} isOnline={friend.is_online} />
                                                            </div>
                                                            <div className={`col-${isMobileViewPort ? 6 : 8} d-flex align-items-center justify-content-center`}>
                                                                <div className="w-100 mt-1">
                                                                    <div className="text-bold text-truncate">{`${friend.first_name} ${friend.middle_name} ${friend.last_name} ${friend.suffix ?? ''}`}</div>
                                                                    <div className="text-sm text-muted text-truncate">{friend.email}</div>
                                                                    <div className={`text-sm text-${friend.gender === "MALE" ? 'primary' : 'danger'}`}>
                                                                        <span className="material-icons-outlined" style={{ fontSize: '15px' }}>{String(friend.gender).toLowerCase()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={`col-2 d-flex align-items-center justify-content-center`}>
                                                                <div className="w-100">
                                                                    {getRankAttribute(["ADMINISTRATOR"].includes(friend.role) ? '∞' : ["SUPERADMIN"].includes(friend.role) ? 'Ω' : friend.total_points || 0, !isMobileViewPort)}
                                                                </div>
                                                            </div>

                                                            <div className={`col-${isMobileViewPort ? 2 : 1} d-flex align-items-center justify-content-center`}>
                                                                <Tooltip title="View Friend">
                                                                    <IconButton data-toggle="modal" data-target={`#view_user_details_${friend.id}`} onClick={() => {
                                                                        setModalOpenData(friend);
                                                                        setModalOpenId(friend.id);
                                                                        setModalOpenIndex(1);
                                                                    }}>
                                                                        <OpenInNewIcon color='inherit' />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                    <TablePaginationTemplate
                                        dataset={friends}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[12, 24, 36, 50]}
                                        page={page}
                                        labelRowsPerPage={"Friends per page:"}
                                        callbackFunction={(e) => {
                                            setRowsPerPage(e.rows);
                                            setPage(e.page);
                                        }}

                                    />
                                </div> : <p>You do not have any friends.</p>
                        }
                    </>
            }
        </>
    );
}