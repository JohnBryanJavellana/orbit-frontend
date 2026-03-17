'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomTab from "../CustomTab/CustomTab";
import Checkbox from '@mui/material/Checkbox';
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import LoadingPopup from "../LoadingPopup/LoadingPopup";

interface ModalChangeAvatarBorderProps {
    userBorderId: string,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: boolean) => void
}

export default function ModalChangeAvatarBorder({ userBorderId, id, titleHeader, callbackFunction }: ModalChangeAvatarBorderProps) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [borders, setBorders] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [type, setType] = useState<'FREE' | 'RARE'>('FREE');
    const [borderId, setBorderId] = useState<string>('');
    const [tabId, setTabId] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { userData } = useGetCurrentUser();

    const GetAvailableBorders = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/border/border/get_available_custom_borders`, {
                type: type
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBorders(response.data.borders);
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

    const SetAsCurrentBorder = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('border', borderId.toString());

            const response = await axios.post(`${urlWithApi}/administrator/border/border/set_as_my_custom_border`, formData, {
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
        if (userData) {
            GetAvailableBorders(true);
            return () => { };
        }
    }, [type, userData]);

    useEffect(() => {
        setBorderId(userBorderId);
        return () => { };
    }, [userBorderId]);

    const handleClose = () => {
        $(`#change_avatar_border_${id}`).modal('hide');
        callbackFunction(false);
    }

    const bodyContent = (data: any[]) => {
        return <>
            {
                isFetching
                    ? <div>Please wait...</div>
                    : data.length > 0
                        ? <>
                            <div className="row">
                                {
                                    data.map((border: any, index: number) => (
                                        <div className="col-6" key={index} style={{ userSelect: 'none' }}>
                                            <div className="card custom-bg rounded-0 custom-border-dark elevation-1">
                                                <div className="card-header custom-bottom-border-dark py-0 px-0 text-right">
                                                    {
                                                        border.iCanUse
                                                            ? <Checkbox
                                                                size="small"
                                                                className="m-0"
                                                                disabled={!border.iCanUse}
                                                                checked={String(borderId) === String(border.id)}
                                                                onChange={(_, checked) => {
                                                                    const val = checked ? border.id : 0;
                                                                    setBorderId(val.toString());
                                                                }}
                                                                slotProps={{
                                                                    input: { 'aria-label': 'controlled' },
                                                                }}
                                                            /> : <div className="text-muted pr-2 pt-2">
                                                                <span className="material-icons-outlined">lock</span>
                                                            </div>
                                                    }

                                                </div>

                                                <div className="card-body text-center">
                                                    <img src={`${urlWithoutApi}/border-images/${border.border}`} height={150} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                        : <div>No borders found yet.</div>
            }
        </>
    }

    return (
        <>
            {isSubmitting && <LoadingPopup />}

            <ModalTemplate
                id={`change_avatar_border_${id}`}
                size={"md"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                isModalCentered
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                bodyClassName="py-0"
                body={
                    <>
                        {
                            !userData
                                ? <p>Please wait...</p>
                                : <>
                                    <CustomTab
                                        tabId={tabId}
                                        disabled={isFetching}
                                        tabs={[
                                            {
                                                icon: "lock_open",
                                                label: "Free",
                                                index: 0
                                            },
                                            {
                                                icon: "diamond",
                                                label: "Rare",
                                                index: 1
                                            }
                                        ]}
                                        callbackFunction={(e) => {
                                            setTabId(e);
                                            setType(tabId === 0 ? 'RARE' : 'FREE');
                                        }}
                                    />

                                    <div className="card bg-transparent elevation-0 custom-top-border-dark rounded-0 border-muted mb-0">
                                        <div className="card-body pt-2 pb-0 px-0">
                                            <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                                                {(tabId === 0) && bodyContent(borders)}
                                            </div>

                                            <div role="tabpanel" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                                                {(tabId === 1) && <>
                                                    {
                                                        userData?.role !== "SUPERADMIN" &&
                                                        <div className="w-100 custom-bg mb-2 px-3 py-2 elevation-1">
                                                            <div className="row">
                                                                <div className="col-1 text-warning" style={{ fontSize: '30px' }}><span className="material-icons-outlined">flag</span></div>
                                                                <div className="col-11 text-sm pl-3">
                                                                    Ascend thy presence. Complete thy tasks or plead thy case to the Supreme to claim and use these rare artifacts.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                    {bodyContent(borders)}
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type='button' className='btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white' disabled={isSubmitting} onClick={() => SetAsCurrentBorder()}>
                            Save Changes
                        </button>
                    </div>
                }
            />
        </>
    );
}