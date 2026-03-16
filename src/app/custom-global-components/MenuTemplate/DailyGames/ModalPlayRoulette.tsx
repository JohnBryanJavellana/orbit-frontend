'use client';

import dynamic from 'next/dynamic';
import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useEffect, useState } from "react";
import './ModalPlayRoulette.css';
import Confetti from 'react-confetti-boom';
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { useRouter } from "next/navigation";
import axios from "axios";
import useGetCurrentUser from '@/app/hooks/useGetCurrentUser';

interface ModalPlayRouletteProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), { ssr: false });
const wheelData = [
    { option: '0 Aura Point', style: { backgroundColor: '#1a1a1a', textColor: '#d4af37' } },
    { option: '10 Aura Points', style: { backgroundColor: '#2a2a2a', textColor: '#ffffff' } },
    { option: '0 Aura Point', style: { backgroundColor: '#1a1a1a', textColor: '#d4af37' } },
    { option: '20 Aura Points', style: { backgroundColor: '#2a2a2a', textColor: '#ffffff' } },
    { option: '0 Aura Point', style: { backgroundColor: '#1a1a1a', textColor: '#d4af37' } },
    { option: '30 Aura Points', style: { backgroundColor: '#2a2a2a', textColor: '#ffffff' } },
    { option: '0 Aura Point', style: { backgroundColor: '#1a1a1a', textColor: '#d4af37' } },
    { option: '40 Aura Points', style: { backgroundColor: '#2a2a2a', textColor: '#ffffff' } },
    { option: '0 Aura Point', style: { backgroundColor: '#1a1a1a', textColor: '#d4af37' } },
    { option: '50 Aura Points', style: { backgroundColor: '#2a2a2a', textColor: '#ffffff' } },
    { option: '0 Aura Point', style: { backgroundColor: '#1a1a1a', textColor: '#d4af37' } },
    { option: '150 Aura Points', style: { backgroundColor: '#d4af37', textColor: '#000000' } },
    { option: '0 Aura Point', style: { backgroundColor: '#1a1a1a', textColor: '#d4af37' } },
    { option: 'SPIN AGAIN', style: { backgroundColor: '#006400', textColor: '#ffffff' } },
    {
        option: 'RARE BORDER', style: {
            backgroundColor: '#800000',
            textColor: '#ffd700',
            fontWeight: 'bold'
        }
    },
];

const weights = [
    12, // Index 0: 0 AP (12%)
    5,  // Index 1: 10 AP (5%)
    12, // Index 2: 0 AP (12%)
    5,  // Index 3: 20 AP (5%)
    12, // Index 4: 0 AP (12%)
    5,  // Index 5: 30 AP (5%)
    12, // Index 6: 0 AP (12%)
    5,  // Index 7: 40 AP (5%)
    12, // Index 8: 0 AP (12%)
    5,  // Index 9: 50 AP (5%)
    5,  // Index 10: 0 AP (5%)
    3,  // Index 11: 150 AP (3%)
    5,  // Index 12: 0 AP (5%)
    3,  // Index 13: SPIN AGAIN (3%)
    2   // Index 14: RARE BORDER (2%)
];

