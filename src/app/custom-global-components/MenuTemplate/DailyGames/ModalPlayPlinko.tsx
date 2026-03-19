'use client';

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useEffect, useRef, useState, useCallback } from "react";
import Confetti from 'react-confetti-boom';
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { useRouter } from "next/navigation";
import axios from "axios";
import useGetCurrentUser from '@/app/hooks/useGetCurrentUser';
import useMessageAlertPopup from '@/app/hooks/useMessageAlertPopup';

const RARE_SLOT_WIDTH = 40;
const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 400;
const ROWS = 6;
const PEGS_IN_ROW = 9;
const MULTIPLIERS = ['RARE BORDER', 0, 4, 0, 3, 0, 5, 0, 6];
const SLOT_COUNT = MULTIPLIERS.length;
const SLOT_WIDTH = CANVAS_WIDTH / SLOT_COUNT;
const NORMAL_SLOT_COUNT = MULTIPLIERS.length - 1;
const NORMAL_SLOT_WIDTH = (CANVAS_WIDTH - RARE_SLOT_WIDTH) / NORMAL_SLOT_COUNT;

interface ModalPlayPlinkoProps {
    data: any | null,
    id: number | null,
    titleHeader: string,
    callbackFunction: (e: any) => void
}

export default function ModalPlayPlinko({ data, id, titleHeader, callbackFunction }: ModalPlayPlinkoProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [returnResponse, setReturnResponse] = useState<any | null>(null);
    const { getToken } = useWebToken();
    const { urlWithApi, urlWithoutApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData, refreshUser } = useGetCurrentUser();
    const [dailyFreeSpin, setDailyFreeSpin] = useState<string | 'PENDING' | 'TAKEN'>('');
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();

    // Game Logic State
    const ballPos = useRef({ x: CANVAS_WIDTH / 2, y: 30 });
    const ballVel = useRef({ x: 0, y: 0 });
    const animationFrame = useRef<number>(0);

    const drawBoard = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const spacingX = 45;
        const spacingY = 44;

        // Total width calculation for centering
        const totalGridWidth = (PEGS_IN_ROW - 1) * spacingX;

        // gridOffsetX is the starting point for even rows. 
        // We subtract spacingX / 4 to keep the entire staggered block centered.
        const gridOffsetX = (CANVAS_WIDTH - totalGridWidth) / 2 - (spacingX / 4);

        ctx.fillStyle = "#ffffff";
        for (let r = 0; r < ROWS; r++) {
            for (let i = 0; i < PEGS_IN_ROW; i++) {
                // ALTERNATE: Shift odd rows (1, 3, 5) by half a unit (22.5px)
                const rowShift = (r % 2 === 0) ? 0 : spacingX / 2;

                const x = gridOffsetX + (i * spacingX) + rowShift;
                const y = 80 + r * spacingY;

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.textAlign = "center";
        let currentXOffset = 0;

        MULTIPLIERS.forEach((m, i) => {
            // Determine width for this specific slot
            const isRare = m === 'RARE BORDER';
            const currentSlotWidth = isRare ? RARE_SLOT_WIDTH : NORMAL_SLOT_WIDTH;

            const slotLeft = currentXOffset;
            const slotRight = currentXOffset + currentSlotWidth;
            const centerX = slotLeft + (currentSlotWidth / 2);

            ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
            ctx.lineWidth = 1;

            // 1. Draw Dividers
            if (i > 0) {
                ctx.beginPath();
                ctx.moveTo(slotLeft, CANVAS_HEIGHT - 60);
                ctx.lineTo(slotLeft, CANVAS_HEIGHT);
                ctx.stroke();
            }

            // Closing border for the final slot
            if (i === MULTIPLIERS.length - 1) {
                ctx.beginPath();
                ctx.moveTo(slotRight, CANVAS_HEIGHT - 60);
                ctx.lineTo(slotRight, CANVAS_HEIGHT);
                ctx.stroke();
            }

            // 2. Draw Slot Content
            if (isRare) {
                // Background tint
                ctx.fillStyle = "rgba(255, 215, 0, 0.15)";
                ctx.fillRect(slotLeft, CANVAS_HEIGHT - 60, currentSlotWidth, 60);

                // "Thin" text styling
                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 8px Arial"; // Smaller font for thin slot
                const textY = CANVAS_HEIGHT - 35;
                ctx.fillText("RARE", centerX, textY);
                ctx.fillText("BORDER", centerX, textY + 10);
            } else {
                ctx.fillStyle = Number(m) > 0 ? "#ffd700" : "#666";
                ctx.font = "bold 14px Arial";
                ctx.fillText(m.toString(), centerX, CANVAS_HEIGHT - 25);
            }

            // Move the offset for the next slot
            currentXOffset += currentSlotWidth;
        });
    }, []);

    const startGame = () => {
        if (isPlaying || isSubmitting) return;
        setReturnResponse(null);
        setIsPlaying(true);
        const margin = CANVAS_WIDTH * 0.2;
        const spawnRange = CANVAS_WIDTH - (margin * 2);
        const randomX = margin + (Math.random() * spawnRange);

        ballPos.current = {
            x: randomX,
            y: 30
        };

        ballVel.current = { x: 0, y: 0 };
        animate();
    };

    const animate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        ballVel.current.y += 0.35;
        ballPos.current.x += ballVel.current.x;
        ballPos.current.y += ballVel.current.y;
        ballVel.current.x *= 0.98;

        for (let r = 0; r < ROWS; r++) {
            for (let i = 0; i < PEGS_IN_ROW; i++) {
                const offsetX = (r % 2 === 0) ? 0 : 25;
                const px = 50 + i * 45 + offsetX;
                const py = 80 + r * 45;

                const dx = ballPos.current.x - px;
                const dy = ballPos.current.y - py;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 12) {
                    const angle = Math.atan2(dy, dx);
                    const speed = Math.sqrt(ballVel.current.x ** 2 + ballVel.current.y ** 2);
                    ballVel.current.x = Math.cos(angle) * speed * 0.6 + (Math.random() - 0.5) * 2;
                    ballVel.current.y = Math.sin(angle) * speed * 0.6;
                    ballPos.current.x = px + Math.cos(angle) * 12.5;
                    ballPos.current.y = py + Math.sin(angle) * 12.5;
                }
            }
        }

        if (ballPos.current.x < 10 || ballPos.current.x > CANVAS_WIDTH - 10) {
            ballVel.current.x *= -0.5;
            ballPos.current.x = ballPos.current.x < 10 ? 10 : CANVAS_WIDTH - 10;
        }

        if (ballPos.current.y > CANVAS_HEIGHT - 80) {
            MULTIPLIERS.forEach((_, i) => {
                const dividerX = i * (CANVAS_WIDTH / MULTIPLIERS.length);
                if (i === 0) return;

                const dx = ballPos.current.x - dividerX;
                if (Math.abs(dx) < 8) {
                    ballVel.current.x *= -0.5;
                    ballPos.current.x = dividerX + (dx > 0 ? 8 : -8);
                }
            });
        }

        drawBoard(ctx);
        ctx.fillStyle = "#ff0055";
        ctx.beginPath();
        ctx.arc(ballPos.current.x, ballPos.current.y, 7, 0, Math.PI * 2);
        ctx.fill();

        if (ballPos.current.y > CANVAS_HEIGHT - 8) {
            const slotWidth = CANVAS_WIDTH / MULTIPLIERS.length;
            const slotIndex = Math.floor(ballPos.current.x / slotWidth);
            const targetCenterX = (slotIndex * slotWidth) + (slotWidth / 2);
            const distanceToCenter = targetCenterX - ballPos.current.x;

            ballPos.current.y = CANVAS_HEIGHT - 18;

            if (Math.abs(distanceToCenter) > 1) {
                ballPos.current.x += distanceToCenter * 0.2;
                drawBoard(ctx);
                ctx.fillStyle = "#ff0055";
                ctx.beginPath();
                ctx.arc(ballPos.current.x, ballPos.current.y, 7, 0, Math.PI * 2);
                ctx.fill();

                animationFrame.current = requestAnimationFrame(animate);
            } else {
                const score = MULTIPLIERS[Math.min(slotIndex, MULTIPLIERS.length - 1)];
                cancelAnimationFrame(animationFrame.current!);
                setIsPlaying(false);
                SubmitResult(score.toString());
            }
        } else {
            animationFrame.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) drawBoard(ctx);
    }, [drawBoard]);

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
                usingActualAPs: dailyFreeSpin === "TAKEN" ? 2 : null,
                gameService: 'plinko_game'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setReturnResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#play_plinko_game_${id}`).modal('hide');

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
        $(`#play_plinko_game_${id}`).modal('hide');
        callbackFunction(returnResponse !== null);
    };

    return (
        <>
            <MessageAlertPopup />

            <ModalTemplate
                id={`play_plinko_game_${id}`}
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
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <div className="game-container p-2 bg-dark">
                            <canvas
                                ref={canvasRef}
                                width={CANVAS_WIDTH}
                                height={CANVAS_HEIGHT}
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>

                        <div className="mt-3 w-100">
                            <button
                                className='btn btn-danger btn-sm elevation-1 custom-border-dark custom-bg-maroon text-white w-100 py-2'
                                disabled={isPlaying || isSubmitting || isFetching || userData?.total_points < 2}
                                onClick={startGame}
                            >
                                {isPlaying ? 'DROPPING...' : userData?.total_points >= 2 ? (dailyFreeSpin === 'PENDING' ? 'FREE DAILY PLAY' : 'PLAY FOR 2 AP') : 'INSUFFICIENT APs'}
                            </button>
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
                    </div >
                }
                footerClassName="border-0 pb-0"
                footer={
                    <div className="w-100 text-center" >
                        <hr className="style-two" />
                        <button type='button' disabled={isPlaying || isSubmitting || isFetching} className='btn btn-dark btn-sm custom-border-dark' onClick={handleClose} >
                            Close
                        </button>
                    </div>
                }
            />
        </>
    );
}