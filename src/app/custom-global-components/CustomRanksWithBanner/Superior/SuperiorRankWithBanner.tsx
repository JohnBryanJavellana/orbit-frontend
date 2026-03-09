import './SuperiorRankWithBanner.css';

interface SuperiorRankWithBannerProps {
    height?: number,
    width?: number
}

export default function SuperiorRankWithBanner({ height = 50, width = 50 }: SuperiorRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="superior-container">
                <img loading='eager' src="/system-images/banner/6._SUPERIOR_BANNER_v1.png" id="superior-banner" className="img-fluid" alt="" />
                <img loading='eager' src="/system-images/ranks/6._SUPERIOR_v1.png" id="superior-rank" className="img-fluid position-absolute" style={{ marginTop: 200 }} alt="" />
            </div>
        </>
    );
}