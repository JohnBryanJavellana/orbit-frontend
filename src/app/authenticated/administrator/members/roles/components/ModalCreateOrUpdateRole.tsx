'use client';
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
            <ModalTemplate
                id={`create_or_update_role_${id}`}
                size={"md"}
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
                            Role <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
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
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => SubmitTask()} disabled={!role || isSubmitting} className={`btn btn-danger btn-sm elevation-1`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    );
}