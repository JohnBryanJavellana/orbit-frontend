import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';

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
    statusColor?: string;
    isOnline?: boolean;
    withBadge?: boolean;
    isAdmin?: boolean;
}

export default function CustomAvatarWithOnlineBadge({
    height = 30,
    width = 30,
    src = "/static/images/avatar/1.jpg",
    isOnline,
    withBadge = true,
    isAdmin = false
}: CustomAvatarWithOnlineBadgeProps) {
    const displaySrc = isAdmin ? '/system-images/raw-images/9brubwu9u65f1.gif' : src;

    return (
        withBadge
            ? <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    '& .MuiBadge-badge': {
                        width: width / 4,
                        height: height / 4,
                        borderRadius: '50%',
                        backgroundColor: isOnline ? '#28963a' : '#6c757d',
                        color: isOnline ? '#28963a' : '#6c757d',
                        boxShadow: '0 0 0 2px #2b3035',
                        '&::after': {
                            animation: isOnline ? 'ripple 1.2s infinite ease-in-out' : 'none',
                        }
                    }
                }}
            >
                <Link href={displaySrc} target='_blank'>
                    <Avatar
                        alt="User Profile"
                        src={displaySrc}
                        sx={{
                            width: width,
                            height: height,
                            borderRadius: isAdmin ? '0px !important' : '50%'
                        }}
                    />
                </Link>
            </StyledBadge> : <Link href={displaySrc} target='_blank'>
                <Avatar
                    alt="User Profile"
                    src={displaySrc}
                    sx={{
                        width: width,
                        height: height,
                        borderRadius: isAdmin ? '0px !important' : '50%'
                    }}
                />
            </Link>
    );
}