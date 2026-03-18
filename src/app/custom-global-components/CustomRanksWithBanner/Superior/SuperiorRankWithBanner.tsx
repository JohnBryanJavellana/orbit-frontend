import PreloadImage from '../../PreloadImage/PreloadImage';
import './SuperiorRankWithBanner.css';

interface SuperiorRankWithBannerProps {
    height?: number,
    width?: number
}

export default function SuperiorRankWithBanner({ height = 50, width = 50 }: SuperiorRankWithBannerProps) {
    return (
        <>
            <div id="superior-container">
                <PreloadImage
                    id="superior-rank"
                    src={`/system-images/ranks/6._SUPERIOR_v1.png`}
                    height={'100%'}
                    width={'100%'}
                    isRounded={false}
                    className="img-fluid"
                />
            </div>
        </>
    );
}