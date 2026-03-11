import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import './CustomAvatarWithOnlineBadge.css';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        boxShadow: `0 0 0 2px #2b3035`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '100%',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': { transform: 'scale(.8)', opacity: 1 },
        '100%': { transform: 'scale(2.4)', opacity: 0 },
    },
}));

interface CustomAvatarWithOnlineBadgeProps {
    height?: any;
    width?: any;
    src?: string;
    data?: any,
    statusColor?: string;
    isOnline?: boolean;
    withBadge?: boolean;
    isAdmin?: boolean;
}

export default function CustomAvatarWithOnlineBadge({
    height = 30,
    width = 30,
    src = "/static/images/avatar/1.jpg",
    data,
    isOnline,
    withBadge = true,
    isAdmin = false
}: CustomAvatarWithOnlineBadgeProps) {
    const displaySrc = isAdmin ? '/system-images/raw-images/9brubwu9u65f1.gif' : src;

    const frame = data?.role === "SUPERADMIN" ? 'SUPREME' : data?.role === "ADMINISTRATOR" ? 'SUPERIOR' :
        !["ADMINISTRATOR", "SUPERADMIN"].includes(data?.role) && data?.total_points < 500 ? 'NOVICE' :
            !["ADMINISTRATOR", "SUPERADMIN"].includes(data?.role) && data?.total_points < 1500 && data?.total_points >= 500 ? 'CONTRIBUTOR' :
                !["ADMINISTRATOR", "SUPERADMIN"].includes(data?.role) && data?.total_points < 3000 && data?.total_points >= 1500 ? 'SPECIALIST' :
                    !["ADMINISTRATOR", "SUPERADMIN"].includes(data?.role) && data?.total_points < 5000 && data?.total_points >= 3000 ? 'LEAD' :
                        !["ADMINISTRATOR", "SUPERADMIN"].includes(data?.role) && data?.total_points >= 5000 ? 'ARCHITECT' : '';

    const getFrameScale = () => {
        switch (frame) {
            case 'SUPREME': return 2.2;
            case 'SUPERIOR': return 1.8;
            case 'ARCHITECT': return 1.5;
            case 'LEAD': return 1.4;
            case 'SPECIALIST': return 1.3;
            default: return 1.25;
        }
    };

    // New: Link each frame to a CSS animation class
    const getAnimationClass = () => {
        if (!frame) return '';
        return `frame-anim-${frame.toLowerCase()}`;
    };

    const scale = getFrameScale();

    return (
        <div
            className="position-relative d-flex align-items-center justify-content-center"
            style={{
                width: width * (frame === 'SUPREME' ? 1.5 : 1.1),
                height: height * (frame === 'SUPREME' ? 1.2 : 1.1),
            }}
        >
            <Avatar
                alt="User Profile"
                src={displaySrc}
                sx={{
                    width: width,
                    height: height,
                    zIndex: 1,
                    backgroundColor: '#1a1a1a',
                    border: '2px solid transparent'
                }}
            />

            {frame && (
                <img
                    src={`/system-images/frames/${frame}_FRAME_v1.png`}
                    className={`position-absolute ${getAnimationClass()}`}
                    style={{
                        width: width * scale,
                        height: height * scale,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        pointerEvents: 'none',
                        marginTop: frame === 'SUPREME' ? '-5%' : frame === 'SUPERIOR' ? '2%' : 0,
                        filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.5))'
                    }}
                />
            )}
        </div>
    );
}