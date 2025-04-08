import React, {useEffect, useRef, useState} from 'react';
import {FiMapPin} from 'react-icons/fi';
import classNames from "classnames";
import {APP_CONFIG} from "@/config/appConfig.jsx";
import {getCurrentLanguage} from "@/utils/localeUtil.jsx";

// Varsayılan koordinatlar (Bakı şəhəri mərkəzi)
const DEFAULT_LOCATION = {lat: 40.409264, lng: 49.867092};

// Koordinat tipini yoxlayan funksiya
const isValidCoordinate = (value) => {
    if (!value) return false;
    if (typeof value !== 'object') return false;
    if (!('lat' in value) || !('lng' in value)) return false;
    if (isNaN(Number(value.lat)) || isNaN(Number(value.lng))) return false;
    if (!isFinite(Number(value.lat)) || !isFinite(Number(value.lng))) return false;
    return true;
};

// Unikal xəritə ID-si yaradırıq - hər bir xəritə üçün unikal olmalıdır
const generateMapId = () => {
    return `map_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
};

// Google Maps API-ni async yükləmək üçün
const loadGoogleMapsApi = (callback) => {
    // Əgər artıq yüklənibsə, callback-i çağır və qaytar
    if (window.google && window.google.maps) {
        callback();
        return;
    }

    // Google Maps API-ni yüklə - marker və drawing kitabxanalarını əlavə edirik
    const script = document.createElement('script');
    const apiKey = APP_CONFIG.googleMapKey;
    const language = getCurrentLanguage();
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,drawing&language=${language}&loading=async&callback=initMap`;
    script.async = true;
    script.defer = true;

    // initMap global funksiyasını yaradırıq
    window.initMap = () => {
        callback();
        // Callback işləndikdən sonra global funksiyasını təmizləyirik
        delete window.initMap;
    };

    document.head.appendChild(script);

    return () => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
        if (window.initMap) {
            delete window.initMap;
        }
    };
};

