'use client';
import CustomWYSIWYG from "@/app/custom-global-components/CustomWYSIWYG/CustomWYSIWYG";
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { Divider, FormControl, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ModalUpdateProgressProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalUpdateProgress({ data, id, titleHeader, httpMethod, callbackFunction }: ModalUpdateProgressProps) {
    const [remarks, setRemarks] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const UpdateProgressStatus = async () => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects/get_project_tasks/update_task_progress`, {
                progressId: data?.id,
                remarks: remarks,
                status: status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#update_progress_status_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => handleClose()
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
                } else {
                    $(`#update_progress_status_${id}`).modal('hide');
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        setRemarks(data?.remarks);
        setStatus(data?.status);
    }, [data]);

    const handleClose = () => {
        $(`#update_progress_status_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`update_progress_status_${id}`}
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
                bodyClassName="px-4 text-sm"
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
                                        <MenuItem value="VERIFIED">SET AS VERIFIED</MenuItem>,
                                        <MenuItem value="DECLINED">DECLINE</MenuItem>,
                                        <MenuItem value="VERIFYING">VERIFYING</MenuItem>,
                                        <MenuItem value="NOT WORKING PROPERLY">NOT WORKING PROPERLY</MenuItem>
                                    ]
                                }

                                {
                                    ['NOT WORKING PROPERLY', 'VERIFYING'].includes(data?.status) && [
                                        <MenuItem disabled={data?.status === 'NOT WORKING PROPERLY'} value="NOT WORKING PROPERLY">NOT WORKING PROPERLY</MenuItem>,
                                        <MenuItem disabled={data?.status === 'VERIFIED'} value="VERIFIED">SET AS VERIFIED</MenuItem>,
                                        <MenuItem value="DECLINED">DECLINE</MenuItem>
                                    ]
                                }
                            </Select>
                        </FormControl>

                        {
                            status === 'DECLINED' &&
                            <>
                                <label htmlFor="password" className='custom-label-color'>
                                    Description <span className="text-danger">*</span>
                                </label>

                                <CustomWYSIWYG
                                    value={remarks}
                                    onTextChange={(e) => setRemarks(e)}
                                    placeholder="Enter decline remarks"
                                />
                            </>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => UpdateProgressStatus()} disabled={!status || (status === 'DECLINED' && !remarks)} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            Update
                        </button>
                    </>
                }
            />
        </>
    );
}