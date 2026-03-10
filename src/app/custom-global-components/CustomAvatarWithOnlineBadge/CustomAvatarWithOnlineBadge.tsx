import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

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
    height?: number;
    width?: number;
    src?: string;
    statusColor?: string;
    isOnline?: boolean;
    isAdmin?: boolean;
}

export default function CustomAvatarWithOnlineBadge({
    height = 30,
    width = 30,
    src = "/static/images/avatar/1.jpg",
    isOnline,
    isAdmin = false
}: CustomAvatarWithOnlineBadgeProps) {
    return (
        <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
                '& .MuiBadge-badge': {
                    width: width / 4,
                    height: height / 4,
                    borderRadius: '100%',
                    backgroundColor: isOnline ? '#28963a' : 'gray',
                    color: isOnline ? '#28963a' : 'gray',
                    boxShadow: '0 0 0 2px #2b3035',
                    '&::after': {
                        animation: isOnline ? 'ripple 1.2s infinite ease-in-out' : 'none',
                    }
                }
            }}
        >
            {
                isAdmin ? <Avatar alt="User Profile" src={'/system-images/raw-images/9brubwu9u65f1.gif'} sx={{ width: width, height: height }} className='rounded-0' /> : <Avatar alt="User Profile" src={src} sx={{ width: width, height: height }} />
            }

        </StyledBadge>
    );
}