const FormMap = (
    {
        value,
        onChange,
        height = '300px',
        zoom = 12,
        disabled = false,
        className = '',
        ...props
    }
) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const mapIdRef = useRef(generateMapId()); // Unikal xəritə ID-si yaradırıq
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [hasMarker, setHasMarker] = useState(false);
    const [useAdvancedMarker, setUseAdvancedMarker] = useState(false);

    // Koordinatları təhlükəsiz şəkildə əldə etmək
    const safeCoordinates = React.useMemo(() => {
        // Əgər value dəyəri yoxdursa və ya düzgün formatda deyilsə, default dəyərdən istifadə et
        if (!isValidCoordinate(value)) {
            return DEFAULT_LOCATION;
        }

        // Value varsa marker olduğunu qeyd et
        setHasMarker(true);

        // Koordinatları number tipinə çeviririk ki, Google Maps API ilə problem olmasın
        return {
            lat: Number(value.lat),
            lng: Number(value.lng)
        };
    }, [value]);

    // Google Maps-i yükləmək
    useEffect(() => {
        const cleanup = loadGoogleMapsApi(() => {
            // AdvancedMarkerElement mövcudluğunu yoxlayaq
            if (window.google?.maps?.marker?.AdvancedMarkerElement) {
                setUseAdvancedMarker(true);
            }
            initializeMap();
        });

        return cleanup;
    }, []);

    // Xəritəni inicializasiya etmək
    const initializeMap = () => {
        if (!mapRef.current || mapInstanceRef.current) return;

        try {
            // Xəritə instance yaradırıq - Map ID əlavə edirik
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: safeCoordinates,
                zoom: zoom,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                mapId: mapIdRef.current, // Unikal Map ID əlavə edirik
                draggableCursor: !disabled ? 'default' : 'not-allowed' // Cursor stilini tənzimləyirik
            });

            // Click eventini əlavə edirik
            if (!disabled) {
                mapInstanceRef.current.addListener('click', (e) => {
                    const clickedPosition = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    };

                    // Koordinatları ötürürük
                    if (onChange) {
                        onChange(clickedPosition);
                    }

                    // Marker var olduğunu qeyd edirik
                    setHasMarker(true);
                });
            }

            // Əgər başlanğıcda bir value varsa, marker yaradırıq
            if (isValidCoordinate(value)) {
                createOrUpdateMarker();
                setHasMarker(true);
            }

            setIsMapLoaded(true);
        } catch (error) {
            console.error("Map initialization error:", error);
        }
    };

    // Marker yaratmaq və ya yeniləmək
    const createOrUpdateMarker = () => {
        if (!mapInstanceRef.current) return;

        try {
            // Əgər əvvəlki marker varsa silirik
            if (markerRef.current) {
                if (markerRef.current instanceof google.maps.marker.AdvancedMarkerElement) {
                    markerRef.current.map = null;
                } else if (markerRef.current.setMap) {
                    markerRef.current.setMap(null);
                }
                markerRef.current = null;
            }

            // AdvancedMarkerElement əlçatandırsa istifadə edirik
            if (useAdvancedMarker && window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                // Marker üçün özəlləşdirilmiş pin
                const pinElement = document.createElement("div");

                // SVG ikonu
                pinElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E74C3C" width="36px" height="36px">
                        <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                    </svg>
                `;

                // Pin stilini tənzimləyirik
                pinElement.style.cursor = !disabled ? "grab" : "default";
                pinElement.style.position = "relative";
                pinElement.style.userSelect = "none";

                // Advanced Marker yaradırıq
                markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                    position: safeCoordinates,
                    map: mapInstanceRef.current,
                    content: pinElement,
                    title: 'Seçilmiş məkan',
                    draggable: !disabled,
                    gmpDraggable: !disabled // gmpDraggable xüsusiyyəti əlavə edirik
                });

                // Drag eventləri əlavə edirik
                if (!disabled) {
                    // Sürüşdürmə başladıqda
                    markerRef.current.addListener('dragstart', () => {
                        pinElement.style.cursor = "grabbing";
                    });

                    // Sürüşdürmə bitdikdə
                    markerRef.current.addListener('dragend', () => {
                        pinElement.style.cursor = "grab";

                        // Yeni koordinatları əldə edirik
                        const position = markerRef.current.position;
                        const newCoords = {
                            lat: position.lat,
                            lng: position.lng
                        };
                        if (onChange) {
                            onChange(newCoords);
                        }
                    });
                }
            } else {
                // Fallback olaraq standart marker istifadə edirik
                const markerOptions = {
                    position: safeCoordinates,
                    map: mapInstanceRef.current,
                    draggable: !disabled,
                    title: 'Seçilmiş məkan',
                    cursor: !disabled ? "grab" : "default",
                    animation: google.maps.Animation.DROP // Marker animasiyası əlavə edirik
                };

                // Özəlləşdirilmiş marker ikonu
                if (window.google.maps.Icon) {
                    markerOptions.icon = {
                        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E74C3C" width="36px" height="36px">
                                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                            </svg>
                        `),
                        scaledSize: new google.maps.Size(36, 36),
                        anchor: new google.maps.Point(18, 36),
                    };
                }

                markerRef.current = new window.google.maps.Marker(markerOptions);

                // Markerin drag eventlərini dinləyirik
                if (!disabled) {
                    // Sürüşdürmə başladıqda
                    window.google.maps.event.addListener(markerRef.current, 'dragstart', () => {
                        if (markerRef.current.setOptions) {
                            markerRef.current.setOptions({ cursor: "grabbing" });
                        }
                    });

                    // Sürüşdürmə bitdikdə
                    window.google.maps.event.addListener(markerRef.current, 'dragend', () => {
                        if (markerRef.current.setOptions) {
                            markerRef.current.setOptions({ cursor: "grab" });
                        }

                        const position = markerRef.current.getPosition();
                        const newCoords = {
                            lat: position.lat(),
                            lng: position.lng()
                        };
                        if (onChange) {
                            onChange(newCoords);
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Marker creation error:", error);

            // Xəta baş versə, yenə də standart marker ilə cəhd edirik
            try {
                markerRef.current = new window.google.maps.Marker({
                    position: safeCoordinates,
                    map: mapInstanceRef.current,
                    draggable: !disabled
                });

                // Sadə drag eventi əlavə edirik
                if (!disabled) {
                    window.google.maps.event.addListener(markerRef.current, 'dragend', () => {
                        const position = markerRef.current.getPosition();
                        const newCoords = {
                            lat: position.lat(),
                            lng: position.lng()
                        };
                        if (onChange) {
                            onChange(newCoords);
                        }
                    });
                }
            } catch (fallbackError) {
                console.error("Fallback marker creation error:", fallbackError);
            }
        }
    };

    // Koordinat dəyişdikdə markeri və xəritəni yeniləyirik
    useEffect(() => {
        if (!isMapLoaded || !mapInstanceRef.current) return;

        try {
            // Markeri yeniləyirik
            createOrUpdateMarker();

            // Xəritəni yeni koordinatlara mərkəzləşdiririk
            mapInstanceRef.current.setCenter(safeCoordinates);
        } catch (error) {
            console.error("Map update error:", error);
        }
    }, [safeCoordinates, isMapLoaded, disabled, useAdvancedMarker]);

    return (
        <div className={classNames("form-map w-full", className)}>
            <div
                ref={mapRef}
                id={mapIdRef.current}
                className={classNames(
                    "w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700",
                    {"opacity-75": disabled}
                )}
                style={{height}}
            ></div>

            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FiMapPin className="inline-block"/>
                <span>
                    {hasMarker && isValidCoordinate(safeCoordinates)
                        ? `${Number(safeCoordinates.lat).toFixed(6)}, ${Number(safeCoordinates.lng).toFixed(6)}`
                        : 'Koordinat seçilməyib'}
                </span>

                {!disabled && hasMarker && (
                    <span className="ml-2 text-xs text-primary">
                        (markeri tutub sürüşdürə bilərsiniz)
                    </span>
                )}
            </div>
        </div>
    );
};

export default FormMap;