export default function ModalPlayRoulette({ data, id, titleHeader, callbackFunction }: ModalPlayRouletteProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [mustSpin, setMustSpin] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const [returnResponse, setReturnResponse] = useState<any | null>(null);
    const { userData, refreshUser } = useGetCurrentUser();
    const [dailyFreeSpin, setDailyFreeSpin] = useState<string | 'PENDING' | 'TAKEN'>('');

    const CheckForFreeDailySpin = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/member/daily-activities/daily-activities/get_daily_activities`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDailyFreeSpin(response.data.activities.roulette);
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
        if (userData) {
            CheckForFreeDailySpin(true);
            return () => { };
        }
    }, [userData]);

    const handleSpinClick = () => {
        if (!mustSpin) {
            const totalWeight = weights.reduce((acc, w) => acc + w, 0);
            let random = Math.floor(Math.random() * totalWeight);
            let selectedIndex = 0;

            for (let i = 0; i < weights.length; i++) {
                if (random < weights[i]) {
                    selectedIndex = i;
                    break;
                }
                random -= weights[i];
            }

            setReturnResponse(null);
            setPrizeNumber(selectedIndex);
            setShowConfetti(false);
            setIsPlaying(true);
            setMustSpin(true);
        }
    };

    const SubmitResult = async (score: string) => {
        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/member/daily-activities/daily-activities/save_roulette_score`, {
                score: score,
                usingActualAPs: dailyFreeSpin === "TAKEN" ? 5 : null
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setReturnResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    alert(error.response?.data.message);
                } else {
                    navigate.push('/access-denied');
                }
            }
        } finally {
            await refreshUser();
            setDailyFreeSpin('TAKEN');
            setIsSubmitting(false);
        }
    }

    const handleClose = () => {
        $(`#play_roulette_${id}`).modal('hide');
        callbackFunction(returnResponse !== null);
    };

    return (
        <ModalTemplate
            id={`play_roulette_${id}`}
            size={"md"}
            modalParentStyle="bg-stack"
            isModalCentered
            modalContentClassName="text-white roulette-modal-custom"
            headerClassName="border-0 pb-0"
            header={
                <div className="w-100">
                    <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                    <hr className="style-two" />
                </div>
            }
            body={
                <>
                    <div className="roulette-container">
                        <Wheel
                            mustStartSpinning={mustSpin && !isFetching}
                            prizeNumber={prizeNumber}
                            data={wheelData}
                            onStopSpinning={async () => {
                                const prize = wheelData[prizeNumber];
                                const isWin = prize?.option !== "0 Aura Point";

                                if (prize.option === "SPIN AGAIN") {
                                    setMustSpin(false);
                                    setIsPlaying(false);
                                    return;
                                }

                                setMustSpin(false);
                                setIsPlaying(false);
                                await SubmitResult(isWin ? prize.option.replace(' Aura Points', '') : '0');
                            }}
                            outerBorderColor="#d4af37"
                            outerBorderWidth={8}
                            innerRadius={10}
                            innerBorderColor="#d4af37"
                            innerBorderWidth={3}
                            radiusLineColor="rgba(212, 175, 55, 0.2)"
                            radiusLineWidth={1}
                            fontSize={14}
                            textDistance={65}
                            perpendicularText={false}
                            pointerProps={{
                                style: {
                                    filter: 'drop-shadow(0 0 10px #d4af37)',
                                    marginTop: '10px'
                                }
                            }}
                        />

                        <div className={`spin-button-outer ${mustSpin || isFetching ? 'disabled' : ''}`} style={{ userSelect: 'none' }}>
                            <div className="spin-button-center text-center" onClick={handleSpinClick}>
                                <span className="spin-text">{mustSpin || isFetching ? '...' : dailyFreeSpin && dailyFreeSpin === 'PENDING' ? 'FREE DAILY SPIN' : userData?.total_points >= 5 ? 'SPIN AGAIN FOR 5 APs' : 'No APs found'}</span>
                            </div>
                        </div>
                    </div>

                    {returnResponse && (
                        <>
                            <div className="text-center mt-4">
                                <h5>{returnResponse?.message}</h5>
                                {returnResponse?.rare_border_img && <img src={`${urlWithoutApi}/${returnResponse?.rare_border_img}`} className="mt-2" height={150} />}
                            </div>

                            {
                                (returnResponse.points_added > 0 || returnResponse?.rare_border_img) &&
                                <div style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 9999,
                                    pointerEvents: 'none'
                                }}>
                                    <Confetti
                                        mode="boom"
                                        particleCount={100}
                                        shapeSize={15}
                                        colors={['#fff457', '#f30909']}
                                    />
                                </div>
                            }

                        </>
                    )}
                </>
            }
            footerClassName="border-0 pb-0"
            footer={
                <div className="w-100 text-center">
                    <hr className="style-two" />
                    <button type='button' disabled={isPlaying || isSubmitting || isFetching} className='btn btn-dark btn-sm' onClick={handleClose} >
                        Close
                    </button >
                </div>
            }
        />
    );
}