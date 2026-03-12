import ArchitectRankWithBanner from "../custom-global-components/CustomRanksWithBanner/Architect/ArchitectRankWithBanner";
import ContributorRankWithBanner from "../custom-global-components/CustomRanksWithBanner/Contributor/ContributorRankWithBanner";
import LeadRankWithBanner from "../custom-global-components/CustomRanksWithBanner/Lead/LeadRankWithBanner";
import NoviceRankWithBanner from "../custom-global-components/CustomRanksWithBanner/Novice/NoviceRankWithBanner";
import SpecialistRankWithBanner from "../custom-global-components/CustomRanksWithBanner/Specialist/SpecialistRankWithBanner";
import SuperiorRankWithBanner from "../custom-global-components/CustomRanksWithBanner/Superior/SuperiorRankWithBanner";
import SupremeRankWithBanner from "../custom-global-components/CustomRanksWithBanner/Supreme/SupremeRankWithBanner";

export default function useGetRankAttribute2() {
    const omegaGold = '#ffac33'; // Deep Gold
    const superiorSilver = '#e0e0e0'; // Metallic Silver

    const getRankAttribute = (points: number | '∞' | 'Ω') => {
        const thresholds = [
            { name: "Novice", min: 0, color: "cyan", icon: "1._NOVICE_v1.png" },
            { name: "Contributor", min: 500, color: "brown", icon: "2._CONTRIBUTOR_v1.png" },
            { name: "Specialist", min: 1500, color: "purple", icon: "3._SPECIALIST_v1.png" },
            { name: "Lead", min: 3000, color: "red", icon: "4._LEAD_v1.png" },
            { name: "Architect", min: 5000, color: "rgb(0, 81, 128)", icon: "5._ARCHITECT_v1.png" },
        ];

        let tierName = "Novice";
        let tierColor = "#6c757d";
        let iconPath = "/system-images/ranks/1._NOVICE_v1.png";
        let nextRankInfo = "";
        let progressPercent = 0;
        let range = 0;
        let nextTierIcon = "";

        const isOmega = points === 'Ω';
        const isSuperior = points === '∞';

        if (isOmega) {
            tierName = "Supreme";
            tierColor = "#f01048";
            iconPath = "/system-images/ranks/7._SUPREME_v1.png";
            nextRankInfo = "MAXIMUM AUTHORITY REACHED";
            progressPercent = 100;
        } else if (isSuperior) {
            tierName = "Superior";
            tierColor = "#dcd935";
            iconPath = "/system-images/ranks/6._SUPERIOR_v1.png";
            nextRankInfo = "BEYOND MEASURABLE LIMITS";
            progressPercent = 100;
        }
        else if (typeof points === 'number') {
            const currentTierIndex = [...thresholds].reverse().findIndex(t => points >= t.min);
            const actualIndex = thresholds.length - 1 - currentTierIndex;
            const currentTier = thresholds[actualIndex];

            tierName = currentTier.name;
            tierColor = currentTier.color;
            iconPath = `/system-images/ranks/${currentTier.icon}`;

            const nextTier = thresholds[actualIndex + 1];
            if (nextTier) {
                nextTierIcon = `/system-images/ranks/${nextTier.icon}`;
                range = nextTier.min - currentTier.min;
                const earned = points - currentTier.min;
                progressPercent = Math.min(Math.max((earned / range) * 100, 0), 100);
                nextRankInfo = `${currentTier.min.toLocaleString()} — ${nextTier.min.toLocaleString()} pts to reach ${nextTier.name}`;
            } else {
                nextRankInfo = "5,000+ pts | Approach ∞ to ascend";
                progressPercent = 100;
            }
        }

        return (
            <div>
                {isOmega && <SupremeRankWithBanner />}
                {isSuperior && <SuperiorRankWithBanner />}
                {tierName === 'Novice' && <NoviceRankWithBanner />}
                {tierName === 'Contributor' && <ContributorRankWithBanner />}
                {tierName === 'Specialist' && <SpecialistRankWithBanner />}
                {tierName === 'Lead' && <LeadRankWithBanner />}
                {tierName === 'Architect' && <ArchitectRankWithBanner />}

                {
                    (!isOmega && !isSuperior) ?
                        <div style={{ marginTop: '45px', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
                                <img src={iconPath} style={{ width: '40px', height: '40px', opacity: 0.8 }} alt="current" />

                                <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', position: 'relative' }}>

                                    {/* Floating Percentage Label */}
                                    <div style={{
                                        position: 'absolute',
                                        left: `${progressPercent}%`,
                                        top: '-35px',
                                        transform: 'translateX(-50%)',
                                        background: tierColor,
                                        color: '#fff',
                                        padding: '2px 10px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '900',
                                        transition: 'left 1s ease-in-out',
                                        boxShadow: `0 0 15px ${tierColor}`,
                                        whiteSpace: 'nowrap',
                                        zIndex: 10
                                    }}>
                                        {points}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-4px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 0, height: 0,
                                            borderLeft: '5px solid transparent',
                                            borderRight: '5px solid transparent',
                                            borderTop: `5px solid ${tierColor}`
                                        }} />
                                    </div>

                                    {/* Actual Progress Filler */}
                                    <div style={{
                                        width: `${progressPercent}%`,
                                        height: '100%',
                                        background: tierColor,
                                        borderRadius: '6px',
                                        boxShadow: `0 0 20px ${tierColor}`,
                                        transition: 'width 1s ease-in-out'
                                    }} />
                                </div>

                                {nextTierIcon ? (
                                    <img src={nextTierIcon} style={{ width: '40px', height: '40px', opacity: 0.4, filter: 'grayscale(1)' }} alt="next" />
                                ) : (
                                    <span style={{ fontSize: '1.5rem', opacity: 0.5, color: '#fff' }}>∞</span>
                                )}
                            </div>
                        </div> : <>
                            <hr className="style-two" />

                            <div style={{
                                marginTop: '10px',
                                textAlign: 'center',
                                padding: '10px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)'
                            }}>
                                <div style={{
                                    fontSize: '100%',
                                    fontWeight: '900',
                                    letterSpacing: '4px',
                                    color: isOmega ? omegaGold : superiorSilver,
                                    textShadow: isOmega
                                        ? `0 0 10px rgba(255, 172, 51, 0.8), 0 0 20px rgba(255, 172, 51, 0.4), 0 0 30px rgba(255, 69, 0, 0.3)`
                                        : `0 0 10px rgba(224, 224, 224, 0.8), 0 0 20px rgba(224, 224, 224, 0.4), 0 0 30px rgba(255, 255, 255, 0.2)`,
                                    textTransform: 'uppercase',
                                    fontFamily: '"Rajdhani", sans-serif',
                                    animation: 'pulse 2s infinite ease-in-out'
                                }}>
                                    {isOmega ? '— Absolute Aura —' : '— Infinite Aura —'}
                                </div>
                                <div style={{
                                    fontSize: '70%',
                                    color: 'rgba(255,255,255,0.5)',
                                    marginTop: '5px',
                                    letterSpacing: '2px'
                                }}>
                                    {isOmega ? 'THE ABYSS HAS BEEN RULED' : 'BEYOND MEASURABLE LIMITS'}
                                </div>
                            </div>
                        </>
                }

            </div>
        );
    };

    return { getRankAttribute };
}