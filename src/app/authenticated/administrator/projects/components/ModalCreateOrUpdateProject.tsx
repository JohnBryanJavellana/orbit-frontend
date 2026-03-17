'use client';
import CustomWYSIWYG from "@/app/custom-global-components/CustomWYSIWYG/CustomWYSIWYG";
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { FormControl, Input, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ModalCreateOrUpdateTaskProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalCreateOrUpdateProject({ data, id, titleHeader, httpMethod, callbackFunction }: ModalCreateOrUpdateTaskProps) {
    const [status, setStatus] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [completionPoints, setCompletionPoints] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();

    const handleClose = () => {
        $(`#create_or_update_project_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitTask = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('completionPoints', completionPoints);
            formData.append('httpMethod', httpMethod);

            if (data) {
                formData.append('documentId', data?.id);
                formData.append('status', status);
            }

            const response = await axios.post(`${urlWithApi}/administrator/projects/create_or_update_project`, formData, {
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
        if (data && data.trueData) {
            setStatus(data.status);
            setName(data.name);
            setCompletionPoints(data.completion_points);
            setDescription(data.description);
        }
    }, [data]);

    return (
        <>
            {isSubmitting && <LoadingPopup />}

            <ModalTemplate
                id={`create_or_update_project_${id}`}
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
                        <label htmlFor="email" className='custom-label-color'>
                            Project Name <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Input
                                id="email"
                                type="email"
                                className='custom-field-bg'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disableUnderline
                                autoComplete='off'
                            />
                        </FormControl>

                        <label htmlFor="number" className='custom-label-color'>
                            Completion Points <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Input
                                id="number"
                                type="number"
                                className='custom-field-bg'
                                value={completionPoints}
                                onChange={(e) => setCompletionPoints(e.target.value)}
                                disableUnderline
                                autoComplete='off'
                            />
                        </FormControl>

                        <label htmlFor="password" className='custom-label-color'>
                            Description <span className="text-danger">*</span>
                        </label>

                        <CustomWYSIWYG
                            value={description}
                            onTextChange={(e) => setDescription(e)}
                            placeholder="Enter task description"
                        />

                        {
                            httpMethod === "UPDATE" &&
                            <FormControl fullWidth margin="dense">
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
                                    <MenuItem disabled value="IN PROGRESS">IN PROGRESS</MenuItem>,
                                    <MenuItem value="OPEN">OPEN</MenuItem>,
                                    <MenuItem value="CLOSED">CLOSE</MenuItem>,
                                    <MenuItem value="COMPLETED">COMPLETE</MenuItem>
                                    <MenuItem value="ABANDONED">ABANDON</MenuItem>
                                </Select>
                            </FormControl>
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

                        <button type="button" onClick={() => SubmitTask()} disabled={!name || !description || !completionPoints || isSubmitting} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </div>
                }
            />
        </>
    );
}