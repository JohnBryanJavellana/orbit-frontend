'use client';
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { FormControl, Input } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ModalCreateOrUpdateRoleProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalCreateOrUpdateRole({ data, id, titleHeader, httpMethod, callbackFunction }: ModalCreateOrUpdateRoleProps) {
    const [role, setRole] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();

    const handleClose = () => {
        $(`#create_or_update_role_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitTask = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('role', role);
            formData.append('httpMethod', httpMethod);

            if (data) {
                formData.append('documentId', data?.id);
            }

            const response = await axios.post(`${urlWithApi}/administrator/members/get_member_roles/create_or_update_member_role`, formData, {
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
            setRole(data.role);
        }
    }, [data]);

    return (
        <>
            {isSubmitting && <LoadingPopup />}

            <ModalTemplate
                id={`create_or_update_role_${id}`}
                size={"md"}
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
                            Role <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth>
                            <Input
                                id="role"
                                type="text"
                                className='custom-field-bg'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
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

                        <button type="button" onClick={() => SubmitTask()} disabled={!role || isSubmitting} className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </div>
                }
            />
        </>
    );
}