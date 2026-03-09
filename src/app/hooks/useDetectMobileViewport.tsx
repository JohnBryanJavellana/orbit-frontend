import { useMediaQuery } from '@mui/material';

export default function useDetectMobileViewport() {
    const isPointerCoarse = useMediaQuery('(pointer: coarse)');
    const isMobile = useMediaQuery('(max-width: 768px)');

    return isPointerCoarse || isMobile;
}