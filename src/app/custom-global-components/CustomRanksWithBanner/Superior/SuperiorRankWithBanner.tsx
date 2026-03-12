import './SuperiorRankWithBanner.css';

interface SuperiorRankWithBannerProps {
    height?: number,
    width?: number
}

export default function SuperiorRankWithBanner({ height = 50, width = 50 }: SuperiorRankWithBannerProps) {
    return (
        <>
            <div id="superior-container">
                <img loading='eager' src="/system-images/ranks/6._SUPERIOR_v1.png" id="superior-rank" className="img-fluid" alt="" />
            </div>
        </>
    );
}