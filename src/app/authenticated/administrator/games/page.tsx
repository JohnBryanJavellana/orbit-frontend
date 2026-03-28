'use client';

import '../../member/leaderboard/components/ProfileParchment.css';
import './games.css';
import { useRef, useState, MouseEvent } from 'react';
import ModalPlayCupShuffle from './DailyGames/ModalPlayCupShuffle';
import ModalPlayColorGame from './DailyGames/ModalPlayColorGame';
import ModalPlayPlinko from './DailyGames/ModalPlayPlinko';
import ModalPlayRoulette from './DailyGames/ModalPlayRoulette';
import ModalPlayHighOrLow from './DailyGames/ModalPlayHighOrLow';

interface Props { }

const Games = ({ }: Props) => {
    const [modalOpenData, setModalOpenData] = useState<any>(null);
    const [modalOpenId, setModalOpenId] = useState<null | number>(null);
    const [modalOpenIndex, setModalOpenIndex] = useState<null | number>(null);
    const divRef = useRef<HTMLDivElement | null>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        divRef.current.style.setProperty("--mouse-x", `${x}px`);
        divRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    return <div>
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
            <ModalPlayColorGame
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={'Color Game'}
                callbackFunction={() => {
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        {
            modalOpenIndex === 2 &&
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

        {
            modalOpenIndex === 3 &&
            <ModalPlayPlinko
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={'Plinko Game'}
                callbackFunction={() => {
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        {
            modalOpenIndex === 4 &&
            <ModalPlayHighOrLow
                data={modalOpenData}
                id={modalOpenId}
                titleHeader={'High or Low Game'}
                callbackFunction={() => {
                    setModalOpenData(null);
                    setModalOpenId(null);
                    setModalOpenIndex(null);
                }}
            />
        }

        <h3 className='text-bold'>Play Games</h3>

        <div className="row my-3 mb-5">
            <div className="col-xl-12 mb-3">
                <div ref={divRef} onMouseMove={handleMouseMove} className="spotlight-card rounded-lg elevation-1">
                    <img src={'/system-images/game-assets/game-banner.png'} className='img-fluid' />
                </div>
            </div>

            <div className="parchment-card col-6 col-xl-2 mb-2 position-relative pc" onClick={() => {
                setModalOpenData(null);
                setModalOpenId(0);
                setModalOpenIndex(0);
            }} data-toggle="modal" data-target={`#play_roulette_0`} >
                <img src={'/system-images/game-assets/wheel-of-fortune.jpg'} className='img-fluid elevation-1 rounded-lg' />
                <div className='banner-name pl-3 pt-2'>Wheel of Fortune</div>
            </div>

            <div className="parchment-card col-6 col-xl-2 mb-2 position-relative pc" onClick={() => {
                setModalOpenData(null);
                setModalOpenId(1);
                setModalOpenIndex(1);
            }} data-toggle="modal" data-target={`#play_color_game_1`} >
                <img src={'/system-images/game-assets/color-game.png'} className='img-fluid elevation-1 rounded-lg' />
                <div className='banner-name pl-3 pt-2'>Color Game</div>
            </div>

            <div className="parchment-card col-6 col-xl-2 mb-2 position-relative pc" onClick={() => {
                setModalOpenData(null);
                setModalOpenId(2);
                setModalOpenIndex(2);
            }} data-toggle="modal" data-target={`#play_cup_shuffle_2`} >
                <img src={'/system-images/game-assets/cup-shuffle.png'} className='img-fluid elevation-1 rounded-lg' />
                <div className='banner-name pl-3 pt-2'>Cup Shuffle</div>
            </div>

            <div className="parchment-card col-6 col-xl-2 mb-2 position-relative pc" onClick={() => {
                setModalOpenData(null);
                setModalOpenId(3);
                setModalOpenIndex(3);
            }} data-toggle="modal" data-target={`#play_plinko_game_3`} >
                <img src={'/system-images/game-assets/plinko.jpg'} className='img-fluid elevation-1 rounded-lg' />
                <div className='banner-name pl-3 pt-2'>Plinko</div>
            </div>

            <div className="parchment-card col-6 col-xl-2 mb-2 position-relative pc" onClick={() => {
                setModalOpenData(null);
                setModalOpenId(4);
                setModalOpenIndex(4);
            }} data-toggle="modal" data-target={`#play_high_or_low_4`} >
                <img src={'/system-images/game-assets/high-or-low.png'} className='img-fluid elevation-1 rounded-lg' />
                <div className='banner-name pl-3 pt-2'>High or Low</div>
            </div>

            <div className="parchment-card col-6 col-xl-2 mb-2 position-relative pc" onClick={() => {
                setModalOpenData(null);
                setModalOpenId(5);
                setModalOpenIndex(5);
            }} data-toggle="modal" data-target={`#play_rock_paper_scissor_5`} >
                <img src={'/system-images/game-assets/rock-paper-scissor.png'} className='img-fluid elevation-1 rounded-lg' />
                <div className='banner-name pl-3 pt-2'>Rock, Paper & Scissor</div>
            </div>
        </div>
    </div>
}

export default Games;