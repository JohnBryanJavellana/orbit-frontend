'use client';

import { useEffect, useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormControl, MenuItem, Select } from "@mui/material";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

interface ModalUpdateCollaboratorStatusProps {
    data: any | null,
    type: 'MAIN_PROJECT' | 'MAIN_TASK',
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalUpdateCollaboratorStatus({ data, type, id, titleHeader, httpMethod, callbackFunction }: ModalUpdateCollaboratorStatusProps) {
    const [status, setStatus] = useState<string>('');
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const handleClose = () => {
        $(`#update_collaborator_status_${id}`).modal('hide');
        callbackFunction(null);
    }

    const UpdateCollaboratorStatus = async () => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');

            const apiSrc = type === "MAIN_PROJECT"
                ? `${urlWithApi}/administrator/projects/get_projects/update_project_collaborator_assignment_status`
                : `${urlWithApi}/administrator/projects/get_projects/get_project_tasks/update_task_assignment_status`;

            const tempPayLoad = {
                collaboratorId: data?.id,
                status: status
            };

            const payload = type === "MAIN_PROJECT"
                ? {
                    ...tempPayLoad,
                    projectCtrl: data?.projectCtrl
                } : {
                    ...tempPayLoad,
                    taskCtrl: data?.taskCtrl
                };

            const response = await axios.post(apiSrc, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#update_collaborator_status_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => handleClose()
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#update_collaborator_status_${id}`).modal('hide');

                setCallbackFunction({
                    callbackFunction: () => handleClose()
                });

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
        setStatus(data?.status);
    }, [data]);

    return (
        <>
            <MessageAlertPopup />

            <ModalTemplate
                id={`update_collaborator_status_${id}`}
                size="md"
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
                        <FormControl fullWidth>
                            <Select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className='custom-field-bg custom-border-dark'
                                variant="standard"
                                disableUnderline
                                sx={{
                                    px: 1.5,
                                    py: 1.0,
                                    borderRadius: '4px',
                                    color: 'white',
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                    },
                                }}
                            >
                                {
                                    ['PENDING'].includes(data?.status) && [
                                        <MenuItem disabled value="PENDING">PENDING</MenuItem>,
                                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>,
                                        <MenuItem value="DECLINED">DECLINE</MenuItem>
                                    ]
                                }

                                {
                                    ['ACTIVE', 'TERMINATED'].includes(data?.status) && [
                                        <MenuItem disabled={data?.status === 'ACTIVE'} value="ACTIVE">ACTIVE</MenuItem>,
                                        <MenuItem disabled={data?.status === 'TERMINATED'} value="TERMINATED">TERMINATE</MenuItem>
                                    ]
                                }
                            </Select>
                        </FormControl>
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => UpdateCollaboratorStatus()} disabled={!status} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            Update
                        </button>
                    </div>
                }
            />
        </>
    );
}