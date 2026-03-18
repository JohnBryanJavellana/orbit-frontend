import PreloadImage from '../../PreloadImage/PreloadImage';
import './LeadRankWithBanner.css';

interface LeadRankWithBannerProps {
    height?: number,
    width?: number
}

export default function LeadRankWithBanner({ height = 50, width = 50 }: LeadRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="lead-container">
                <PreloadImage
                    id="lead-rank"
                    src={`/system-images/ranks/4._LEAD_v1.png`}
                    height={'100%'}
                    width={'100%'}
                    isRounded={false}
                    className="img-fluid"
                />
            </div>
        </>
    );
}