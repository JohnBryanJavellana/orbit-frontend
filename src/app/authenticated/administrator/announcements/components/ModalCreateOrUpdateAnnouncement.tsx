'use client';
import CustomWYSIWYG from "@/app/custom-global-components/CustomWYSIWYG/CustomWYSIWYG";
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { FormControl, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

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
    const [removalDate, setRemovalDate] = useState<any>(null);
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const handleClose = () => {
        $(`#create_or_update_announcement_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitAnnnouncement = async () => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('contentText', announcement);
            formData.append('removalDate', removalDate ? removalDate.format('YYYY-MM-DD HH:mm:ss') : null);
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

            $(`#create_or_update_announcement_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => handleClose()
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#create_or_update_announcement_${id}`).modal('hide');

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
        if (data) {
            setStatus(data.status);
            setAnnouncement(data.content);
            setRemovalDate(data.removal_date ? dayjs(data.removal_date) : null);
        }
    }, [data]);

    return (
        <>
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`create_or_update_announcement_${id}`}
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
                        <label htmlFor="password" className='custom-label-color'>
                            Content <span className="text-danger">*</span>
                        </label>

                        <CustomWYSIWYG
                            value={announcement}
                            onTextChange={(e) => setAnnouncement(e)}
                            placeholder="Enter announcement"
                        />

                        <label htmlFor="remove_date" className='custom-label-color mb-0 mt-3'>
                            Auto Remove Date
                        </label>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                minDate={removalDate || dayjs()}
                                value={removalDate}
                                onChange={(newValue: any) => setRemovalDate(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: 'standard',
                                        InputProps: {
                                            disableUnderline: true,
                                            className: 'custom-field-bg',
                                            sx: {
                                                pl: 1.5,
                                                pr: 1.0,
                                                py: 1.4,
                                                borderRadius: '4px'
                                            }
                                        },
                                    },
                                }}
                                sx={{
                                    width: '100%',
                                    mt: 1,
                                    '& .MuiInputBase-root': {
                                        height: '60px',
                                    }
                                }}
                            />
                        </LocalizationProvider>

                        {
                            httpMethod === "UPDATE" && <>
                                <label htmlFor="remove_date" className='custom-label-color mb-0 mt-3'>
                                    Status
                                </label>
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
                                        <MenuItem disabled={data?.status === 'SHOW'} value="SHOW">SHOW</MenuItem>,
                                        <MenuItem disabled={data?.status === 'HIDE'} value="HIDE">HIDE</MenuItem>
                                    </Select>
                                </FormControl>
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

                        <button type="button" onClick={() => SubmitAnnnouncement()} disabled={!announcement || isSubmitting} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </div>
                }
            />
        </>
    );
}