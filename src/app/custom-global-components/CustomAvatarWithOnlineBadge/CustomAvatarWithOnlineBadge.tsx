import Link from 'next/link';
import './CustomAvatarWithOnlineBadge.css';
import useSystemURLCon from '@/app/hooks/useSystemURLCon';
import PreloadImage from '../PreloadImage/PreloadImage';
import { Box, CircularProgress, Typography } from '@mui/material';

interface CustomAvatarWithOnlineBadgeProps {
    height?: any;
    width?: any;
    src?: string;
    srcShown: 'MAIN' | 'CUSTOM';
    data?: any,
    statusColor?: string;
    showNote?: boolean;
    isOnline?: boolean;
    withBadge?: boolean;
    isAdmin?: boolean;
    isAudioLoading?: boolean;
    runAudio?: boolean
}

export default function CustomAvatarWithOnlineBadge({
    height = 30,
    width = 30,
    srcShown,
    src = "/static/images/avatar/1.jpg",
    data,
    runAudio = false,
    showNote = false,
    isAudioLoading = false
}: CustomAvatarWithOnlineBadgeProps) {
    const { urlWithoutApi } = useSystemURLCon();

    const initSource = srcShown === "MAIN" ? data?.custom_avatar.profile_picture : data?.custom_avatar.custom_avatar.filename;
    const finalUrlSrc = `${urlWithoutApi}/${srcShown === "MAIN" ? 'user-images' : 'custom-avatar-images'}/${initSource}`;

    return (
        <>
            <Box className="position-relative d-flex align-items-center justify-content-center" sx={{
                width: width * 1.4,
                height: height * 1.4,
                position: 'relative',
                cursor: 'pointer'
            }}>
                {data?.custom_user_note && showNote && (
                    <div className="note-bubble">
                        <div className="text-center">
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: '0.65rem',
                                    color: '#444',
                                    display: 'block',
                                    fontWeight: 500,
                                    lineHeight: '1.0'
                                }}
                            >
                                {data?.custom_user_note.note}
                            </Typography>
                        </div>


                        {!isAudioLoading ? (() => {
                            try {
                                const music = typeof data?.custom_user_note.note_audio === 'string'
                                    ? JSON.parse(data?.custom_user_note.note_audio)
                                    : data?.custom_user_note.note_audio;

                                if (!music) return null;

                                return (
                                    <div className='w-100 rounded d-flex align-items-center' style={{
                                        height: '16px',
                                        overflow: 'hidden',
                                        padding: '0 4px'
                                    }}>
                                        <div className="d-flex align-items-end justify-content-between flex-shrink-0"
                                            style={{ width: '8px', height: '8px', marginRight: '6px' }}>
                                            {[1, 2, 3].map((bar) => (
                                                <div key={bar} className="bg-primary" style={{
                                                    width: '2px',
                                                    height: '100%',
                                                    borderRadius: '1px',
                                                    transformOrigin: 'bottom',
                                                    animation: 'mini-bars 0.6s ease-in-out infinite alternate',
                                                    animationDelay: `${bar * 0.2}s`
                                                }} />
                                            ))}
                                        </div>

                                        {/* 2. Text Container: Takes up remaining space */}
                                        <div className="flex-grow-1 overflow-hidden" style={{ position: 'relative' }}>
                                            <div className="marquee-active" style={{
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                                color: '#444',
                                                whiteSpace: 'nowrap',
                                                display: 'inline-block'
                                            }}>
                                                {/* Double the text for a seamless loop */}
                                                <span>{music.name} • {music.artist_name}</span>
                                                <span style={{ paddingLeft: '30px' }}>{music.name} • {music.artist_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } catch (e) {
                                console.error("Error parsing note_audio:", e);
                                return null;
                            }
                        })() : <div className='d-flex align-items-center justify-content-center mt-2'><CircularProgress size={10} /></div>}
                    </div>
                )}

                <div className="position-relative d-flex align-items-center justify-content-center" style={{
                    width: width * 1.1,
                    height: height * 1.1,
                }}>
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
                </div>
            </Box>
        </>
    );
}