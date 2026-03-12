import './ContributorRankWithBanner.css';

interface ContributorRankWithBannerProps {
    height?: number,
    width?: number
}

export default function ContributorRankWithBanner({ height = 50, width = 50 }: ContributorRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="contributor-container">
                <img loading='eager' src="/system-images/ranks/2._CONTRIBUTOR_v1.png" id="contributor-rank" className="img-fluid" alt="" />
            </div>
        </>
    );
}