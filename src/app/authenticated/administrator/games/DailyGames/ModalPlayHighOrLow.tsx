'use client';

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useEffect, useState, useRef, useCallback } from "react";
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { useRouter } from "next/navigation";
import axios from "axios";
import useGetCurrentUser from '@/app/hooks/useGetCurrentUser';
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";
import Confetti from "react-confetti-boom";

// --- Game Constants & Logic ---
const SUITS = ['♠', '♣', '♥', '♦'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const VALUE_MAP: { [key: string]: number } = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

interface Card {
    suit: string;
    value: string;
    rank: number;
}

export default function ModalPlayHighOrLow({ id, titleHeader, callbackFunction }: any) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [deck, setDeck] = useState<Card[]>([]);
    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [nextCard, setNextCard] = useState<Card | null>(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'WON'>('IDLE');

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState(false);
    const [dailyFreeSpin, setDailyFreeSpin] = useState<string | 'PENDING' | 'TAKEN' | ''>('PENDING');
    const [returnResponse, setReturnResponse] = useState<any | null>(null);
    const { setMessageAlert, MessageAlertPopup, setCallbackFunction } = useMessageAlertPopup();
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData, refreshUser } = useGetCurrentUser();

    const drawCard = useCallback((ctx: CanvasRenderingContext2D, card: Card | null, x: number, y: number, isHidden: boolean = false) => {
        const w = 100;
        const h = 140;
        const radius = 2;

        ctx.fillStyle = isHidden ? '#2c3e50' : 'white';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();
        ctx.stroke();

        if (isHidden) {
            // Draw Pattern for hidden card
            ctx.strokeStyle = '#34495e';
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 10);
            ctx.lineTo(x + w - 10, y + h - 10);
            ctx.stroke();
            return;
        }

        if (card) {
            const color = (card.suit === '♥' || card.suit === '♦') ? '#e74c3c' : '#2c3e50';
            ctx.fillStyle = color;
            ctx.font = 'bold 20px Arial';
            ctx.fillText(card.value, x + 15, y + 25);
            ctx.font = '24px Arial';
            ctx.fillText(card.suit, x + 15, y + 55);

            // Large center suit
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(card.suit, x + w / 2, y + h / 2 + 15);
            ctx.textAlign = 'start';
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawCard(ctx, currentCard, 50, 30, !currentCard);
        drawCard(ctx, nextCard, 200, 30, gameState === 'PLAYING' && !nextCard);

        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("Current Card", 100, 190);
        ctx.fillText("Next Card", 250, 190);
    }, [currentCard, nextCard, gameState, drawCard]);

    const createDeck = () => {
        let newDeck: Card[] = [];
        SUITS.forEach(suit => {
            VALUES.forEach(value => {
                newDeck.push({ suit, value, rank: VALUE_MAP[value] });
            });
        });
        return newDeck.sort(() => Math.random() - 0.5);
    };

    const startGame = () => {
        setReturnResponse(null);

        const newDeck = createDeck();
        const firstCard = newDeck.pop()!;
        setDeck(newDeck);
        setCurrentCard(firstCard);
        setNextCard(null);
        setScore(0);
        setGameState('PLAYING');
    };

    const handleGuess = async (guess: 'HIGH' | 'LOW') => {
        if (gameState !== 'PLAYING' || !deck.length) return;

        const drawnCard = [...deck].pop()!;
        const remainingDeck = deck.slice(0, -1);

        setNextCard(drawnCard);
        setDeck(remainingDeck);

        const isWin = guess === 'HIGH'
            ? drawnCard.rank >= currentCard!.rank
            : drawnCard.rank <= currentCard!.rank;

        setGameState('GAMEOVER');
        SubmitResult(isWin ? '7' : '0');
    };

    const SubmitResult = async (finalScore: string) => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/member/daily-activities/daily-activities/save_game_r_cs_cg_score`, {
                score: finalScore,
                usingActualAPs: dailyFreeSpin === "TAKEN" ? 5 : null,
                gameService: 'high_or_low'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReturnResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                $(`#play_high_or_low_${id}`).modal('hide');

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
            setDailyFreeSpin('TAKEN');
            setIsSubmitting(false);
            await refreshUser();
        }
    };

    const CheckForFreeDailySpin = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/member/daily-activities/daily-activities/get_daily_activities`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDailyFreeSpin(response.data.activities.highOrLow);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if (userData) CheckForFreeDailySpin(true);
    }, [userData]);

    const handleClose = () => {
        $(`#play_high_or_low_${id}`).modal('hide');
        callbackFunction(null);
    };

    return (
        <>
            <MessageAlertPopup />

            <ModalTemplate
                id={`play_high_or_low_${id}`}
                size={"md"}
                modalParentStyle="bg-stack"
                isModalCentered
                modalContentClassName="text-white custom-modal-dialog"
                headerClassName="border-0 pb-0"
                header={
                    <div className="w-100">
                        <div className="text-sm text-bold text-center w-100">{titleHeader}</div>
                        <hr className="style-two" />
                    </div>
                }
                bodyClassName="pb-0"
                body={
                    <div className="d-flex flex-column align-items-center">
                        <div className="text-center mb-4">
                            <h5>Play & Win to get <span className="gold-text">7 APs</span></h5>
                        </div>

                        {returnResponse && (
                            <>
                                <div className="text-center mb-4">
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

                        <canvas ref={canvasRef} width={350} height={220} className="mb-3" style={{
                            background: 'rgba(255,255,255,0.05)'
                        }} />

                        {gameState === 'IDLE' || gameState === 'GAMEOVER' ? (
                            <button className="btn btn-warning btn-sm custom-border-dark elevation-1" onClick={() => startGame()} disabled={isFetching || isSubmitting || (dailyFreeSpin === 'TAKEN' && userData?.total_points < 5)}>
                                {userData?.total_points >= 5 ? (dailyFreeSpin === 'PENDING' ? 'FREE DAILY PLAY' : 'PLAY AGAIN FOR 5 AP') : 'INSUFFICIENT APs'}
                            </button>
                        ) : (
                            <>
                                <div className="mb-2">Will the next card be Higher or Lower?</div>

                                <div className="d-flex align-items-center justify-content-center">
                                    <button className="btn btn-success btn-sm custom-border-dark elevation-1" onClick={() => handleGuess('HIGH')}>
                                        HIGHER ↑
                                    </button>

                                    <button className="btn btn-danger btn-sm custom-border-dark elevation-1 mx-2" onClick={() => handleGuess('LOW')}>
                                        LOWER ↓
                                    </button>

                                    <button className="btn btn-dark btn-sm custom-border-dark elevation-1" onClick={() => {
                                        SubmitResult('0');
                                        setGameState('GAMEOVER');
                                    }}>
                                        Cancel (-5 APs)
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                }
                footerClassName="border-0"
                footer={
                    <div className="w-100 text-center">
                        <hr className="style-two" />
                        <button type='button' disabled={gameState === 'PLAYING' || isSubmitting} className='btn btn-dark btn-sm custom-border-dark' onClick={handleClose}>
                            CLOSE
                        </button>
                    </div>
                }
            />
        </>
    );
}