'use client';

import { FormControl, IconButton, Input, Tooltip } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import LoadingPopup from '@/app/custom-global-components/LoadingPopup/LoadingPopup';
import axios from 'axios';
import useSystemURLCon from '@/app/hooks/useSystemURLCon';
import useMessageAlertPopup from '@/app/hooks/useMessageAlertPopup';

interface PageProps { }

export default function ForgotPassword({ }: PageProps) {
    const [email, setEmail] = useState<string>("");
    const navigate = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { urlWithApi } = useSystemURLCon();

    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const SubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const formData = new FormData();
            formData.append('email', String(email).toLocaleLowerCase());

            const response = await axios.post(`${urlWithApi}/forgot-password`, formData);

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
                            <Tooltip title="Return to homepage">
                                <IconButton onClick={() => navigate.push('/')}>
                                    <ArrowBackIcon color='inherit' />
                                </IconButton>
                            </Tooltip>

                            <div className="col-12 text-white">
                                <form onSubmit={SubmitEmail}>
                                    <div className="text-center mx-auto mb-4">
                                        <img src="/system-images/f2eb6a1d-e5d2-45b5-8c5c-3458f944e97c.png" className='mb-4' height={70} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                            <div className='text-bold h3 mb-0'>ORBIT</div>
                                            <div className='text-muted h6 mb-0'>Enter the email address associated with your account and we'll send you a link to reset your password.</div>
                                        </div>
                                    </div>

                                    <label htmlFor="email" className='custom-label-color'>
                                        Email <span className="text-danger">*</span>
                                    </label>

                                    <FormControl fullWidth sx={{ mb: 1 }}>
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

                                    <div className="mt-3">
                                        <button type="submit" disabled={!email || isSubmitting} className="rpg-button w-100">
                                            {isSubmitting ? 'PLEASE WAIT..' : 'SUBMIT EMAIL'}
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