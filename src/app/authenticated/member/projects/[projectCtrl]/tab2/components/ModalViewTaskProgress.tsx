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
import { useEffect, useMemo, useRef, useState } from "react";
import CustomWYSIWYG from "@/app/custom-global-components/CustomWYSIWYG/CustomWYSIWYG";
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
import usePhotoToBase64 from "@/app/hooks/usePhotoToBase64";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";
import PreloadImage from "@/app/custom-global-components/PreloadImage/PreloadImage";

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
    const [searchText, setSearchText] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const [progress, setProgress] = useState<string>('');
    const { GenerateBase64 } = usePhotoToBase64();
    const [progressAttachments, setProgressAttachments] = useState<string[] | null>([]);
    const fileRef = useRef<any>(null);
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

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
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const formData = new FormData();

            formData.append('taskCtrl', data?.taskCtrl);
            formData.append('activity', progress);

            progressAttachments?.forEach(r => formData.append('attachments[]', r));

            const response = await axios.post(`${urlWithApi}/member/projects/get_assigned_projects/submit_progress`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCallbackFunction({
                callbackFunction: () => {
                    setProgress('');
                    setProgressAttachments([]);
                    setIsSubmitting(false);
                    GetSpecificTaskProgress(false);
                }
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#view_task_progress_${id}`).modal('hide');

                if (error.response?.status !== 500) {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsSubmitting(false);
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
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`view_task_progress_${id}`}
                size={"lg"}
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
                                    <div className="bg-dark p-3 mb-2 elevation-1">
                                        <label htmlFor="bio" className='custom-label-color d-flex justify-content-between'>
                                            <span>Progress <span className="text-danger">*</span></span>
                                            <small className="text-muted">{progressAttachments?.length || 0} / 5 Attachments</small>
                                        </label>

                                        <CustomWYSIWYG
                                            value={progress}
                                            onTextChange={(e) => setProgress(e)}
                                            placeholder="Enter your task progress"
                                        />

                                        <div className="text-sm mt-3 mb-2">Attachment <span className="text-muted">(optional)</span></div>
                                        <div className="d-flex flex-wrap gap-2">
                                            {progressAttachments?.map((src, index) => {
                                                const isImage = src.startsWith('data:image/');

                                                return (
                                                    <div key={index} className="position-relative mr-1 mb-1 elevation-2 custom-border-dark rounded overflow-hidden" style={{ width: '80px', height: '80px', background: '#2a2a2a' }}>
                                                        {isImage ? (
                                                            <img src={src} alt="attachment" className="w-100 h-100 object-fit-cover" />
                                                        ) : (
                                                            <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                                                                <i className="fas fa-file-alt text-info mb-1"></i>
                                                                <small style={{ fontSize: '8px' }} className="text-white">DOCUMENT</small>
                                                            </div>
                                                        )}
                                                        <button
                                                            className="btn btn-sm btn-danger position-absolute p-0 d-flex align-items-center justify-content-center"
                                                            style={{ top: '2px', right: '2px', width: '18px', height: '18px', fontSize: '10px', borderRadius: '50%' }}
                                                            onClick={() => setProgressAttachments(prev => prev?.filter((_, i) => i !== index) || [])}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                );
                                            })}

                                            {(progressAttachments?.length || 0) < 5 && (
                                                <div
                                                    className={`d-flex align-items-center justify-content-center custom-border-dark rounded cursor-pointer hover-opacity-75`}
                                                    style={{ width: '80px', height: '80px', background: '#1a1a1a', borderStyle: 'dashed', cursor: 'pointer' }}
                                                    onClick={() => fileRef.current?.click()}
                                                >
                                                    <i className="fas fa-plus text-muted"></i>
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                            ref={fileRef}
                                            onChange={async (e) => {
                                                const target = e.target as HTMLInputElement;
                                                if (target.files && target.files[0]) {
                                                    if ((progressAttachments?.length || 0) >= 5) return;

                                                    if (target.files[0].size > 10 * 1024 * 1024) {
                                                        alert("File is too large. Max limit is 10MB.");
                                                        return;
                                                    }

                                                    await GenerateBase64(target.files[0]).then((base64: any) => {
                                                        setProgressAttachments((prev: string[] | null) => {
                                                            const currentImages = prev || [];
                                                            return [...currentImages, base64];
                                                        });
                                                    });
                                                    target.value = '';
                                                }
                                            }}
                                        />

                                        <button
                                            className="btn btn-danger custom-bg-maroon elevation-1 text-white custom-border-dark mt-3 btn-block"
                                            onClick={() => SubmitTaskProgress()}
                                            disabled={!progress || isSubmitting}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Submit Progress'}
                                        </button>
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
                                                                            <CustomAvatarWithOnlineBadge height={50} width={50} data={progress.initiator.user} src={`${urlWithoutApi}/user-images/${progress.initiator.user.profile_picture}`} isOnline={progress.initiator.user.is_online} isAdmin={progress.initiator.user.role === "SUPERADMIN"} srcShown={progress.initiator.user.custom_avatar.shown_avatar} />
                                                                        </div>

                                                                        <div className="col-10">
                                                                            <div className="text-bold">{`${progress.initiator.user.first_name} ${progress.initiator.user.middle_name} ${progress.initiator.user.last_name} ${progress.initiator.user.suffix ?? ''}`}</div>
                                                                            <div className="text-sm" dangerouslySetInnerHTML={{ __html: progress.activity }} />

                                                                            {progress.progress_attachments.length > 0 && (
                                                                                <div className="d-flex flex-wrap gap-2 mb-2">
                                                                                    {progress.progress_attachments?.map((attachment: any, index: number) => {
                                                                                        const isImage = /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(attachment.filename);
                                                                                        const fileUrl = `${urlWithoutApi}/progress-attachments/${attachment.filename}`;

                                                                                        return (
                                                                                            <a
                                                                                                href={fileUrl}
                                                                                                target="_blank"
                                                                                                rel="noreferrer"
                                                                                                key={index}
                                                                                                className="position-relative mr-1 mb-1 elevation-2 custom-border-dark rounded overflow-hidden d-flex align-items-center justify-content-center"
                                                                                                style={{ width: '80px', height: '80px', background: '#2a2a2a' }}
                                                                                            >
                                                                                                {isImage ? (
                                                                                                    <PreloadImage
                                                                                                        src={fileUrl}
                                                                                                        height={'100%'}
                                                                                                        width={'100%'}
                                                                                                        isRounded={false}
                                                                                                        classNames="w-100 h-100 object-fit-cover"
                                                                                                    />
                                                                                                ) : (
                                                                                                    <div className="text-center">
                                                                                                        <i className="fas fa-file-alt text-info fa-2x"></i>
                                                                                                        <div style={{ fontSize: '9px', marginTop: '2px' }} className="text-white">
                                                                                                            {attachment.filename.split('.').pop()?.toUpperCase()}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </a>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            )}

                                                                            <div className="mt-1 text-muted text-sm">{FormatDatetimeToHumanReadable(progress.created_at, true)} • {progress.status}</div>

                                                                            {
                                                                                progress.remarks &&
                                                                                <>
                                                                                    <div className="d-flex align-items-center">
                                                                                        <img src="/system-images/15d4793a-150f-47e0-9a61-b8d0557d7ae5_removalai_preview.png" height={'20px'} alt="" />
                                                                                        <div className="ml-2 pt-4" dangerouslySetInnerHTML={{ __html: progress.remarks }} />
                                                                                    </div>
                                                                                </>
                                                                            }
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
                                                </div> : <div className="d-flex align-items-center text-sm justify-content-center px-4 pt-4 pb-3 text-muted">
                                                    Task do not have progress yet. Submit now!
                                                </div>
                                        }
                                    </div>
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