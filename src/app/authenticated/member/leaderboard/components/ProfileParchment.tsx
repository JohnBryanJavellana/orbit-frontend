'use client';

import CustomAvatarWithOnlineBadge from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import useDetectMobileViewport from "@/app/hooks/useDetectMobileViewport";
import useGetRankAttribute from "@/app/hooks/useGetRankAttribute";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ModalViewUser from "@/app/custom-global-components/CustomUserPill/components/ModalViewUser";
import ModalViewEnlargeAvatar from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/ModalViewEnlargeAvatar";

export default function ProfileParchment({ user, callbackFunction, nextStringAfterAccountStatus = '' }: { user: any, callbackFunction: (e: boolean) => void, nextStringAfterAccountStatus?: string }) {
    const isMobileViewPort = useDetectMobileViewport();
    const { getRankAttribute } = useGetRankAttribute();
    const { urlWithoutApi } = useSystemURLCon();
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    return (
        <>

            {
                modalOpenIndex === 1 &&
                <ModalViewUser
                    user={modalOpenData}
                    callbackFunction={() => {
                        callbackFunction(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            {
                modalOpenIndex === 2 &&
                <ModalViewEnlargeAvatar
                    data={modalOpenData}
                    callbackFunction={() => {
                        callbackFunction(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            <div className={`px-2 row`}>
                <div className={`col-xl-12 py-1 custom-bg custom-border-dark`}>
                    <div className="row">
                        <div data-toggle="modal" data-target={`#view_enlarge_avatar_${user?.id}`} className={`col-xl-12 d-flex align-items-center justify-content-center text-center`} onClick={() => {
                            setModalOpenData(user);
                            setModalOpenId(user.id);
                            setModalOpenIndex(2);
                        }}>
                            <CustomAvatarWithOnlineBadge
                                data={user}
                                height={80}
                                width={80}
                                src={`${urlWithoutApi}/user-images/${user.profile_picture}`}
                                isOnline={user.is_online}
                                isAdmin={user.role === "SUPERADMIN"}
                                srcShown={user.custom_avatar?.shown_avatar}
                                showNote
                            />
                        </div>

                        <div className={`col-12 px-3 d-flex align-items-center justify-content-center text-center`}>
                            <div className="w-100 mt-1 text-center text-sm">
                                <div className="text-bold text-truncate">{`${user.first_name} ${user.middle_name} ${user.last_name} ${user.suffix ?? ''}`}</div>
                                <div className="text-sm text-muted text-truncate">{user.email}</div>
                                <div className={`text-sm d-flex align-items-center justify-content-center text-${user.gender === "MALE" ? 'primary' : 'danger'}`}>
                                    <span className="material-icons-outlined mr-2" style={{ fontSize: '15px' }}>{String(user.gender).toLowerCase()}</span> <span className="text-muted">•</span> <small className={`text-small ml-2 text-${user.is_online ? 'success' : 'muted'}`}>{user.is_online ? 'ONLINE' : 'OFFLINE'}</small> <small className="text-muted pl-1 text-small">{nextStringAfterAccountStatus}</small>
                                </div>
                            </div>
                        </div>

                        <div className={`col-12 d-flex align-items-center justify-content-center my-2`}>
                            <div className="w-100">
                                {getRankAttribute(["ADMINISTRATOR"].includes(user.role) ? '∞' : ["SUPERADMIN"].includes(user.role) ? 'Ω' : user.total_points || 0, !isMobileViewPort)}
                            </div>
                        </div>

                        {/* <div className={`col-${isMobileViewPort ? 2 : 1} d-flex align-items-center justify-content-center`}>
                            <Tooltip title="View user">
                                <IconButton data-toggle="modal" data-target={`#view_user_details_${user.id}`} onClick={() => {
                                    setModalOpenData(user);
                                    setModalOpenId(user.id);
                                    setModalOpenIndex(1);
                                }}>
                                    <OpenInNewIcon color='inherit' />
                                </IconButton>
                            </Tooltip>
                        </div> */}
                    </div>
                </div>
            </div >
        </>
    );
}