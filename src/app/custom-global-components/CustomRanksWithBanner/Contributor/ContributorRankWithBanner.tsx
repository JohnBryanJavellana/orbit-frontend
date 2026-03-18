import PreloadImage from '../../PreloadImage/PreloadImage';
import './ContributorRankWithBanner.css';

interface ContributorRankWithBannerProps {
    height?: number,
    width?: number
}

export default function ContributorRankWithBanner({ height = 50, width = 50 }: ContributorRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="contributor-container">
                <PreloadImage
                    id="contributor-rank"
                    src={`/system-images/ranks/2._CONTRIBUTOR_v1.png`}
                    height={'100%'}
                    width={'100%'}
                    isRounded={false}
                    className="img-fluid"
                />
            </div>
        </>
    );
}