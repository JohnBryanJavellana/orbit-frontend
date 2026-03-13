'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

interface ModalChangeAvatarProps {
    userCustomAvatarId?: number | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: boolean) => void
}

export default function ModalChangeAvatar({ userCustomAvatarId, id, titleHeader, callbackFunction }: ModalChangeAvatarProps) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [mainProfile, setMainProfile] = useState<any | null>(null);
    const [avatars, setAvatars] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [avatarId, setAvatarId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const GetAvailableAvatars = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/avatar/avatar/get_available_custom_avatars`, {
                userCustomAvatarId: userCustomAvatarId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMainProfile(response.data.main_profile);
            setAvatars(response.data.avatars);
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

    const SetAsCurrentAvatar = async () => {
        const ask = window.confirm("Are you sure you want to use this as your current avatar?");
        if (!avatarId || !ask) return;

        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('using', avatarId === "MAIN" ? 'MAIN' : 'CUSTOM');
            formData.append('userCustomAvatarId', userCustomAvatarId?.toString() ?? '');
            formData.append('avatarId', avatarId);

            const response = await axios.post(`${urlWithApi}/administrator/avatar/avatar/set_as_my_custom_avatar`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    alert(error.response?.data.message);
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsSubmitting(false);
            handleClose();
        }
    }

    useEffect(() => {
        GetAvailableAvatars(true);
        return () => { };
    }, [userCustomAvatarId]);

    useEffect(() => {
        if (mainProfile) {
            setAvatarId(mainProfile?.shown_avatar === "MAIN" ? 'MAIN' : mainProfile?.custom_avatar_id)
        }
    }, [mainProfile]);

    const handleClose = () => {
        $(`#change_avatar_${id}`).modal('hide');
        callbackFunction(false);
    }

    return (
        <>
            <ModalTemplate
                id={`change_avatar_${id}`}
                size={"md"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                bodyClassName="bg-dark"
                body={
                    <>
                        {
                            isFetching
                                ? <p>Please wait...</p>
                                : <div className="row">
                                    <div className="col-4">
                                        <div className="card custom-bg rounded-0 custom-border-dark elevation-1">
                                            <div className="card-header custom-bottom-border-dark py-0 px-0 text-right">
                                                <Tooltip title="Change True Avatar">
                                                    <IconButton size="small" onClick={() => { }}>
                                                        <EditIcon color='inherit' />
                                                    </IconButton>
                                                </Tooltip>

                                                <Checkbox
                                                    size="small"
                                                    className="m-0"
                                                    checked={avatarId === 'MAIN'}
                                                    onChange={(_, checked) => {
                                                        setAvatarId('');
                                                        if (checked) setAvatarId('MAIN');
                                                    }}
                                                    slotProps={{
                                                        input: { 'aria-label': 'controlled' },
                                                    }}
                                                />
                                            </div>
                                            <div className="card-body text-center">
                                                <img src={`${urlWithoutApi}/user-images/${mainProfile.profile_picture}`} className="img-fluid rounded-circle" height={150} />
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        avatars.length > 0 && avatars.map((a: any, index: number) => {
                                            return <div className="col-4" key={index} style={{ userSelect: 'none' }}>
                                                <div className="card custom-bg rounded-0 custom-border-dark elevation-1">
                                                    <div className="card-header custom-bottom-border-dark py-0 px-0 text-right">
                                                        <Checkbox
                                                            size="small"
                                                            className="m-0"
                                                            checked={String(avatarId) === String(a.id)}
                                                            onChange={(_, checked) => {
                                                                setAvatarId('');
                                                                if (checked) setAvatarId(a.id.toString());
                                                            }}
                                                            slotProps={{
                                                                input: { 'aria-label': 'controlled' },
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="card-body text-center">
                                                        <img src={`${urlWithoutApi}/custom-avatar-images/${a.filename}`} className="img-fluid rounded-circle" height={150} />
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type='button' className='btn btn-danger btn-sm elevation-1' disabled={isFetching || isSubmitting || !avatarId} onClick={() => SetAsCurrentAvatar()}>
                            Save Changes
                        </button>
                    </>
                }
            />
        </>
    );
}