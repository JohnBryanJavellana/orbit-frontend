'use client';

import { FormControl, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingPopup from '@/app/custom-global-components/LoadingPopup/LoadingPopup';
import axios from 'axios';
import useSystemURLCon from '@/app/hooks/useSystemURLCon';
import ReactPasswordChecklist from 'react-password-checklist';
import usePasswordEndadornment from '@/app/hooks/usePasswordEndadornment';
import useMessageAlertPopup from '@/app/hooks/useMessageAlertPopup';

interface PageProps { }

export default function ResetPassword({ }: PageProps) {
    const [email, setEmail] = useState<string>("");
    const navigate = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { urlWithApi } = useSystemURLCon();
    const [password, setPassword] = useState<string>("");
    const [confirm_password, setConfirmPassword] = useState<string>("");
    const searchParams = useSearchParams();
    const [isPasswordRuleValid, setIsPasswordRuleValid] = useState<boolean>(false);
    const { EndAdornment, inputType } = usePasswordEndadornment();
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    useEffect(() => {
        setEmail(String(searchParams.get('email')));
    }, [searchParams]);

    const ResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const formData = new FormData();
            formData.append('token', String(searchParams.get('token')));
            formData.append('email', email);
            formData.append('password', password);
            formData.append('password_confirmation', confirm_password);

            const response = await axios.post(`${urlWithApi}/reset-password`, formData);

            setCallbackFunction({
                callbackFunction: () => {
                    navigate.push('/');
                }
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessageAlert({
                    message: error.response?.data.message,
                    status: 'ERROR'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return <>
        {isSubmitting && <LoadingPopup />}
        <MessageAlertPopup />

        <div className="row d-flex align-items-center justify-content-center">
            <div className="col-xl-5">
                <div className="card text-dark rounded-0 shadow custom-bg custom-border-dark">
                    <div className="card-body px-4 pb-4 text--fontPos13--xW8hS">
                        <div className="row">
                            <div className="col-12 text-white">
                                <form onSubmit={ResetPassword}>
                                    <div className="text-center mx-auto mb-4">
                                        <img src="/system-images/f2eb6a1d-e5d2-45b5-8c5c-3458f944e97c.png" className='mb-4' height={70} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                            <div className='text-bold h3 mb-0'>ORBIT</div>
                                            <div className='text-muted h6 mb-0'>
                                                <div className="text-muted mt-2">
                                                    <div>Enter a new password to reset your account. </div>
                                                    <div>You'll use this password to log in.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <label htmlFor="email" className='custom-label-color'>
                                        Email <span className="text-danger">*</span>
                                    </label>

                                    <FormControl fullWidth>
                                        <Input
                                            id="email"
                                            type="email"
                                            className='custom-field-bg'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disableUnderline
                                            autoComplete='off'
                                            placeholder='someone@example.com'
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

                                    <div className="mt-3">
                                        <button type="submit" disabled={!email || !password || !confirm_password || !isPasswordRuleValid || isSubmitting} className="rpg-button w-100">
                                            {isSubmitting ? 'PLEASE WAIT..' : 'RESET PASSWORD'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>;
}