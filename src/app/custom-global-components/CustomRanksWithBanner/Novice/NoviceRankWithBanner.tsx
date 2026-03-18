import PreloadImage from '../../PreloadImage/PreloadImage';
import './NoviceRankWithBanner.css';

interface NoviceRankWithBannerProps {
    height?: number,
    width?: number
}

export default function NoviceRankWithBanner({ height = 50, width = 50 }: NoviceRankWithBannerProps) {
    return (
        <>
            <div id="novice-container">
                <PreloadImage
                    id="novice-rank"
                    src={`/system-images/ranks/1._NOVICE_v1.png`}
                    height={'100%'}
                    width={'100%'}
                    isRounded={false}
                    className="img-fluid"
                />
            </div>
        </>
    );
}