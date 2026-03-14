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

interface ModalSubmitTodaysDocumentationProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalSubmitTodaysDocumentation({ data, id, titleHeader, httpMethod, callbackFunction }: ModalSubmitTodaysDocumentationProps) {
    const [photoDocumentation, setphotoDocumentation] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { GenerateBase64 } = usePhotoToBase64();
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();

    const handleClose = () => {
        $(`#submit_today_documentation_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitDocumentation = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('documentation', photoDocumentation);
            formData.append('taskCtrl', data?.taskCtrl);

            const response = await axios.post(`${urlWithApi}/administrator/photo-documentation/photo-documentation/submit_photo_documentation`, formData, {
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
                id={`submit_today_documentation_${id}`}
                size={"md"}
                modalParentStyle={data?.useBgStack && 'bg-stack'}
                isModalCentered
                isModalScrollable={false}
                modalContentClassName="text-white"
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
                            Attach Today's Photo Documentation <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth>
                            <Input
                                id="profile_picture"
                                type="file"
                                className='custom-field-bg'
                                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.files && target.files[0]) {
                                        await GenerateBase64(target.files[0]).then((base64) => setphotoDocumentation(String(base64)))
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
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => SubmitDocumentation()} disabled={!photoDocumentation || isSubmitting} className={`btn btn-danger btn-sm elevation-1`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </div>
                }
            />
        </>
    );
}