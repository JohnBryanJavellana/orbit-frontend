'use client';

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import { useEffect, useState, useCallback } from "react";
import useWebToken from "@/app/hooks/useWebToken";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import { useRouter } from "next/navigation";
import axios from "axios";
import useGetCurrentUser from '@/app/hooks/useGetCurrentUser';
import './ModalPlayColorGame.css';
import useMessageAlertPopup from "@/app/hooks/useMessageAlertPopup";
import Confetti from "react-confetti-boom";

interface Card {
    id: number;
    color: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFF333', '#33FFF3'];

export default function ModalPlayColorGame({ id, titleHeader, callbackFunction }: any) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);
    const [dailyFreeSpin, setDailyFreeSpin] = useState<string | 'PENDING' | 'TAKEN' | ''>('PENDING');
    const { setMessageAlert, setCallbackFunction, MessageAlertPopup } = useMessageAlertPopup();
    const { getToken } = useWebToken();
    const { urlWithApi } = useSystemURLCon();
    const navigate = useRouter();
    const { userData, refreshUser } = useGetCurrentUser();
    const [returnResponse, setReturnResponse] = useState<any | null>(null);

    const SubmitResult = async (score: string) => {
        try {
            setIsSubmitting(true);
            setCallbackFunction({ callbackFunction: () => { } });
            setMessageAlert({
                message: null,
                status: null
            });

            const token = getToken('csrf-token');
            const response = await axios.post(`${urlWithApi}/member/daily-activities/daily-activities/save_color_game_score`, {
                score: score,
                usingActualAPs: dailyFreeSpin === "TAKEN" ? 5 : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReturnResponse(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 500) {
                    setMessageAlert({
                        message: error.response?.data.message,
                        status: 'ERROR'
                    });
                } else {
                    $(`#play_cup_shuffle_${id}`).modal('hide');
                    navigate.push('/access-denied')
                };
            }
        } finally {
            await refreshUser();
            setDailyFreeSpin('TAKEN');
            setIsSubmitting(false);
        }
    }

    const CheckForFreeDailySpin = async (isInitialLoad: boolean) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('csrf-token');
            const response = await axios.get(`${urlWithApi}/member/daily-activities/daily-activities/get_daily_activities`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDailyFreeSpin(response.data.activities.colorGame);
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

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (timeLeft > 0 && isPlaying && !isGameOver) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsGameOver(true);
            setIsPlaying(false);
            SubmitResult('0');
        }
        return () => clearTimeout(timer);
    }, [timeLeft, isPlaying, isGameOver]);

    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched)) {
            setIsPlaying(false);
            handleWin();
        }
    }, [cards]);

    const handleWin = () => {
        SubmitResult('10');
    };

    const initializeGame = useCallback(() => {
        const deck = [...COLORS, ...COLORS]
            .sort(() => Math.random() - 0.5)
            .map((color, index) => ({
                id: index,
                color,
                isFlipped: false,
                isMatched: false,
            }));

        setReturnResponse(null);
        setCards(deck);
        setFlippedCards([]);
        setTimeLeft(60);
        setIsGameOver(false);
        setIsPlaying(true);
    }, []);

    const handleFlip = (cardId: number) => {
        if (!isPlaying || isProcessing || cards[cardId].isFlipped || cards[cardId].isMatched) return;

        const newCards = [...cards];
        newCards[cardId].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, cardId];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setIsProcessing(true);
            checkMatch(newFlipped);
        }
    };

    const checkMatch = (currentlyFlipped: number[]) => {
        const [first, second] = currentlyFlipped;
        const newCards = [...cards];

        if (newCards[first].color === newCards[second].color) {
            newCards[first].isMatched = true;
            newCards[second].isMatched = true;
            setCards(newCards);
            setFlippedCards([]);
            setIsProcessing(false);
        } else {
            setTimeout(() => {
                newCards[first].isFlipped = false;
                newCards[second].isFlipped = false;
                setCards(newCards);
                setFlippedCards([]);
                setIsProcessing(false);
            }, 800); // Slightly faster flip back for better UX
        }
    };

    const handleClose = () => {
        $(`#play_color_game_${id}`).modal('hide');
        callbackFunction(null);
    };

    const percentageRemaining = (timeLeft / 60) * 100;
    const isCritical = timeLeft <= 5;

    return (
        <ModalTemplate
            id={`play_color_game_${id}`}
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
            bodyClassName="pb-0"
            body={
                <div className="w-100 px-3" style={{ userSelect: 'none', overflow: 'hidden' }}>
                    <div className="text-center mb-4">
                        <h5>Match all colors to win <span className="gold-text">10 APs</span></h5>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className={`text-xs ${isCritical ? 'text-danger animate-pulse' : 'text-muted'}`}>
                            {timeLeft}s remaining
                        </span>
                        <span className="text-xs text-muted">{Math.round(percentageRemaining)}%</span>
                    </div>

                    <div className="progress-container mb-3">
                        <div
                            className={`progress-fill ${isCritical ? 'bg-danger-glow' : 'bg-gold-glow'}`}
                            style={{ width: `${percentageRemaining}%` }}
                        ></div>
                    </div>

                    <div className="game-grid-wrapper" style={{ position: 'relative' }}>
                        <div className="game-grid">
                            {cards.map((card) => (
                                <div key={card.id} className={`color-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`} onClick={() => handleFlip(card.id)}>
                                    <div className="card-inner">
                                        <div className="card-front">
                                            <span style={{ opacity: 0.2 }}>?</span>
                                        </div>
                                        <div className="card-back" style={{ backgroundColor: card.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(isGameOver || !isPlaying) && (
                            <div className="game-overlay d-flex flex-column align-items-center justify-content-center">
                                <h4 className={isGameOver ? "text-danger" : "text-gold"}>
                                    {isGameOver ? "TIME'S UP!" : "READY?"}
                                </h4>
                                <p className="text-xs text-muted mb-2 text-center">
                                    {isGameOver ? "Better luck next time!" : "Match all pairs before time runs out."}
                                </p>

                                <button
                                    className={`btn ${isGameOver ? 'btn-danger' : 'btn-warning'} btn-sm px-4`}
                                    onClick={initializeGame}
                                    disabled={isFetching || !userData || userData?.total_points < 5}
                                >
                                    {isGameOver || dailyFreeSpin === 'TAKEN' ? 'RETRY FOR 5 APs' : dailyFreeSpin === 'PENDING' ? 'START FREE TRIAL' : "START GAME"}
                                </button>
                            </div>
                        )}
                    </div>

                    {returnResponse && (
                        <div className="response-message mt-4 text-center">
                            <h4 className={returnResponse.points_added > 0 ? 'text-success-gold' : 'text-danger-fade'}>
                                {returnResponse.message}
                            </h4>
                        </div>
                    )}

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
                    <button type='button' disabled={isPlaying || isSubmitting || isFetching} className='btn btn-dark btn-sm mr-1 custom-border-dark' onClick={handleClose}>
                        CLOSE
                    </button>
                </div>
            }
        />
    );
}