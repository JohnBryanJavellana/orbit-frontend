import './SpecialistRankWithBanner.css';

interface SpecialistRankWithBannerProps {
    height?: number,
    width?: number
}

export default function SpecialistRankWithBanner({ height = 50, width = 50 }: SpecialistRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="specialist-container">
                <img loading='eager' src="/system-images/banner/3._SPECIALIST_BANNER_v1.png" id="specialist-banner" className="img-fluid" alt="" />
                <img loading='eager' src="/system-images/ranks/3._SPECIALIST_v1.png" id="specialist-rank" className="img-fluid position-absolute" style={{ marginTop: 60 }} alt="" />
            </div>
        </>
    );
}