'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import LoadingPopup from "@/app/custom-global-components/LoadingPopup/LoadingPopup";

interface ModalChooseNewRareBorderProps {
    data: any,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: boolean) => void
}

export default function ModalChooseNewRareBorder({ data, id, titleHeader, callbackFunction }: ModalChooseNewRareBorderProps) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [borders, setBorders] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [borderId, setBorderId] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const GetAvailableBorders = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/border/border/get_user_new_rare_borders`, {
                userId: data?.userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBorders(response.data.borders);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            setIsFetching(false);
        }
    }

    const AddToBorderInv = async () => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();

            formData.append('userId', data?.userId);
            borderId.forEach(r => formData.append('border[]', r.toString()));

            const response = await axios.post(`${urlWithApi}/administrator/border/border/add_new_rare_borders`, formData, {
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
        GetAvailableBorders(true);
        return () => { };
    }, [data]);

    const handleClose = () => {
        $(`#modal_modify_rare_borders_${id}`).modal('hide');
        callbackFunction(false);
    }

    return (
        <>
            <ModalTemplate
                id={`modal_modify_rare_borders_${id}`}
                size={"md"}
                modalParentStyle="bg-stack"
                isModalScrollable={false}
                isModalCentered
                modalContentClassName="text-white"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                bodyClassName="bg-dark"
                body={
                    <>
                        {isSubmitting && <LoadingPopup />}

                        {
                            isFetching
                                ? <div>Please wait...</div>
                                : borders.length > 0
                                    ? <>
                                        <div className="row">
                                            {
                                                borders.map((border: any, index: number) => (
                                                    <div className="col-6" key={index} style={{ userSelect: 'none' }}>
                                                        <div className="card custom-bg rounded-0 custom-border-dark elevation-1">
                                                            <div className="card-header custom-bottom-border-dark py-0 px-0 text-right">
                                                                <Checkbox
                                                                    className="m-0"
                                                                    checked={borderId.some(r => r === border.id)}
                                                                    onChange={(_, checked) => {
                                                                        setBorderId(borderId.filter(r => r !== border.id));
                                                                        if (checked) setBorderId(r => [...r, border.id]);
                                                                    }}
                                                                    slotProps={{
                                                                        input: { 'aria-label': 'controlled' },
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="card-body text-center">
                                                                <img src={`${urlWithoutApi}/border-images/${border.filename}`} height={150} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                    : <div>No borders found yet.</div>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>

                        <button type='button' className='btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white' disabled={isSubmitting || borderId.length <= 0} onClick={() => AddToBorderInv()}>
                            Save Changes
                        </button>
                    </>
                }
            />
        </>
    );
}