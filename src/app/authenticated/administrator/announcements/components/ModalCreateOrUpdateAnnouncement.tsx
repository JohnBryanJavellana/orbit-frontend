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

interface ModalCreateOrUpdateAnnouncementProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalCreateOrUpdateAnnouncement({ data, id, titleHeader, httpMethod, callbackFunction }: ModalCreateOrUpdateAnnouncementProps) {
    const [status, setStatus] = useState<string>('');
    const [announcement, setAnnouncement] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();

    const handleClose = () => {
        $(`#create_or_update_announcement_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitAnnnouncement = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('contentText', announcement);
            formData.append('httpMethod', httpMethod);

            if (data) {
                formData.append('documentId', data?.id);
                formData.append('status', status);
            }

            const response = await axios.post(`${urlWithApi}/administrator/announcement/get_announcements/create_or_update_announcement`, formData, {
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
        if (data) {
            setStatus(data.status);
            setAnnouncement(data.content);
        }
    }, [data]);

    return (
        <>
            <ModalTemplate
                id={`create_or_update_announcement_${id}`}
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
                        <label htmlFor="password" className='custom-label-color'>
                            Content <span className="text-danger">*</span>
                        </label>

                        <CustomWYSIWYG
                            value={announcement}
                            onTextChange={(e) => setAnnouncement(e)}
                            placeholder="Enter announcement"
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
                                    <MenuItem disabled={data?.status === 'SHOW'} value="SHOW">SHOW</MenuItem>,
                                    <MenuItem disabled={data?.status === 'HIDE'} value="HIDE">HIDE</MenuItem>
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

                        <button type="button" onClick={() => SubmitAnnnouncement()} disabled={!announcement || isSubmitting} className={`btn btn-danger btn-sm elevation-1`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    );
}