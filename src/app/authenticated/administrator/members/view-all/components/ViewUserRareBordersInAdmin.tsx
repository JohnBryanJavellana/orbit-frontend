'use client';

import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalModifyPoints from "./ModalModifyPoints";
import ModalChooseNewRareBorder from "./ModalChooseNewRareBorder";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function ViewUserRareBordersInAdmin({ userId }: { userId: number }) {
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const [borders, setBorders] = useState<any>([]);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetUserRareBorders = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/administrator/border/border/get_user_rare_borders`, {
                userId: userId
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

    const RemoveBorderInv = async (invId: number) => {
        let ask = window.confirm("Are you sure you want to remove this rare border in inventory?");
        if (!ask) return;

        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const formData = new FormData();

            formData.append('userId', userId.toString());
            formData.append('borderId', invId.toString());

            const response = await axios.post(`${urlWithApi}/administrator/border/border/remove_user_rare_borders`, formData, {
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
            GetUserRareBorders(false);
        }
    }

    useEffect(() => {
        GetUserRareBorders(true);
        return () => { };
    }, [userId]);

    return (
        <>
            {
                modalOpenIndex === 0 &&
                <ModalChooseNewRareBorder
                    data={modalOpenData}
                    id={modalOpenId}
                    titleHeader={'Add Rare Border to Inventory'}
                    callbackFunction={() => {
                        GetUserRareBorders(false);
                        setModalOpenData(null);
                        setModalOpenId(null);
                        setModalOpenIndex(null);
                    }}
                />
            }

            <div className="d-flex align-items-center justify-content-end px-3 pt-2">
                <button className="rpg-button px-3" style={{ height: '40px' }} onClick={() => {
                    setModalOpenData({
                        userId: userId
                    });
                    setModalOpenId(userId);
                    setModalOpenIndex(0);
                }} data-target={`#modal_modify_rare_borders_${userId}`} data-toggle="modal">Add Rare Border to Inventory</button>
            </div>
            <hr className="style-two" />

            <div className="p-3">
                {
                    isFetching
                        ? <p>Please wait...</p>
                        : <div className="row">
                            {
                                borders.length > 0
                                    ? borders.map((border: any, index: number) => (
                                        <div className="col-6 col-xl-3" key={index}>
                                            <div className="card custom-bg rounded-0 custom-border-dark elevation-1">
                                                <div className="card-header custom-bottom-border-dark py-0 px-0 text-danger text-right">
                                                    <Tooltip title="Remove in Inventory">
                                                        <IconButton disabled={isSubmitting} onClick={() => {
                                                            RemoveBorderInv(border?.id);
                                                        }}>
                                                            <CloseIcon color='error' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>

                                                <div className="card-body text-center">
                                                    <img src={`${urlWithoutApi}/border-images/${border.custom_border.filename}`} height={150} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : <div className="col-xl-12 p-3 text-center text-muted">No data found.</div>
                            }
                        </div>
                }
            </div>
        </>
    );
}