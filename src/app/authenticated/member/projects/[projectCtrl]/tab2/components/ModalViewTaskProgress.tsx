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
import CustomWYSIWYG from "@/app/custom-global-components/CustomWYSIWYG/CustomWYSIWYG";

interface ModalViewTaskProgressProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalViewTaskProgress({ data, id, titleHeader, httpMethod, callbackFunction }: ModalViewTaskProgressProps) {
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [taskProgress, setProjectTaskProgress] = useState<any | null>([]);
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const isMobileViewPort = useDetectMobileViewport();
    const { getRankAttribute } = useGetRankAttribute();

    const [progress, setProgress] = useState<string>('');

    const GetSpecificTaskProgress = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/member/projects/get_assigned_projects/get_task_progresses`, {
                taskCtrl: data?.taskCtrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjectTaskProgress(response.data.progress);
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

    const SubmitTaskProgress = async () => {
        const ask = window.confirm("Are you sure you want to submit your task progress?");
        if (!ask) return;

        try {
            setIsSubmitting(true);
            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/member/projects/get_assigned_projects/submit_progress`, {
                taskCtrl: data?.taskCtrl,
                activity: progress
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    alert(error.response?.data.message);
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setProgress('');
            setIsSubmitting(false);
            GetSpecificTaskProgress(false);
        }
    }

    useEffect(() => {
        if (data) {
            GetSpecificTaskProgress(true);
            return () => { };
        }
    }, [data]);

    const filteredProgress = useMemo(() => {
        let result = Array.isArray(taskProgress) ? taskProgress : [];

        if (searchText.trim()) {
            result = result.filter(task =>
                String(task?.initiator.user.first_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(task?.initiator.user.middle_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(task?.initiator.user.last_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(task?.initiator.user.suffix || '').toLowerCase().includes(searchText.toLowerCase()) ||
                String(task?.activity || '').toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return result;
    }, [taskProgress, searchText]);

    const handleClose = () => {
        $(`#view_task_progress_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`view_task_progress_${id}`}
                size={"lg"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                bodyClassName="px-4 text-sm"
                body={
                    <>
                        {
                            isFetching
                                ? <p>Please wait...</p>
                                : <>
                                    <div className="bg-dark p-3 mb-2 elevation-1">
                                        <label htmlFor="bio" className='custom-label-color'>
                                            Progress <span className="text-danger">*</span>
                                        </label>

                                        <CustomWYSIWYG
                                            value={progress}
                                            onTextChange={(e) => setProgress(e)}
                                            placeholder="Enter your task progress"
                                        />

                                        <button className="btn btn-danger custom-bg-maroon elevation-1 text-white custom-border-dark mt-2 btn-block" onClick={() => SubmitTaskProgress()} disabled={!progress || isSubmitting}>Submit</button>
                                    </div>

                                    <div className="bg-dark p-3 elevation-1">
                                        {
                                            taskProgress.length > 0
                                                ? <div className="mb-2">
                                                    <h6>Team Progress</h6>

                                                    <FormControl fullWidth sx={{ my: 1 }}>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            className='custom-field-bg'
                                                            value={searchText}
                                                            onChange={(e) => setSearchText(e.target.value)}
                                                            disableUnderline
                                                            size="small"
                                                            autoComplete='off'
                                                            placeholder='Search progress...'
                                                        />
                                                    </FormControl>

                                                    {
                                                        filteredProgress.slice((page * rowsPerPage), ((page * rowsPerPage) + rowsPerPage)).map((progress: any, index: number) => (
                                                            <div key={index} className="row px-2 my-2">
                                                                <div className="col-xl-12 custom-border-dark">
                                                                    <div className="row p-3">
                                                                        <div className={`col-2 d-flex align-items-center justify-content-center text-center`}>
                                                                            <CustomAvatarWithOnlineBadge height={50} width={50} src={`${urlWithoutApi}/user-images/${progress.initiator.user.profile_picture}`} isOnline={progress.initiator.user.is_online} isAdmin={progress.initiator.user.role === "SUPERADMIN"} />
                                                                        </div>

                                                                        <div className="col-10">
                                                                            <div className="text-bold">{`${progress.initiator.user.first_name} ${progress.initiator.user.middle_name} ${progress.initiator.user.last_name} ${progress.initiator.user.suffix ?? ''}`}</div>
                                                                            <div dangerouslySetInnerHTML={{ __html: progress.activity }} />
                                                                            <div className="mt-1 text-muted">{FormatDatetimeToHumanReadable(progress.created_at, true)} • {progress.status}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                    <TablePaginationTemplate
                                                        dataset={filteredProgress}
                                                        rowsPerPage={rowsPerPage}
                                                        rowsPerPageOptions={[12, 24, 36, 50]}
                                                        page={page}
                                                        labelRowsPerPage={"Progress per page:"}
                                                        callbackFunction={(e) => {
                                                            setRowsPerPage(e.rows);
                                                            setPage(e.page);
                                                        }}

                                                    />
                                                </div> : <p>Task do not have progress yet.</p>
                                        }
                                    </div>
                                </>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>
                    </>
                }
            />
        </>
    );
}