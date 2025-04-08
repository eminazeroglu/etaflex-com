import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from "react-router";
import { Fancybox } from "@fancyapps/ui";
import classNames from "classnames";
import PropTypes from 'prop-types';
import defaultImage from '@/assets/img/default-image.png';
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import './index.css';

// Global active zoom tracker
let activeZoomId = null;
const ZOOM_SIZE = 300;

const Image = ({
                   src,
                   path,
                   bigSrc,
                   alt = '',
                   className,
                   children,
                   imageFullRounded = false,
                   imageClass,
                   type = 'cover',
                   fallbackSrc = defaultImage,
                   fancybox = false,
                   fancyboxOptions = {},
                   groupName = 'gallery',
                   enableZoom = false,
                   zoomPosition = 'right',
                   zoomSize = ZOOM_SIZE,
                   showErrorState = true,
                   ...props
               }) => {
    const [error, setError] = useState(false);
    const [showZoom, setShowZoom] = useState(false);
    const imageRef = useRef(null);
    const zoomRef = useRef(null);
    const instanceId = useRef(Math.random().toString(36).substr(2, 9));

    const handleError = (e) => {
        e.target.onerror = null;
        e.target.src = fallbackSrc;
        setError(true);
    };

    const calculateZoomPosition = useCallback(() => {
        if (!imageRef.current) return null;

        const rect = imageRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        let top = rect.top;
        let left = rect.left;

        if (top + zoomSize > windowHeight) {
            top = top - zoomSize + rect.height;
        }

        if (zoomPosition === 'right') {
            if (left + rect.width + zoomSize > windowWidth) {
                left = left - zoomSize - 10;
            } else {
                left = left + rect.width + 10;
            }
        } else {
            if (left - zoomSize - 10 < 0) {
                left = left + rect.width + 10;
            } else {
                left = left - zoomSize - 10;
            }
        }

        return { top, left };
    }, [zoomSize, zoomPosition]);

    // Zoom açma funksiyası
    const handleMouseEnter = useCallback(() => {
        if (!enableZoom) return;

        // Əvvəlki aktiv zoom-u bağlayırıq
        if (activeZoomId && activeZoomId !== instanceId.current) {
            const event = new CustomEvent('closeZoom', {
                detail: { exceptId: instanceId.current }
            });
            window.dispatchEvent(event);
        }

        activeZoomId = instanceId.current;
        setShowZoom(true);
    }, [enableZoom]);

    // Zoom bağlama funksiyası
    const handleMouseLeave = useCallback((e) => {
        if (!imageRef.current || !zoomRef.current) return;

        const imageRect = imageRef.current.getBoundingClientRect();
        const zoomRect = zoomRef.current.getBoundingClientRect();

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const isInImage = mouseX >= imageRect.left && mouseX <= imageRect.right &&
            mouseY >= imageRect.top && mouseY <= imageRect.bottom;
        const isInZoom = mouseX >= zoomRect.left && mouseX <= zoomRect.right &&
            mouseY >= zoomRect.top && mouseY <= zoomRect.bottom;

        if (!isInImage && !isInZoom) {
            activeZoomId = null;
            setShowZoom(false);
        }
    }, []);

    // Event listener for closing zoom
    useEffect(() => {
        const handleCloseZoom = (e) => {
            if (e.detail.exceptId !== instanceId.current) {
                setShowZoom(false);
            }
        };

        window.addEventListener('closeZoom', handleCloseZoom);

        return () => {
            window.removeEventListener('closeZoom', handleCloseZoom);
            // Component unmount olduqda active zoom-u təmizləyirik
            if (activeZoomId === instanceId.current) {
                activeZoomId = null;
            }
        };
    }, []);

    useEffect(() => {
        setError(false);
    }, [src]);

    useEffect(() => {
        if (fancybox) {
            Fancybox.bind(`[data-fancybox="${groupName}"]`, {
                animated: true,
                showClass: "fancybox-fadeIn",
                hideClass: "fancybox-fadeOut",
                dragToClose: true,
                ...fancyboxOptions
            });

            return () => {
                Fancybox.destroy();
            };
        }
    }, [fancybox, groupName, fancyboxOptions]);

    const zoomStyle = React.useMemo(() => {
        if (!showZoom) return null;
        const position = calculateZoomPosition();
        if (!position) return null;

        return {
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${zoomSize}px`,
            height: `${zoomSize}px`
        };
    }, [showZoom, calculateZoomPosition, zoomSize]);

    const ImageWrapper = ({ children }) => {
        if (path) {
            return <Link to={path} className="absolute inset-0 z-10">{children}</Link>;
        }
        if (fancybox) {
            return (
                <a href={bigSrc || src}
                   data-fancybox={groupName}
                   className="absolute inset-0 z-10"
                   data-caption={alt}
                >
                    {children}
                </a>
            );
        }
        return children;
    };

    return (
        <>
            <figure
                ref={imageRef}
                className={classNames('relative', className)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    className={classNames(
                        'size-full',
                        imageClass,
                        {
                            'object-cover': type === 'cover',
                            'object-contain': type === 'contain',
                            'rounded-full': imageFullRounded,
                            'cursor-pointer': fancybox || enableZoom
                        }
                    )}
                    src={src || fallbackSrc}
                    alt={alt}
                    onError={handleError}
                    {...props}
                />

                <ImageWrapper />
                {children}
            </figure>

            {enableZoom && showZoom && zoomStyle && (
                <div
                    ref={zoomRef}
                    className={classNames(
                        'fixed z-50 hidden lg:block',
                        'bg-white dark:bg-darkPrimary',
                        'border border-gray-200 dark:border-gray-700',
                        'p-2 rounded-xl shadow-lg',
                        'transition-opacity duration-200',
                        showZoom ? 'opacity-100' : 'opacity-0'
                    )}
                    style={zoomStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img
                        src={bigSrc || src}
                        className="w-full h-full object-cover rounded-xl"
                        alt={alt}
                    />
                </div>
            )}
        </>
    );
};

Image.propTypes = {
    src: PropTypes.string,
    path: PropTypes.string,
    bigSrc: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    imageFullRounded: PropTypes.bool,
    imageClass: PropTypes.string,
    type: PropTypes.oneOf(['cover', 'contain']),
    fallbackSrc: PropTypes.string,
    fancybox: PropTypes.bool,
    fancyboxOptions: PropTypes.object,
    groupName: PropTypes.string,
    enableZoom: PropTypes.bool,
    zoomPosition: PropTypes.oneOf(['left', 'right']),
    zoomSize: PropTypes.number,
    showErrorState: PropTypes.bool
};

export default Image;