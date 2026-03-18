import PreloadImage from '../../PreloadImage/PreloadImage';
import './ArchitectRankWithBanner.css';

interface ArchitectRankWithBannerProps {
    height?: number,
    width?: number
}

export default function ArchitectRankWithBanner({ height = 50, width = 50 }: ArchitectRankWithBannerProps) {
    return (
        <>
            <div className="d-flex" id="architect-container">
                <PreloadImage
                    id="architect-rank"
                    src={`/system-images/ranks/5._ARCHITECT_v1.png`}
                    height={'100%'}
                    width={'100%'}
                    isRounded={false}
                    className="img-fluid"
                />
            </div>
        </>
    );
}