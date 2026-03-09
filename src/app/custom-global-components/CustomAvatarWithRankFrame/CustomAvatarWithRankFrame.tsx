import { Avatar, Badge, Box } from "@mui/material";
import './CustomAvatarWithRankFrame.css';
import useSystemURLCon from "@/app/hooks/useSystemURLCon";

interface CustomAvatarWithRankFrameProps {
    src: string;
    points: number | '∞' | 'Ω';
    height?: number;
    width?: number;
}

export default function CustomAvatarWithRankFrame({
    src,
    points,
    height = 50,
    width = 50
}: CustomAvatarWithRankFrameProps) {
    const { urlWithoutApi } = useSystemURLCon();

    let frameImage = "NOVICEv.1.png";
    const isOmega = points === 'Ω';
    const isSuperior = points === '∞';

    if (isOmega) {
        frameImage = "SUPERIORv.1.png";
    } else if (isSuperior) {
        frameImage = "SUPERIORv.1.png";
    } else if (typeof points === 'number') {
        if (points >= 5000) frameImage = "ARCHITECTv.1.png";
        else if (points >= 3000) frameImage = "LEADv.1.png";
        else if (points >= 1500) frameImage = "SPECIALISTv.1.png";
        else if (points >= 500) frameImage = "CONTRIBUTORv.1.png";
    }

    return (
        <Box
            sx={{
                position: 'relative',
                width: width,
                height: height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Avatar
                src={`${urlWithoutApi}/${src}`}
                alt={'User Avatar'}
                sx={{
                    width: '30%',
                    height: '30%',
                    borderRadius: 0,
                    zIndex: 1,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    objectFit: 'cover',
                    backgroundColor: '#1a1a1a'
                }}
            />

            {/* 2. THE RANK FRAME (OVERLAY) */}
            <Box
                component="img"
                src={`/system-images/frames/${frameImage}`}
                alt={'Rank Frame'}
                className={isOmega ? "supreme-king-frame" : isSuperior ? "superior-aura-frame" : ""}
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    mt: 1,
                    objectFit: 'contain',
                    pointerEvents: 'none', // Allows clicks to hit the avatar/button below
                }}
            />
        </Box>
    );
}