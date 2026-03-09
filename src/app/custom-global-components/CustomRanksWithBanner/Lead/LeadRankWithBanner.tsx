import './LeadRankWithBanner.css';

interface LeadRankWithBannerProps {
    height?: number,
    width?: number
}

export default function LeadRankWithBanner({ height = 50, width = 50 }: LeadRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="lead-container">
                <img loading='eager' src="/system-images/banner/4._LEAD_BANNER_v1.png" id="lead-banner" className="img-fluid" alt="" />
                <img loading='eager' src="/system-images/ranks/4._LEAD_v1.png" id="lead-rank" className="img-fluid position-absolute" style={{ marginTop: 60 }} alt="" />
            </div>
        </>
    );
}