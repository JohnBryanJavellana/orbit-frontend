'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { FormControl, Input, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import usePhotoToBase64 from "@/app/hooks/usePhotoToBase64";
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

interface ModalCreateOrUpdateBorderProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalCreateOrUpdateBorder({ data, id, titleHeader, httpMethod, callbackFunction }: ModalCreateOrUpdateBorderProps) {
    const [customBorder, setCustomBorder] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { GenerateBase64 } = usePhotoToBase64();
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const handleClose = () => {
        $(`#create_or_update_border_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitCustomBorder = async () => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('border', customBorder);
            formData.append('type', type);
            formData.append('httpMethod', httpMethod);

            if (data) {
                formData.append('documentId', data?.id);
            }

            const response = await axios.post(`${urlWithApi}/administrator/border/border/create_or_update_custom_border`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#create_or_update_border_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => handleClose()
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#create_or_update_border_${id}`).modal('hide');

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
            setType(data.type);
        }
    }, [data]);

    return (
        <>
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`create_or_update_border_${id}`}
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
                            {httpMethod === "UPDATE" ? 'Update' : 'Upload'} Border Image <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Input
                                id="profile_picture"
                                type="file"
                                className='custom-field-bg'
                                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.files && target.files[0]) {
                                        await GenerateBase64(target.files[0]).then((base64) => setCustomBorder(String(base64)))
                                    }
                                }}
                                disableUnderline
                                autoComplete='off'
                            />
                        </FormControl>

                        <label htmlFor="role" className='custom-label-color'>
                            Type <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth>
                            <Select
                                id="gender"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
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
                                    }
                                }}
                            >
                                <MenuItem value="FREE">FREE</MenuItem>
                                <MenuItem value="RARE">RARE</MenuItem>
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

                        <button type="button" onClick={() => SubmitCustomBorder()} disabled={(httpMethod === "POST" && !customBorder) || !type || isSubmitting} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </div>
                }
            />
        </>
    );
}