'use client';

import { Avatar, CircularProgress, Box } from "@mui/material";
import { useState, useEffect, useRef, CSSProperties } from "react";
import { forwardRef } from "react";

interface PreloadImageProps {
    src: string,
    alt?: string,
    height: string | number,
    width: string | number,
    isRounded?: boolean,
    classNames?: string,
    preStyles?: CSSProperties,
    avatarAltInside?: string,
    id?: string,
    noWrapper?: boolean,
    [key: string]: any
}

const PreloadImage = forwardRef<HTMLDivElement, PreloadImageProps>((PreloadImageProps, ref) => {
    const { src, alt, height = '30', width = '30', isRounded = true, classNames, preStyles, avatarAltInside, id, noWrapper = false, ...rest } = PreloadImageProps;
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const fallback = '/system-images/no-results-bg.2d2c6ee3.png';

    useEffect(() => {
        setImgSrc(src);
        setIsLoaded(false);
    }, [src]);

    useEffect(() => {
        if (imgRef.current?.complete) setIsLoaded(true);
    }, [imgSrc]);

    const content = (
        <Avatar
            {...rest}
            ref={ref}
            variant={isRounded ? 'circular' : 'square'}
            alt={alt}
            src={imgSrc || fallback}
            slotProps={{
                img: {
                    id: id,
                    ref: imgRef,
                    onLoad: () => setIsLoaded(true),
                    onError: () => {
                        if (imgSrc !== fallback) setImgSrc(fallback);
                        else setIsLoaded(true);
                    },
                }
            }}
            style={{
                height: typeof height === 'string' && (height.includes('%') || height === 'auto')
                    ? height
                    : `${height}px`,
                width: typeof width === 'string' && (width.includes('%') || width === 'auto')
                    ? width
                    : `${width}px`,
                opacity: isLoaded ? 1 : 0.3,
                transition: 'opacity 0.3s',
                pointerEvents: 'auto',
                ...preStyles
            }}
            className={classNames}
        >
            {avatarAltInside}
        </Avatar>
    );

    if (noWrapper) return content;

    return (
        <Box {...rest} ref={ref} sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: typeof height === 'string' && (height.includes('%') || height === 'auto')
                ? height
                : `${height}px`,
            width: typeof width === 'string' && (width.includes('%') || width === 'auto')
                ? width
                : `${width}px`, position: 'relative'
        }}>
            {content}
            {!isLoaded && <CircularProgress size="15px" sx={{ position: 'absolute' }} />}
        </Box>
    );
});

export default PreloadImage;