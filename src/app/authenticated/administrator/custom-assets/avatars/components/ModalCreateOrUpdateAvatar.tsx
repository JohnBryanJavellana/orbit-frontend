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

    const handleClose = () => {
        $(`#create_or_update_avatar_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitCustomAvatar = async () => {
        try {
            setIsSubmitting(true);

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
                id={`create_or_update_avatar_${id}`}
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
                            {httpMethod === "UPDATE" ? 'Update' : 'Upload'} Avatar Image <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
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
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => SubmitCustomAvatar()} disabled={!customAvatar || isSubmitting} className={`btn btn-danger btn-sm elevation-1`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    );
}