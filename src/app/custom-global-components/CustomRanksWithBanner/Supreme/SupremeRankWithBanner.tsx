import './SupremeRankWithBanner.css';

interface SupremeRankWithBannerProps {
    height?: number,
    width?: number
}

export default function SupremeRankWithBanner({ height = 50, width = 50 }: SupremeRankWithBannerProps) {
    return (
        <>
            <div id="supreme-container" style={{ height: '85vh' }}>
                <img loading='eager' src="/system-images/banner/7._SUPREME_BANNER_v1.png" id="supreme-banner" className="img-fluid" alt="" />
                <img loading='eager' src="/system-images/ranks/7._SUPREME_v1.png" id="supreme-rank" className="img-fluid position-absolute" style={{ marginTop: '50%' }} alt="" />
            </div>
        </>
    );
}