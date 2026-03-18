'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPopup from "../LoadingPopup/LoadingPopup";
import ReactPasswordChecklist from "react-password-checklist";
import { FormControl, Input } from "@mui/material";
import usePasswordEndadornment from "@/app/hooks/usePasswordEndadornment";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

interface ModalChangePasswordProps {
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: boolean) => void
}

export default function ModalChangePassword({ id, titleHeader, callbackFunction }: ModalChangePasswordProps) {
    const { getToken, removeToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirm_password, setConfirmPassword] = useState<string>("");
    const [isPasswordRuleValid, setIsPasswordRuleValid] = useState<boolean>(false);
    const { EndAdornment, inputType } = usePasswordEndadornment();
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const handleClose = () => {
        $(`#change_password_${id}`).modal('hide');
        callbackFunction(false);
    }

    const ChangePassword = async () => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('current_password', currentPassword);
            formData.append('password', password);
            formData.append('password_confirmation', confirm_password);

            const response = await axios.post(`${urlWithApi}/administrator/account/account/update_password`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#change_password_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => callbackFunction(true)
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                } else {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
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
                id={`change_password_${id}`}
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
                        <label htmlFor="current-password" className='custom-label-color'>
                            Enter Current Password <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth>
                            <Input
                                id="current-password"
                                type={inputType}
                                className='custom-field-bg'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disableUnderline
                                autoComplete='off'
                                endAdornment={<EndAdornment />}
                            />
                        </FormControl>

                        <ReactPasswordChecklist
                            rules={["minLength", "specialChar", "number", "capital", "match"]}
                            minLength={6}
                            valueAgain={confirm_password}
                            value={password}
                            iconSize={10}
                            onChange={(isValid: boolean) => {
                                setIsPasswordRuleValid(isValid);
                            }}
                            className="alert alert-dark custom-border-dark bg-dark px-3 rounded-0 elevation-1 mb-0 my-2 mb-3 text-sm p-2"
                        />

                        <label htmlFor="new-password" className='custom-label-color'>
                            New Password <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 1 }}>
                            <Input
                                id="new-password"
                                type={inputType}
                                className='custom-field-bg'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disableUnderline
                                autoComplete='off'
                                endAdornment={<EndAdornment />}
                            />
                        </FormControl>

                        <label htmlFor="confirm-password" className='custom-label-color'>
                            Confirm Password <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 1 }}>
                            <Input
                                id="confirm-password"
                                type={inputType}
                                className='custom-field-bg'
                                value={confirm_password}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disableUnderline
                                endAdornment={<EndAdornment />}
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

                        <button type='button' className='btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white' disabled={isSubmitting || !password || !confirm_password || !isPasswordRuleValid} onClick={() => ChangePassword()}>
                            Save Changes
                        </button>
                    </div>
                }
            />
        </>
    );
}