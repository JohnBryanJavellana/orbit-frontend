'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import useDateFormat from "@/app/hooks/useDateFormat";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import useWebToken from "@/app/hooks/useWebToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import './ModalGetDailyActivities.css';
import ModalPlayRoulette from "./DailyGames/ModalPlayRoulette";

interface ModalGetDailyActivitiesProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalGetDailyActivities({ data, id, titleHeader, callbackFunction }: ModalGetDailyActivitiesProps) {
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const [dailyActivities, setDailyActivities] = useState<any | null>(null);
    const navigate = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { FormatDatetimeToHumanReadable } = useDateFormat();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const [searchText, setSearchText] = useState<string>('');

    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

    const GetDailyActivities = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/member/daily-activities/daily-activities/get_daily_activities`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDailyActivities(response.data.activities);
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

    useEffect(() => {
        GetDailyActivities(true);
        return () => { };
    }, []);

    const handleClose = () => {
        $(`#get_daily_activities_${id}`).modal('hide');
        callbackFunction(null);
    }

    return (
        <>
            <ModalTemplate
                id={`get_daily_activities_${id}`}
                size={"md"}
                isModalScrollable={false}
                modalContentClassName="text-white"
                header={
                    <>
                        <span className="modal-title text-sm">
                            <strong>{titleHeader}</strong>
                        </span>
                    </>
                }
                bodyClassName="px-4 pt-4"
                body={
                    <>
                        {
                            modalOpenIndex === 0 &&
                            <ModalPlayRoulette
                                data={modalOpenData}
                                id={modalOpenId}
                                titleHeader={'Wheel of Fortune'}
                                callbackFunction={(e) => {
                                    GetDailyActivities(false);
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);

                                    if (e) window.location.reload();
                                }}
                            />
                        }

                        {
                            isFetching
                                ? <p>Please wait...</p>
                                : <div className="text-center">
                                    {dailyActivities.roulette === "PENDING" ? (
                                        <img
                                            src={'/system-images/furtune-wheel-btn.png'}
                                            className="img-fluid mb-2 furtune_wheel_btn"
                                            onClick={() => {
                                                setModalOpenData(null);
                                                setModalOpenId(0);
                                                setModalOpenIndex(0);
                                            }}
                                            data-toggle="modal"
                                            data-target={`#play_roulette_0`}
                                        />
                                    ) : (
                                        <div className="text-muted text-sm">
                                            <i className="fas fa-check-circle text-success mr-1"></i>
                                            Roulette Completed
                                        </div>
                                    )}
                                </div>
                        }
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>
                    </>
                }
            />
        </>
    );
}