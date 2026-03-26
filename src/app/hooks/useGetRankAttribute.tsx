export default function useGetRankAttribute() {
    const getRankAttribute = (points: number | '∞' | 'Ω', showLabel: boolean = true, showEmblem: boolean = true) => {
        let tierName = "Novice";
        let tierColor = "cyan";
        let iconPath = "/system-images/ranks/1._NOVICE_v1.png";

        const isOmega = points === 'Ω';
        const isSuperior = points === '∞';
        const isArchitect = typeof points === 'number' && points >= 5000;

        if (isOmega) {
            tierName = "Supreme";
            tierColor = "#f0a210";
            iconPath = "/system-images/ranks/7._SUPREME_v1.png";
        } else if (isSuperior) {
            tierName = "Superior";
            tierColor = "#dcd935";
            iconPath = "/system-images/ranks/6._SUPERIOR_v1.png";
        } else if (isArchitect) {
            tierName = "Architect";
            tierColor = "rgb(0, 81, 128)";
            iconPath = "/system-images/ranks/5._ARCHITECT_v1.png";
        } else if (typeof points === 'number' && points >= 3000) {
            tierName = "Lead";
            tierColor = "#ffc107";
            iconPath = "/system-images/ranks/4._LEAD_v1.png";
        } else if (typeof points === 'number' && points >= 1500) {
            tierName = "Specialist";
            tierColor = "purple";
            iconPath = "/system-images/ranks/3._SPECIALIST_v1.png";
        } else if (typeof points === 'number' && points >= 500) {
            tierName = "Contributor";
            tierColor = "brown";
            iconPath = "/system-images/ranks/2._CONTRIBUTOR_v1.png";
        }

        return (
            <div
                className={isSuperior ? "superior-fire-container" : isOmega ? "supreme-king-container" : ""}
                style={{
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    position: 'relative',
                    padding: '5px 12px',
                    borderRadius: '12px',
                    overflow: 'visible',
                    background: isOmega
                        ? 'radial-gradient(circle, rgba(240, 150, 16, 0.25) 0%, rgba(240, 162, 16, 0.05) 70%, transparent 100%)'
                        : isSuperior
                            ? 'radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, rgba(220, 217, 53, 0.1) 60%, transparent 100%)'
                            : 'transparent',
                }}
            >
                <style>
                    {`
                        /* Superior Fire */
                        @keyframes fire-flicker {
                            0% { filter: drop-shadow(0px 0px 4px #ff4500) drop-shadow(0px 0px 8px #dcd935); transform: scale(1); }
                            50% { filter: drop-shadow(0px -4px 12px #ff8c00) drop-shadow(0px 0px 20px #dcd935); transform: scale(1.05); }
                            100% { filter: drop-shadow(0px 0px 4px #ff4500) drop-shadow(0px 0px 8px #dcd935); transform: scale(1); }
                        }

                        /* Supreme Royal Aura */
                        @keyframes royal-pulse {
                            0% { filter: drop-shadow(0px 0px 8px #f01048) drop-shadow(0px 0px 2px #fff); transform: scale(1); }
                            50% { filter: drop-shadow(0px 0px 18px #f01048) drop-shadow(0px 0px 10px #7b0a26); transform: scale(1.08); }
                            100% { filter: drop-shadow(0px 0px 8px #f01048) drop-shadow(0px 0px 2px #fff); transform: scale(1); }
                        }

                        /* Rising Embers/Sparks */
                        @keyframes sparks-rising {
                            0% { transform: translateY(10px) scale(0); opacity: 0; }
                            50% { opacity: 0.8; }
                            100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
                        }

                        .superior-fire-container::before, .superior-fire-container::after,
                        .supreme-king-container::before, .supreme-king-container::after {
                            content: "";
                            position: absolute;
                            width: 5px;
                            height: 5px;
                            border-radius: 50%;
                            filter: blur(1px);
                            z-index: 1;
                        }

                        /* Fire Sparks */
                        .superior-fire-container::before { left: 20%; background: #ffae00; animation: sparks-rising 1.2s infinite ease-out; }
                        .superior-fire-container::after { left: 40%; background: #ff4500; animation: sparks-rising 1.8s infinite ease-out 0.5s; }

                        /* Royal Embers */
                        .supreme-king-container::before { left: 25%; background: #f01048; animation: sparks-rising 1s infinite ease-out; }
                        .supreme-king-container::after { left: 45%; background: #fff; animation: sparks-rising 1.5s infinite ease-out 0.3s; }

                        @keyframes architect-pulse {
                            0% { filter: drop-shadow(0px 0px 5px #dc3545); }
                            50% { filter: drop-shadow(0px 0px 15px #dc3545); }
                            100% { filter: drop-shadow(0px 0px 5px #dc3545); }
                        }
                    `}
                </style>

                {
                    showEmblem &&
                    <img
                        src={iconPath}
                        alt={tierName}
                        style={{
                            width: '38px',
                            height: '38px',
                            objectFit: 'contain',
                            zIndex: 2,
                            animation: isOmega
                                ? 'royal-pulse 1.5s infinite ease-in-out'
                                : isSuperior
                                    ? 'fire-flicker 0.8s infinite alternate ease-in-out'
                                    : isArchitect
                                        ? 'architect-pulse 2s infinite ease-in-out'
                                        : 'none',
                        }}
                    />

                }

                {
                    showLabel &&
                    <div className="ml-2" style={{ display: 'flex', flexDirection: 'column', zIndex: 2 }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '900',
                            color: tierColor,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textShadow: isOmega
                                ? '0px 0px 15px rgba(240, 16, 72, 0.7)'
                                : isSuperior ? '0px 0px 12px #ff8c00' : 'none'
                        }}>
                            {tierName}
                        </span>
                        <span style={{
                            fontSize: '0.65rem',
                            color: (isSuperior || isOmega) ? '#fff' : '#adb5bd',
                            fontWeight: (isSuperior || isOmega) ? 'bold' : 'normal',
                            textShadow: (isSuperior || isOmega) ? '0px 0px 5px #000' : 'none'
                        }}>
                            {points === 'Ω' ? 'ABSOLUTE AURA' : points === '∞' ? 'INFINITE AURA' : `${points.toLocaleString()} pts`}
                        </span>
                    </div>
                }
            </div>
        );
    };

    return { getRankAttribute };
}