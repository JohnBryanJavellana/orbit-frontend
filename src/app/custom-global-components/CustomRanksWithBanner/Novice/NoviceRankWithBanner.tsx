import './NoviceRankWithBanner.css';

interface NoviceRankWithBannerProps {
    height?: number,
    width?: number
}

export default function NoviceRankWithBanner({ height = 50, width = 50 }: NoviceRankWithBannerProps) {
    return (
        <>
            <div id="novice-container" style={{ height: '85vh' }}>
                <img loading='eager' src="/system-images/banner/1._NOVICE_BANNER_v1.png" id="novice-banner" className="img-fluid" alt="" />
                <img loading='eager' src="/system-images/ranks/1._NOVICE_v1.png" id="novice-rank" className="img-fluid position-absolute" style={{ marginTop: 60 }} alt="" />
            </div>
        </>
    );
}