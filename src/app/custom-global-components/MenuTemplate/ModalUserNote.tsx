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
import { Box, FormControl, FormHelperText, Input } from "@mui/material";
import usePasswordEndadornment from "@/app/hooks/usePasswordEndadornment";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

interface UserNoteProps {
    note: string
}

interface ModalUserNoteProps {
    data: UserNoteProps | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: boolean) => void
}

export default function ModalUserNote({ data, id, titleHeader, callbackFunction }: ModalUserNoteProps) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [note, setNote] = useState<string>("");
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();
    const MAX_CHARS = 20;

    const handleClose = () => {
        $(`#user_note_${id}`).modal('hide');
        callbackFunction(false);
    }

    const UpdateUserNote = async () => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('note', note);

            const response = await axios.post(`${urlWithApi}/administrator/account/account/create_note`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#user_note_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => callbackFunction(true)
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#user_note_${id}`).modal('hide');

                setCallbackFunction({
                    callbackFunction: () => handleClose()
                });

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

    useEffect(() => {
        if (data) {
            setNote(data?.note);
        }
    }, [data]);

    return (
        <>
            {isSubmitting && <LoadingPopup />}
            <MessageAlertPopup />

            <ModalTemplate
                id={`user_note_${id}`}
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
                        <label htmlFor="note" className='custom-label-color'>
                            Note <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth>
                            <Input
                                id="note"
                                type='text'
                                className='custom-field-bg'
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                disableUnderline
                                autoComplete='off'
                                inputProps={{ maxLength: MAX_CHARS }}
                                placeholder="Share a thought..."
                            />
                        </FormControl>

                        <FormHelperText sx={{ textAlign: 'right', marginRight: '8px' }}>
                            <Box component="span" sx={{ color: note.length >= MAX_CHARS ? 'error.main' : 'text.secondary' }}>
                                {note.length} / {MAX_CHARS}
                            </Box>
                        </FormHelperText>

                        <div className="d-flex flex-column" style={{ height: 30 }}>
                            <div></div>
                            <div className="mt-auto small text-muted">Your note stays up for 24 hours. We won't notify anyone when you post.</div>
                        </div>
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type='button' className='btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white' disabled={isSubmitting || !note} onClick={() => UpdateUserNote()}>
                            Save Note
                        </button>
                    </div>
                }
            />
        </>
    );
}