'use client';

import { useEffect, useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormControl, MenuItem, Select } from "@mui/material";

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

    const handleClose = () => {
        $(`#update_collaborator_status_${id}`).modal('hide');
        callbackFunction(null);
    }

    const UpdateCollaboratorStatus = async () => {
        try {
            setIsSubmitting(true);
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
            setIsSubmitting(false);
            handleClose();
        }
    }

    useEffect(() => {
        setStatus(data?.status);
    }, [data]);

    return (
        <>
            <ModalTemplate
                id={`update_collaborator_status_${id}`}
                size="md"
                isModalScrollable={false}
                modalContentClassName="text-white"
                bodyClassName="pb-2"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                body={
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
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
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => UpdateCollaboratorStatus()} disabled={!status} className={`btn btn-danger btn-sm elevation-1`}>
                            Update
                        </button>
                    </>
                }
            />
        </>
    );
}