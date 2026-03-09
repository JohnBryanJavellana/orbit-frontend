'use client';
import CustomWYSIWYG from "@/app/custom-global-components/CustomWYSIWYG/CustomWYSIWYG";
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

export default function ModalCreateOrUpdateTask({ data, id, titleHeader, httpMethod, callbackFunction }: ModalCreateOrUpdateTaskProps) {
    const [taskCompletionPoints, setTaskCompletionPoints] = useState<string>('');
    const [taskProgressPoints, setTaskProgressPoints] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();

    const handleClose = () => {
        $(`#task_${id}`).modal('hide');
        callbackFunction(null);
    }

    useEffect(() => {
        if (data && data.trueData) {
            setName(data.name);
            setStatus(data.status);
            setTaskCompletionPoints(data.task_completion_points);
            setTaskProgressPoints(data.task_progress_points);
            setDescription(data.description);
        }
    }, [data]);

    const SubmitTask = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('task_completion_points', taskCompletionPoints);
            formData.append('task_progress_points', taskProgressPoints);
            formData.append('projectCtrl', data.projectCtrl);
            formData.append('httpMethod', httpMethod);

            if (data && data.trueData) {
                formData.append('documentId', data?.id);
                formData.append('status', status);
            }

            const response = await axios.post(`${urlWithApi}/administrator/projects/get_projects/create_or_update_project_task`, formData, {
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

    return (
        <>
            <ModalTemplate
                id={`task_${id}`}
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
                body={
                    <>
                        <label htmlFor="email" className='custom-label-color'>
                            Task Name <span className="text-danger">*</span>
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

                        <label htmlFor="completion_points" className='custom-label-color'>
                            Task Completion Aura Points <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Input
                                id="completion_points"
                                type="number"
                                className='custom-field-bg'
                                value={taskCompletionPoints}
                                onChange={(e) => setTaskCompletionPoints(e.target.value)}
                                disableUnderline
                                autoComplete='off'
                            />
                        </FormControl>

                        <label htmlFor="progress_points" className='custom-label-color'>
                            Task Progress Aura Points <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Input
                                id="progress_points"
                                type="number"
                                className='custom-field-bg'
                                value={taskProgressPoints}
                                onChange={(e) => setTaskProgressPoints(e.target.value)}
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
                            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
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
                                </Select>
                            </FormControl>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => SubmitTask()} disabled={!name || !taskProgressPoints || !taskCompletionPoints || !description || isSubmitting} className={`btn btn-danger btn-sm elevation-1`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    );
}