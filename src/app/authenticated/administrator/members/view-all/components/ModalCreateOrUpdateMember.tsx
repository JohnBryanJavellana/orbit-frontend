'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { FormControl, Input, MenuItem, Select } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomWYSIWYG from "@/app/custom-global-components/CustomWYSIWYG/CustomWYSIWYG";
import useGetCurrentUser from "@/app/hooks/useGetCurrentUser";
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

interface ModalCreateOrUpdateMemberProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    httpMethod: 'UPDATE' | 'POST',
    callbackFunction: (e: any) => void
}

export default function ModalCreateOrUpdateMember({ data, id, titleHeader, httpMethod, callbackFunction }: ModalCreateOrUpdateMemberProps) {
    const [fname, setFname] = useState<string>('');
    const [mname, setMname] = useState<string>('');
    const [lname, setLname] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [birthday, setBirthday] = useState<any>(null);
    const [suffix, setSuffix] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData } = useGetCurrentUser();
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const handleClose = () => {
        $(`#create_or_update_member_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitMemberForm = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('first_name', fname);
            formData.append('middle_name', mname);
            formData.append('last_name', lname);
            formData.append('suffix', suffix);
            formData.append('gender', gender);
            formData.append('bio', bio);
            formData.append('birthday', birthday?.format('YYYY-MM-DD'));
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);
            formData.append('httpMethod', httpMethod);

            if (data) {
                formData.append('documentId', data?.id);
            }

            const response = await axios.post(`${urlWithApi}/administrator/members/get_members/create_or_update_member`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#create_or_update_member_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => {
                    if (data?.editor !== 'OMEGA' || data?.reloadAfter) {
                        window.location.reload();
                    } else {
                        handleClose();
                    }
                }
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
                    $(`#create_or_update_member_${id}`).modal('hide');
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (data) {
            setFname(data.first_name);
            setMname(data.middle_name);
            setLname(data.last_name);
            setBio(data.bio);
            setBirthday(dayjs(data.birthday));
            setSuffix(data.suffix ?? '');
            setRole(data.role);
            setGender(data.gender);
            setEmail(data.email);
        }
    }, [data]);

    return (
        <>
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`create_or_update_member_${id}`}
                size={"md"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                bodyClassName="px-4 py-0"
                body={
                    !userData
                        ? <p>Please wait...</p>
                        : <>
                            <label htmlFor="fname" className='custom-label-color'>
                                First name <span className="text-danger">*</span>
                            </label>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Input
                                    id="fname"
                                    type="text"
                                    className='custom-field-bg'
                                    value={fname}
                                    onChange={(e) => setFname(e.target.value)}
                                    disableUnderline
                                    autoComplete='off'
                                />
                            </FormControl>

                            <label htmlFor="mname" className='custom-label-color'>
                                Middle name <span className="text-danger">*</span>
                            </label>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Input
                                    id="mname"
                                    type="text"
                                    className='custom-field-bg'
                                    value={mname}
                                    onChange={(e) => setMname(e.target.value)}
                                    disableUnderline
                                    autoComplete='off'
                                />
                            </FormControl>

                            <label htmlFor="lname" className='custom-label-color'>
                                Last name <span className="text-danger">*</span>
                            </label>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Input
                                    id="lname"
                                    type="text"
                                    className='custom-field-bg'
                                    value={lname}
                                    onChange={(e) => setLname(e.target.value)}
                                    disableUnderline
                                    autoComplete='off'
                                />
                            </FormControl>

                            <label htmlFor="suffix" className='custom-label-color'>
                                Suffix
                            </label>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Select
                                    id="suffix"
                                    value={suffix}
                                    onChange={(e) => setSuffix(e.target.value)}
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
                                        },
                                    }}
                                >
                                    <MenuItem value="">-- None --</MenuItem>
                                    <MenuItem value="SR.">SR.</MenuItem>
                                    <MenuItem value="JR.">JR.</MenuItem>
                                    <MenuItem value="I">I (The First)</MenuItem>
                                    <MenuItem value="II">II (The Second)</MenuItem>
                                    <MenuItem value="III">III (The Third)</MenuItem>
                                    <MenuItem value="IV">IV (The Fourth)</MenuItem>
                                    <MenuItem value="V">V (The Fifth)</MenuItem>
                                </Select>
                            </FormControl>

                            <label htmlFor="gender" className='custom-label-color'>
                                Gender <span className="text-danger">*</span>
                            </label>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
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
                                    <MenuItem value="">-- Please select --</MenuItem>
                                    <MenuItem value="MALE">MALE</MenuItem>
                                    <MenuItem value="FEMALE">FEMALE</MenuItem>
                                </Select>
                            </FormControl>

                            <label htmlFor="birthday" className='custom-label-color mb-0'>
                                Birthday {data?.editor !== 'OMEGA' ? <span className="text-muted">(If wrong, please talk to the Supreme)</span> : <span className="text-danger">*</span>}
                            </label>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    maxDate={dayjs()}
                                    value={birthday}
                                    disabled={data?.editor !== 'OMEGA'}
                                    onChange={(newValue) => setBirthday(newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'standard',
                                            InputProps: {
                                                disableUnderline: true,
                                                className: 'custom-field-bg',
                                                sx: {
                                                    pl: 1.5,
                                                    pr: 1.0,
                                                    py: 1.4,
                                                    borderRadius: '4px'
                                                }
                                            },
                                        },
                                    }}
                                    sx={{
                                        width: '100%',
                                        mt: 1,
                                        '& .MuiInputBase-root': {
                                            height: '60px',
                                        }
                                    }}
                                />
                            </LocalizationProvider>

                            {
                                httpMethod === "POST" &&
                                <>
                                    <label htmlFor="role" className='custom-label-color mt-3'>
                                        Account Role <span className="text-danger">*</span>
                                    </label>

                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Select
                                            id="gender"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
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
                                            <MenuItem value="ADMINISTRATOR">ADMINISTRATOR</MenuItem>
                                            <MenuItem value="MEMBER">MEMBER</MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            }

                            <label htmlFor="email" className='custom-label-color mt-3'>
                                Email <span className="text-danger">*</span>
                            </label>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Input
                                    id="role"
                                    type="email"
                                    className='custom-field-bg'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disableUnderline
                                    autoComplete='off'
                                />
                            </FormControl>

                            {
                                httpMethod === "POST" && <>
                                    <label htmlFor="password" className='custom-label-color'>
                                        Password {httpMethod === 'POST' && <span className="text-danger">*</span>}
                                    </label>

                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Input
                                            id="password"
                                            type="text"
                                            className='custom-field-bg'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disableUnderline
                                            autoComplete='off'
                                        />
                                    </FormControl>
                                </>
                            }

                            <label htmlFor="bio" className='custom-label-color'>
                                Bio <span className="text-danger">*</span>
                            </label>

                            <CustomWYSIWYG
                                value={bio}
                                onTextChange={(e) => setBio(e)}
                                placeholder="Enter member bio"
                                maxLength={300}
                            />
                        </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => SubmitMemberForm()} disabled={
                            !userData ||
                            !fname ||
                            !mname ||
                            !lname ||
                            !email ||
                            !gender ||
                            !birthday ||
                            !bio ||
                            !role ||
                            isSubmitting
                        } className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            {httpMethod === 'POST' ? 'Submit' : 'Save Changes'}
                        </button>
                    </div>
                }
            />
        </>
    );
}