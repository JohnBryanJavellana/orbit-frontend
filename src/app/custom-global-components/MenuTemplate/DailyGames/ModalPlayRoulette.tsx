'use client';

import dynamic from 'next/dynamic';
import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useState } from "react";
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


export default function ModalPlayRoulette({ data, id, titleHeader, callbackFunction }: ModalPlayRouletteProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData } = useGetCurrentUser();
    const [returnResponse, setReturnResponse] = useState<any | null>(null);

    const handleSpinClick = () => {
        if (!mustSpin) {
            let newPrizeNumber;
            const roll = Math.floor(Math.random() * 100) + 1;

            if (roll <= 5) {
                newPrizeNumber = 13;
            } else if (roll > 5 && roll <= 15) {
                newPrizeNumber = 12;
            } else if (roll > 15 && roll <= 25) {
                newPrizeNumber = 11;
            } else {
                const commonIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
                newPrizeNumber = commonIndices[Math.floor(Math.random() * commonIndices.length)];
            }

            setPrizeNumber(newPrizeNumber);
            setShowConfetti(false);
            setIsPlaying(true);
            setMustSpin(true);
        }
    };

    const SubmitResultIfNotBokya = async (score: string) => {
        if (!userData || userData?.role === "SUPERADMIN") return;

        try {
            setIsSubmitting(true);

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/member/daily-activities/daily-activities/save_roulette_score`, {
                score: score
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
                <div style={{ userSelect: 'none' }}>
                    {
                        !returnResponse
                            ? <div className="roulette-container">
                                <Wheel
                                    mustStartSpinning={mustSpin}
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
                                        await SubmitResultIfNotBokya(isWin ? prize.option.replace(' Aura Points', '') : '0');
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

                                <div className={`spin-button-outer ${mustSpin ? 'disabled' : ''}`} style={{ userSelect: 'none' }}>
                                    <div className="spin-button-center" onClick={handleSpinClick}>
                                        <span className="spin-text">{mustSpin ? '...' : 'SPIN'}</span>
                                    </div>
                                </div>
                            </div>
                            : <div className="text-center">
                                <h5>{returnResponse?.message}</h5>

                                {returnResponse?.rare_border_img && <img src={`${urlWithoutApi}/${returnResponse?.rare_border_img}`} className="mt-2" height={150} />}
                            </div>
                    }


                    {(returnResponse && (returnResponse?.points_added !== 0 || returnResponse?.rare_border_img)) && (
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
                    )}
                </div>
            }
            footer={
                <button type='button' disabled={isPlaying || isSubmitting} className='btn btn-dark btn-sm' onClick={handleClose}>
                    Close
                </button>
            }
        />
    );
}