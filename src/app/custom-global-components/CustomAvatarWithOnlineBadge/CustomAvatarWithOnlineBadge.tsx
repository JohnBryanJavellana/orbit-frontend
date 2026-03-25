import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import './CustomAvatarWithOnlineBadge.css';
import useSystemURLCon from '@/app/hooks/useSystemURLCon';
import PreloadImage from '../PreloadImage/PreloadImage';
import { Box, Typography } from '@mui/material';

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
        <Box className="position-relative d-flex align-items-center justify-content-center"
            style={{ width: width * 1.4, height: height * 1.4, position: 'relative' }}>

            {/* Thought Bubble / Note */}
            {data?.custom_user_note && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '-25px', // Lifted slightly higher to clear the avatar/border
                        zIndex: 999,
                        backgroundColor: 'white',
                        borderRadius: '15px', // More rounded for that "pill" look
                        padding: '4px 12px',  // Increased padding for better breathing room

                        // THE FIX:
                        minWidth: '40px',     // Prevents it from being a tiny circle for 1-char notes
                        maxWidth: '120px',    // Increased to allow more of the 50 chars to show
                        width: 'max-content', // Important: tells the box to grow with the text

                        boxShadow: '0px 3px 10px rgba(0,0,0,0.2)',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-6px', // Adjusted to match the new padding
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '6px solid white',
                        }
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.65rem',
                            color: '#333',
                            overflow: 'hidden',
                            fontWeight: 500
                        }}
                    >
                        {data?.custom_user_note.note}
                    </Typography>
                </Box>
            )}

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
        </Box>
    );
}