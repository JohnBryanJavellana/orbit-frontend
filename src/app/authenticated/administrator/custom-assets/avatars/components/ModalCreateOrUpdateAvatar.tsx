'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { FormControl, Input } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import usePhotoToBase64 from "@/app/hooks/usePhotoToBase64";
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

interface ModalCreateOrUpdateAvatarProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalCreateOrUpdateAvatar({ data, id, titleHeader, httpMethod, callbackFunction }: ModalCreateOrUpdateAvatarProps) {
    const [customAvatar, setCustomAvatar] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { GenerateBase64 } = usePhotoToBase64();
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();

    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const handleClose = () => {
        $(`#create_or_update_avatar_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitCustomAvatar = async () => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('avatar', customAvatar);
            formData.append('httpMethod', httpMethod);

            if (data) {
                formData.append('documentId', data?.id);
            }

            const response = await axios.post(`${urlWithApi}/administrator/avatar/avatar/create_or_update_custom_avatar`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#create_or_update_avatar_${id}`).modal('hide');

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
                    $(`#create_or_update_avatar_${id}`).modal('hide');
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`create_or_update_avatar_${id}`}
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
                            {httpMethod === "UPDATE" ? 'Update' : 'Upload'} Avatar Image <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth>
                            <Input
                                id="profile_picture"
                                type="file"
                                className='custom-field-bg'
                                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.files && target.files[0]) {
                                        await GenerateBase64(target.files[0]).then((base64) => setCustomAvatar(String(base64)))
                                    }
                                }}
                                disableUnderline
                                autoComplete='off'
                            />
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

                        <button type="button" onClick={() => SubmitCustomAvatar()} disabled={!customAvatar || isSubmitting} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </div>
                }
            />
        </>
    );
}