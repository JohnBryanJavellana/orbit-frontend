import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import './CustomAvatarWithOnlineBadge.css';
import useSystemURLCon from '@/app/hooks/useSystemURLCon';
import PreloadImage from '../PreloadImage/PreloadImage';

interface CustomAvatarWithOnlineBadgeProps {
    height?: any;
    width?: any;
    src?: string;
    srcShown: 'MAIN' | 'CUSTOM';
    data?: any,
    statusColor?: string;
    isOnline?: boolean;
    withBadge?: boolean;
    isAdmin?: boolean;
}

export default function CustomAvatarWithOnlineBadge({
    height = 30,
    width = 30,
    srcShown,
    src = "/static/images/avatar/1.jpg",
    data
}: CustomAvatarWithOnlineBadgeProps) {
    const { urlWithoutApi } = useSystemURLCon();

    const initSource = srcShown === "MAIN" ? data?.custom_avatar.profile_picture : data?.custom_avatar.custom_avatar.filename;
    const finalUrlSrc = `${urlWithoutApi}/${srcShown === "MAIN" ? 'user-images' : 'custom-avatar-images'}/${initSource}`;

    return (
        <Link
            href={finalUrlSrc}
            target='_blank'
            className="position-relative d-flex align-items-center justify-content-center"
            style={{
                width: width * 1.1,
                height: height * 1.1,
            }}
        >
            <PreloadImage
                src={finalUrlSrc}
                height={height}
                width={width}
                isRounded
                preStyles={{
                    zIndex: 1,
                    backgroundColor: '#1a1a1a',
                    border: '2px solid transparent'
                }}
            />

            {data?.custom_border && (
                <img
                    src={`${urlWithoutApi}/border-images/${data?.custom_border.filename}`}
                    className={`position-absolute`}
                    style={{
                        width: width * 1.4,
                        height: height * 1.4,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.5))'
                    }}
                />
            )}
        </Link>
    );
}