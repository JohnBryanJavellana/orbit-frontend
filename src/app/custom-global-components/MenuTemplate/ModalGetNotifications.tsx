'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { useEffect, useState } from "react";
import CustomAvatarWithOnlineBadge from "../CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import axios from "axios";
import useWebToken from "@/app/hooks/useWebToken";
import { useRouter } from "next/navigation";
import TablePaginationTemplate from "../CustomTablePaginationTemplate/CustomTablePaginationTemplate";

interface ModalGetNotificationsProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalGetNotifications({ data, id, titleHeader, callbackFunction }: ModalGetNotificationsProps) {
    const { urlWithApi } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<any[]>([]);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const { getToken } = useWebToken();
    const navigate = useRouter();

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);

    const GetNotifications = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/administrator/notification/notification/get_notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications(response.data.notifications);
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
        GetNotifications(true);
        return () => { };
    }, []);

    const handleClose = () => {
        $(`#get_notifications_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`get_notifications_${id}`}
                size={"md"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                headerClassName="border-0 pb-0"
                isModalCentered
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
                            isFetching
                                ? <p>Please wait..</p>
                                : notifications.length > 0
                                    ? <>
                                        {
                                            notifications.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((notification: any, index: number) => (
                                                <div key={index}>
                                                    <div className="row my-2">
                                                        <div className="col-3 d-flex align-items-center justify-content-center">
                                                            <CustomAvatarWithOnlineBadge
                                                                data={notification.sender}
                                                                height={50}
                                                                width={50}
                                                                isOnline={notification.sender.is_online}
                                                                isAdmin={notification.sender.role === "SUPERADMIN"}
                                                                srcShown={notification.sender.custom_avatar?.shown_avatar}
                                                            />
                                                        </div>
                                                        <div className="col-9 text-sm pt-2" style={{ lineHeight: '15px' }}>
                                                            <div className="text-muted" style={{ lineHeight: '23px' }}><strong className="text-light">{`${notification.sender.first_name} ${notification.sender.middle_name} ${notification.sender.last_name} ${notification.sender.suffix ?? ''}`}</strong>{notification.message}</div>
                                                            <div className="mt-2 text-muted">{FormatDatetimeToHumanReadable(notification.created_at, true)}</div>
                                                        </div>
                                                    </div>

                                                    {index < notifications.length - 1 && <hr className="style-two mt-4" />}
                                                </div>
                                            ))
                                        }

                                        <div className="mt-4">
                                            <TablePaginationTemplate
                                                dataset={notifications}
                                                rowsPerPage={rowsPerPage}
                                                rowsPerPageOptions={[12, 24, 36, 50]}
                                                page={page}
                                                labelRowsPerPage={"Notifications per page:"}
                                                callbackFunction={(e) => {
                                                    setRowsPerPage(e.rows);
                                                    setPage(e.page);
                                                }}

                                            />
                                        </div>
                                    </>
                                    : <p>No notifications found.</p>
                        }
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />

                        <button type='button' disabled={isFetching} className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>
                    </div>
                }
            />
        </>
    );
}