import './NoviceRankWithBanner.css';

interface NoviceRankWithBannerProps {
    height?: number,
    width?: number
}

export default function NoviceRankWithBanner({ height = 50, width = 50 }: NoviceRankWithBannerProps) {
    return (
        <>
            <div id="novice-container">
                <img loading='eager' src="/system-images/ranks/1._NOVICE_v1.png" id="novice-rank" className="img-fluid" alt="" />
            </div>
        </>
    );
}