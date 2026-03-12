import './ArchitectRankWithBanner.css';

interface ArchitectRankWithBannerProps {
    height?: number,
    width?: number
}

export default function ArchitectRankWithBanner({ height = 50, width = 50 }: ArchitectRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="architect-container">
                <img src="/system-images/ranks/5._ARCHITECT_v1.png" id="architect-rank" className="img-fluid" alt="" />
            </div>
        </>
    );
}