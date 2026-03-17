'use client';

import CustomAvatarWithOnlineBadge from "@/app/custom-global-components/CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import TablePaginationTemplate from "@/app/custom-global-components/CustomTablePaginationTemplate/CustomTablePaginationTemplate";
import ModalViewUser from "@/app/custom-global-components/CustomUserPill/components/ModalViewUser";
import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import useDetectMobileViewport from "@/app/hooks/useDetectMobileViewport";
import useGetRankAttribute from "@/app/hooks/useGetRankAttribute";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Divider, FormControl, IconButton, Input, Tooltip } from "@mui/material";
import axios from "axios";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProfileParchment from "@/app/authenticated/member/leaderboard/components/ProfileParchment";

interface ModalViewTaskCollaboratorsProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalViewTaskCollaborators({ data, id, titleHeader, httpMethod, callbackFunction }: ModalViewTaskCollaboratorsProps) {
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [taskCollaborators, setProjectTaskCollaborators] = useState<any | null>([]);
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const isMobileViewPort = useDetectMobileViewport();
    const { getRankAttribute } = useGetRankAttribute();

    const GetSpecificTaskCollaborators = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects/get_project_tasks/get_project_task_collaborators`, {
                taskCtrl: data?.taskCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjectTaskCollaborators(response.data.members);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    alert(error.response?.data.message);
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if (data) {
            GetSpecificTaskCollaborators(true);
            return () => { };
        }
    }, [data]);

    const filteredCollaborators = useMemo(() => {
        let result = Array.isArray(taskCollaborators) ? taskCollaborators : [];

        if (searchText.trim()) {
            result = result.filter(friend =>
                String(friend?.user.first_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.user.middle_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.user.last_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.user.suffix || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(friend?.user.email || '').toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return result;
    }, [taskCollaborators, searchText]);

    const handleClose = () => {
        $(`#view_task_collaborators_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`view_task_collaborators_${id}`}
                size={"xl"}
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
                            isFetching
                                ? <p>Please wait...</p>
                                : <>

                                    {
                                        modalOpenIndex === 1 &&
                                        <ModalViewUser
                                            user={modalOpenData}
                                            callbackFunction={() => {
                                                GetSpecificTaskCollaborators(false);
                                                setModalOpenData(null);
                                                setModalOpenId(null);
                                                setModalOpenIndex(null);
                                            }}
                                        />
                                    }

                                    {
                                        taskCollaborators.length > 0
                                            ? <div className="mb-2">
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
                                                    filteredCollaborators.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((friend: any, index: number) => (
                                                        <div key={index} className="my-2">
                                                            <ProfileParchment user={friend.user} callbackFunction={(e) => GetSpecificTaskCollaborators(e)} nextStringAfterAccountStatus={` • ${friend.status}`} />
                                                        </div>
                                                    ))
                                                }

                                                <TablePaginationTemplate
                                                    dataset={filteredCollaborators}
                                                    rowsPerPage={rowsPerPage}
                                                    rowsPerPageOptions={[12, 24, 36, 50]}
                                                    page={page}
                                                    labelRowsPerPage={"Collaborators per page:"}
                                                    callbackFunction={(e) => {
                                                        setRowsPerPage(e.rows);
                                                        setPage(e.page);
                                                    }}

                                                />
                                            </div> : <p>Task do not have collaborators yet.</p>
                                    }
                                </>
                        }
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>
                    </div>
                }
            />
        </>
    );
}