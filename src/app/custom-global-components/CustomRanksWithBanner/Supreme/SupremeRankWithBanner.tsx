import './SupremeRankWithBanner.css';

interface SupremeRankWithBannerProps {
    height?: number,
    width?: number
}

export default function SupremeRankWithBanner({ height = 50, width = 50 }: SupremeRankWithBannerProps) {
    return (
        <>
            <div id="supreme-container">
                <img loading='eager' src="/system-images/ranks/7._SUPREME_v1.png" id="supreme-rank" className="img-fluid" alt="" />
            </div>
        </>
    );
}