import PreloadImage from '../../PreloadImage/PreloadImage';
import './SupremeRankWithBanner.css';

interface SupremeRankWithBannerProps {
    height?: number,
    width?: number
}

export default function SupremeRankWithBanner({ height = 50, width = 50 }: SupremeRankWithBannerProps) {
    return (
        <>
            <div id="supreme-container">
                <PreloadImage
                    id="supreme-rank"
                    src={`/system-images/ranks/7._SUPREME_v1.png`}
                    height={'100%'}
                    width={'100%'}
                    isRounded={false}
                    className="img-fluid"
                />
            </div>
        </>
    );
}