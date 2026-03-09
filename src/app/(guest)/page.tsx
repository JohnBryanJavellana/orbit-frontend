'use client';

import { FormControl, Input } from '@mui/material';
import { useState } from 'react';
import usePasswordEndadornment from '../hooks/usePasswordEndadornment';
import Link from 'next/link';
import axios from 'axios';
import useWebToken from '../hooks/useWebToken';
import useSystemURLCon from '../hooks/useSystemURLCon';
import Custombtn from '../custom-global-components/Custombtn';

interface Props { }

export default function Login({ }: Props) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { EndAdornment, inputType } = usePasswordEndadornment();
    const { setToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();

    const LoginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('email', String(email).toLocaleLowerCase());
            formData.append('password', password);

            const response = await axios.post(`${urlWithApi}/login`, formData);

            setToken('csrf-token', response.data.token);
            setToken('role-access', response.data.role);

            const role = String(response.data.role === 'MEMBER' ? 'MEMBER' : 'ADMINISTRATOR').toLowerCase();
            window.location.replace(`/authenticated/${role}/profile`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return <>
        <div className="row d-flex align-items-center justify-content-center">
            <div className="col-xl-5">
                <div className="card text-dark rounded-0 shadow custom-bg custom-border-dark">
                    <div className="card-body px-4 pb-4 text--fontPos13--xW8hS">
                        <div className="row">
                            <div className="col-12 text-white">
                                <form onSubmit={LoginUser}>
                                    <div className="text-center mx-auto mb-4">
                                        <img src="/system-images/f2eb6a1d-e5d2-45b5-8c5c-3458f944e97c.png" className='mb-4' height={70} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                            <div className='text-bold h3 mb-0'>ORBIT</div>
                                            <div className='text-muted h6 mb-0'>Sign in to your account</div>
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

                                    <label htmlFor="password" className='custom-label-color'>
                                        Password <span className="text-danger">*</span>
                                    </label>

                                    <FormControl fullWidth sx={{ mb: 1 }}>
                                        <Input
                                            id="password"
                                            className='custom-field-bg'
                                            type={inputType}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            endAdornment={<EndAdornment />}
                                            disableUnderline
                                        />
                                    </FormControl>

                                    <div className='mt-2'>
                                        <Link href="/forgot-password" className="text-light">
                                            Forgot Password? <span className="text-bold"><u>Click here</u></span>
                                        </Link>
                                    </div>

                                    <div className="mt-3">
                                        <button type="submit" disabled={!email || !password || isSubmitting} className="rpg-button w-100">
                                            {isSubmitting ? 'PLEASE WAIT..' : 'LOG IN'}
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