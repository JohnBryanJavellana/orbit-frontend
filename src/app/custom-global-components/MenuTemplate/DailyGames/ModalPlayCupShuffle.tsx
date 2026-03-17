'use client';

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useEffect, useRef, useState } from "react";
import Confetti from 'react-confetti-boom';
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { useRouter } from "next/navigation";
import axios from "axios";
import useGetCurrentUser from '@/app/hooks/useGetCurrentUser';
import './ModalPlayCupShuffle.css';

interface ModalPlayCupShuffleProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalPlayCupShuffle({ data, id, titleHeader, callbackFunction }: ModalPlayCupShuffleProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const [returnResponse, setReturnResponse] = useState<any | null>(null);
    const { userData, refreshUser } = useGetCurrentUser();
    const [dailyFreeSpin, setDailyFreeSpin] = useState<string | 'PENDING' | 'TAKEN' | ''>('');

    // Game Logic States
    const [cupPositions, setCupPositions] = useState([0, 1, 2]);
    const [ballLocation, setBallLocation] = useState<number>(1);
    const [revealed, setRevealed] = useState(false);
    const [isPreRevealing, setIsPreRevealing] = useState(false);
    const [hasShuffled, setHasShuffled] = useState(false);
    const spinAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        spinAudio.current = new Audio('/cup-shuffle-sound-effect.mp3');
        spinAudio.current.loop = true;

        return () => {
            if (spinAudio.current) {
                spinAudio.current.pause();
                spinAudio.current = null;
            }
        };
    }, []);

    const CheckForFreeDailySpin = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/member/daily-activities/daily-activities/get_daily_activities`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDailyFreeSpin(response.data.activities.cupShuffle);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) alert(error.response?.data?.message);
                else navigate.push('/access-denied');
            }
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if (userData) CheckForFreeDailySpin(true);
    }, [userData]);

    const SubmitResult = async (score: string) => {
        try {
            setIsSubmitting(true);
            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/member/daily-activities/daily-activities/save_cup_shuffle_score`, {
                score: score,
                usingActualAPs: dailyFreeSpin === "TAKEN" ? 25 : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReturnResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) alert(error.response?.data?.message);
                else navigate.push('/access-denied');
            }
        } finally {
            await refreshUser();
            setDailyFreeSpin('TAKEN');
            setIsSubmitting(false);
        }
    }

    const startShuffleSequence = () => {
        setIsPlaying(true);
        setRevealed(false);
        setHasShuffled(false);
        setShowConfetti(false);
        setReturnResponse(null);

        const newBallLoc = Math.floor(Math.random() * 3);
        setBallLocation(newBallLoc);

        setIsPreRevealing(true);

        if (spinAudio.current) {
            spinAudio.current.currentTime = 0;
            spinAudio.current.play().catch(e => console.log("Audio play blocked", e));
        }

        setTimeout(() => {
            setIsPreRevealing(false);
            setTimeout(() => {
                let shuffles = 0;
                const shuffleSpeed = 150;
                const maxShuffles = 67;

                const interval = setInterval(() => {
                    setCupPositions(prev => [...prev].sort(() => Math.random() - 0.5));
                    shuffles++;

                    if (shuffles >= maxShuffles) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        setHasShuffled(true);

                        if (spinAudio.current) {
                            spinAudio.current.pause();
                            spinAudio.current.currentTime = 0;
                        }
                    }
                }, shuffleSpeed);
            }, 300);
        }, 1000);
    };

    const handleCupClick = (cupId: number) => {
        if (!hasShuffled || revealed || isPlaying || isPreRevealing) return;

        setRevealed(true);
        setHasShuffled(false);
        SubmitResult(String(cupId === ballLocation ? 40 : 0));
    };

    const handleClose = () => {
        $(`#play_cup_shuffle_${id}`).modal('hide');
        callbackFunction(returnResponse !== null);
    };

    return (
        <ModalTemplate
            id={`play_cup_shuffle_${id}`}
            size={"md"}
            modalParentStyle="bg-stack"
            isModalCentered
            modalContentClassName="text-white"
            headerClassName="border-0 pb-0"
            header={
                <div className="w-100">
                    <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                    <hr className="style-two" />
                </div>
            }
            body={
                <div className="game-wrapper" style={{ userSelect: 'none' }}>
                    <div className="text-center mb-4">
                        <h5>Find the ball to win <span className="gold-text">40 APs</span></h5>
                    </div>

                    <div className="game-area">
                        <div className="cups-container">
                            {[0, 1, 2].map((cupId) => {
                                const visualIndex = cupPositions.indexOf(cupId);
                                const isWinningCup = cupId === ballLocation;
                                const shouldShowBall = isWinningCup && (isPreRevealing || revealed || (!isPlaying && !hasShuffled && !revealed));

                                return (
                                    <div key={cupId} className={`cup-slot position-${visualIndex} ${(revealed || isPreRevealing || (!isPlaying && !hasShuffled && !revealed)) ? 'lifting-all' : ''} ${(revealed && isWinningCup) ? 'correct-glow' : ''} ${(!hasShuffled || isPlaying) ? 'no-pointer' : ''}`} onClick={() => handleCupClick(cupId)}>
                                        <div className="cup-wrapper">
                                            <img src="/system-images/27-276532_silver-cup-clip-art-clipart-upside-down-glass.png" alt="Cup" className="cup-sprite" />
                                            {shouldShowBall && <img src="/system-images/Sport-ball-cartoon-vector-Graphics-45089540-3-580x386.png" alt="Ball" className="ball-sprite" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="action-section mt-5 text-center">
                        <div className={`btn-play-fantasy mt-5 ${isPlaying || isPreRevealing || isFetching || hasShuffled || (userData?.total_points < 5 && dailyFreeSpin !== 'PENDING') ? 'disabled' : ''}`} onClick={!(isPlaying || isPreRevealing || isFetching || hasShuffled) ? startShuffleSequence : undefined}>
                            <div className="fantasy-button-inner">
                                {isPlaying || isPreRevealing || isFetching ? 'SHUFFLING...' :
                                    hasShuffled ? 'CHOOSE A CUP' :
                                        dailyFreeSpin === 'PENDING' ? 'FREE DAILY SHUFFLE' :
                                            userData?.total_points >= 25 ? 'REPLAY FOR 25 APs' : 'INSUFFICIENT APs'}
                            </div>
                        </div>

                        {returnResponse && (
                            <div className="response-message mt-4">
                                <h4 className={returnResponse.points_added > 0 ? 'text-success-gold' : 'text-danger-fade'}>
                                    {returnResponse.message}
                                </h4>
                            </div>
                        )}
                    </div>

                    {(returnResponse && returnResponse?.points_added !== 0) && (
                        <div className="confetti-container">
                            <Confetti mode="boom" particleCount={100} shapeSize={15} colors={['#fff457', '#f30909']} />
                        </div>
                    )}
                </div>
            }
            footerClassName="border-0"
            footer={
                <div className="w-100 text-center">
                    <hr className="style-two" />
                    <button type='button' disabled={isPlaying || isSubmitting || isFetching || isPreRevealing} className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={handleClose}>
                        CLOSE
                    </button>
                </div>
            }
        />
    );
}