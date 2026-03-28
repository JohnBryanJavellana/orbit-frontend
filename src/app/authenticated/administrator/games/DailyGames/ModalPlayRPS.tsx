'use client';

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useEffect, useRef, useState } from "react";
import Confetti from 'react-confetti-boom';
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { useRouter } from "next/navigation";
import axios from "axios";
import useGetCurrentUser from '@/app/hooks/useGetCurrentUser';
import useMessageAlertPopup from '@/app/hooks/useMessageAlertPopup';
import './ModalPlayRPS.css';

interface ModalPlayRPSProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalPlayRPS({ data, id, titleHeader, callbackFunction }: ModalPlayRPSProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [returnResponse, setReturnResponse] = useState<any | null>(null);

    // Game States
    const [userChoice, setUserChoice] = useState<string | null>(null);
    const [computerChoice, setComputerChoice] = useState<string | null>(null);
    const [gameResult, setGameResult] = useState<'WIN' | 'LOSS' | 'DRAW' | null>(null);

    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData, refreshUser } = useGetCurrentUser();
    const [dailyFreeSpin, setDailyFreeSpin] = useState<string | 'PENDING' | 'TAKEN'>('');
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    const choices = [
        { name: 'Rock', icon: '✊', value: 'rock' },
        { name: 'Paper', icon: '✋', value: 'paper' },
        { name: 'Scissor', icon: '✌️', value: 'scissor' }
    ];

    const CheckForFreeDailySpin = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/member/daily-activities/daily-activities/get_daily_activities`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDailyFreeSpin(response.data.activities.rockPaperScissor);
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

    // Canvas Animation Loop
    useEffect(() => {
        if (!isPlaying || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let frame = 0;
        const icons = ['✊', '✋', '✌️'];

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "60px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ff0055"; // Red shadow for System/Boss vibe

            const currentIcon = icons[Math.floor(frame / 6) % icons.length];

            // Flip the system hand horizontally to face the player
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(-1, 1);
            ctx.fillText(currentIcon, 0, 0);
            ctx.restore();

            frame++;
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();
        return () => window.cancelAnimationFrame(animationFrameId);
    }, [isPlaying]);

    const playGame = async (choice: string) => {
        // Reset states for a fresh start
        setIsPlaying(true);
        setUserChoice(choice);
        setComputerChoice(null);
        setGameResult(null);
        setReturnResponse(null);

        setTimeout(async () => {
            const cpuMove = choices[Math.floor(Math.random() * choices.length)].value;
            setComputerChoice(cpuMove);

            let result: 'WIN' | 'LOSS' | 'DRAW';

            if (choice === cpuMove) {
                result = 'DRAW';
            } else if (
                (choice === 'rock' && cpuMove === 'scissor') ||
                (choice === 'paper' && cpuMove === 'rock') ||
                (choice === 'scissor' && cpuMove === 'paper')
            ) {
                result = 'WIN';
            } else {
                result = 'LOSS';
            }

            setGameResult(result);
            setIsPlaying(false);

            if (result !== 'DRAW') {
                await SubmitResult(result === 'WIN' ? '7' : '0');
            }
        }, 2000);
    };

    const SubmitResult = async (score: string) => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/member/daily-activities/daily-activities/save_game_r_cs_cg_score`, {
                score: score,
                usingActualAPs: dailyFreeSpin === "TAKEN" ? 5 : null,
                gameService: 'rock_paper_scissor'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setReturnResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#play_rock_paper_scissors_${id}`).modal('hide');

                setCallbackFunction({
                    callbackFunction: () => handleClose()
                });

                if (error.response?.status !== 500) {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
                } else {
                    navigate.push('/access-denied')
                };
            }
        } finally {
            await refreshUser();
            setDailyFreeSpin('TAKEN');
            setIsSubmitting(false);
        }
    }

    const handleClose = () => {
        $(`#play_rock_paper_scissors_${id}`).modal('hide');
        callbackFunction(returnResponse !== null);
    };

    return (
        <>
            <MessageAlertPopup />
            <ModalTemplate
                id={`play_rock_paper_scissors_${id}`}
                size={"md"}
                modalParentStyle="bg-stack"
                isModalCentered
                modalContentClassName="text-white custom-modal-dialog shadow-lg"
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                body={
                    <div className="game-container text-center">
                        <div className="text-center mb-4">
                            <h5>Play & Win to get <span className="gold-text">7 APs</span></h5>
                        </div>

                        {!isPlaying && !gameResult ? (
                            <div className="choice-selection py-4">
                                <h6 className="text-muted mb-4">Choose & Play for <span className="text-warning">5 APs</span></h6>
                                <div className="d-flex justify-content-center gap-3">
                                    {choices.map((c) => (
                                        <button
                                            key={c.value}
                                            className="btn game-card-btn"
                                            onClick={() => playGame(c.value)}
                                            disabled={isSubmitting || isFetching || (dailyFreeSpin === 'TAKEN' && userData?.total_slot < 5)}
                                        >
                                            <div className="icon-display">{c.icon}</div>
                                            <div className="label-display">{c.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="battle-view py-5 d-flex align-items-center justify-content-around">
                                    <div className="player-side">
                                        <div className="display-2 mb-2">{choices.find(c => c.value === userChoice)?.icon}</div>
                                        <span className="badge badge-info px-3">ME</span>
                                    </div>

                                    <div className="vs-divider">
                                        <h2 className="glitch-text" data-text="VS">VS</h2>
                                    </div>

                                    <div className="system-side">
                                        <div className="canvas-wrapper" style={{ height: '100px', width: '100px' }}>
                                            {isPlaying ? (
                                                <canvas ref={canvasRef} width={100} height={100} />
                                            ) : (
                                                <div className="display-2 mb-2 fade-in">
                                                    {choices.find(c => c.value === computerChoice)?.icon}
                                                </div>
                                            )}
                                        </div>
                                        <span className="badge badge-danger px-3 mt-3 ml-4">SYSTEM</span>
                                    </div>
                                </div>

                                <div className="w-100">
                                    <button className="btn btn-warning btn-sm elevation-1 mt-3" onClick={() => {
                                        setIsPlaying(false);
                                        setReturnResponse(null);
                                        setGameResult(null);
                                    }}>Replay</button>
                                </div>
                            </>
                        )}

                        {returnResponse && (
                            <>
                                <div className="text-center mt-4">
                                    <h5>{returnResponse?.message}</h5>
                                </div>

                                {
                                    (returnResponse.points_added > 0) &&
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
                    </div>
                }
                footerClassName="border-0 pt-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' disabled={isPlaying || isSubmitting || isFetching} className='btn btn-dark btn-sm custom-border-dark' onClick={() => handleClose()}>
                            Close
                        </button>
                    </div>
                }
            />
        </>
    );
}