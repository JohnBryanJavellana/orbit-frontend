'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import { FormControl, Input, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomWYSIWYG from "@/app/custom-global-components/CustomWYSIWYG/CustomWYSIWYG";
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";

interface ModalModifyPointsProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalModifyPoints({ data, id, titleHeader, callbackFunction }: ModalModifyPointsProps) {
    const [points, setPoints] = useState<string>('');
    const [modification, setModification] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const handleClose = () => {
        $(`#modal_modify_points_${id}`).modal('hide');
        callbackFunction(null);
    }

    const SubmitMemberForm = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();
            formData.append('points', points);
            formData.append('modifyType', modification);
            formData.append('contentText', content);
            formData.append('playerId', data?.userId);

            const response = await axios.post(`${urlWithApi}/administrator/aura_point_record/aura_point_record/modify_points`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            $(`#modal_modify_points_${id}`).modal('hide');

            setCallbackFunction({
                callbackFunction: () => handleClose()
            });

            setMessageAlert({
                message: response.data.message,
                status: 'SUCCESS'
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#modal_modify_points_${id}`).modal('hide');

                setCallbackFunction({
                    callbackFunction: () => handleClose()
                });

                if (error.response?.status !== 500) {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
                } else {
                    $(`#modal_modify_points_${id}`).modal('hide');
                    navigate.push('/access-denied');
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
                id={`modal_modify_points_${id}`}
                size={"md"}
                modalParentStyle="bg-stack"
                isModalScrollable={false}
                modalContentClassName="text-white"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                bodyClassName="px-4"
                body={
                    <>
                        <label htmlFor="point" className='custom-label-color'>
                            Points <span className="text-danger">*</span>
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Input
                                id="point"
                                type="number"
                                className='custom-field-bg'
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                disableUnderline
                                autoComplete='off'
                            />
                        </FormControl>

                        <label htmlFor="suffix" className='custom-label-color'>
                            Modification
                        </label>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select
                                id="suffix"
                                value={modification}
                                onChange={(e) => setModification(e.target.value)}
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
                                <MenuItem value="INCREASE">INCREASE</MenuItem>
                                <MenuItem value="DECREASE">DECREASE</MenuItem>
                            </Select>
                        </FormControl>

                        <label htmlFor="bio" className='custom-label-color'>
                            Content <span className="text-danger">*</span>
                        </label>

                        <CustomWYSIWYG
                            value={content}
                            onTextChange={(e) => setContent(e)}
                            placeholder="Enter content"
                        />
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type="button" onClick={() => SubmitMemberForm()} disabled={
                            !points ||
                            !modification ||
                            !content ||
                            isSubmitting
                        } className={`btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white`}>
                            Submit
                        </button>
                    </>
                }
            />
        </>
    );
}