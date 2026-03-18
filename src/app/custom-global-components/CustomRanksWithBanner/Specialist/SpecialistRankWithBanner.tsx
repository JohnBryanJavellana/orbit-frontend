import PreloadImage from '../../PreloadImage/PreloadImage';
import './SpecialistRankWithBanner.css';

interface SpecialistRankWithBannerProps {
    height?: number,
    width?: number
}

export default function SpecialistRankWithBanner({ height = 50, width = 50 }: SpecialistRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="specialist-container">
                <PreloadImage
                    id="specialist-rank"
                    src={`/system-images/ranks/3._SPECIALIST_v1.png`}
                    height={'100%'}
                    width={'100%'}
                    isRounded={false}
                    className="img-fluid"
                />
            </div>
        </>
    );
}