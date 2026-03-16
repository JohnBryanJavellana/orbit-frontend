'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useState } from "react";
import './ModalGetDailyActivities.css';
import ModalPlayRoulette from "./DailyGames/ModalPlayRoulette";
import ModalPlayCupShuffle from "./DailyGames/ModalPlayCupShuffle";

interface ModalGetDailyActivitiesProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalGetDailyActivities({ data, id, titleHeader, callbackFunction }: ModalGetDailyActivitiesProps) {
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);

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
                headerClassName="border-0 pb-0"
                isModalCentered
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                bodyClassName="py-0"
                body={
                    <>
                        {
                            modalOpenIndex === 0 &&
                            <ModalPlayRoulette
                                data={modalOpenData}
                                id={modalOpenId}
                                titleHeader={'Wheel of Fortune'}
                                callbackFunction={(e) => {
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }

                        {
                            modalOpenIndex === 1 &&
                            <ModalPlayCupShuffle
                                data={modalOpenData}
                                id={modalOpenId}
                                titleHeader={'Cup Shuffle'}
                                callbackFunction={(e) => {
                                    setModalOpenData(null);
                                    setModalOpenId(null);
                                    setModalOpenIndex(null);
                                }}
                            />
                        }

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

                        <img
                            src={'/system-images/cup-shuffle-btn.png'}
                            className="img-fluid furtune_wheel_btn"
                            onClick={() => {
                                setModalOpenData(null);
                                setModalOpenId(1);
                                setModalOpenIndex(1);
                            }}
                            data-toggle="modal"
                            data-target={`#play_cup_shuffle_1`}
                        />

                        <img
                            src={'/system-images/color-game-btn.png'}
                            className="img-fluid furtune_wheel_btn mt-1"
                            onClick={() => {
                                alert('Oops! Umaasaaaaaa. 1XBET yarn?');
                            }}
                            data-toggle="modal"
                            data-target={`#play_color_game_2`}
                        />
                    </>
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' className='btn btn-dark btn-sm mr-1' onClick={() => handleClose()}>
                            Close
                        </button>
                    </div>
                }
            />
        </>
    );
}