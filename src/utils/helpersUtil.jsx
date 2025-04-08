import {notification as AntdNotification} from "antd";
import store from "@/store/index.jsx";
import {translate} from "@/utils/localeUtil.jsx";
import {allStorage, getStorage} from "@/utils/localStorageUtil.jsx";
import {APP_CONFIG} from "@/config/appConfig.jsx";
import {getRoutesByRole} from "@/routes/index.jsx";
import {can} from "@/utils/permissionUtil.jsx";

const images = import.meta.glob('/src/assets/img/**/*.(png|jpg|jpeg|svg|gif)', { eager: true });

export const getMainPathByRole = () => {
    const role = store.getState().auth.role;
    if (role) return `/${role}`
    return '/'
}

// Yardımçı funksiyalar
export const flatten = arr => arr ? arr.reduce((result, item) => [...result, {...item}, ...flatten(item.children)], []) : [];

// Notification və Dialog funksiyaları
export const notification = ({
                                 placement = 'topRight',
                                 type = 'success',
                                 onClose = () => {},
                                 titleHidden = false,
                                 closeIcon = false,
                                 title,
                                 message
                             }) => {
    AntdNotification[type]({
        message: title || (!titleHidden && translate('notification.warningTitle')),
        description: message,
        placement,
        closeIcon,
        onClose
    });
};

// Veri işleme funksiyaları
export const onlyNumberWrite = (value, callback, float = false) => {
    if (value === '') {
        callback('');
        return;
    }

    const cleanedValue = value.replace(/[^\d.-]/g, '');

    const formattedValue = cleanedValue.replace(/(?!^)-/g, '');

    const parts = formattedValue.split('.');
    const finalValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');

    if (!finalValue || isNaN(finalValue)) {
        callback('');
        return;
    }

    callback(float ? finalValue : parseFloat(finalValue));
};

export const getNonEmptyProperties = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== "" && v !== null && v !== undefined));

export const convertObjectToQueryParams = (obj) =>
    new URLSearchParams(Object.entries(obj)).toString();

export const getQueryParams = (key = null) => {
    const urlObj = new URL(window.location.href);
    const query = new URLSearchParams(urlObj.hash.substring(urlObj.hash.indexOf('?')));
    if (key) return query.get(key);
    return Object.fromEntries(query);
};

export const getQuery = getQueryParams;

export const formatPhoneNumber = (phoneNumber) =>
    phoneNumber?.replace(/^(\d{5})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4');

export const copyText = async (e) => {
    const text = typeof e === 'string' || typeof e === 'number' ? e : e.target.innerText;
    await navigator.clipboard.writeText(text);
    notification({
        message: translate('notification.copyText'),
        placement: 'top',
        titleHidden: true,
        closeIcon: true
    });
};

/**
 * Enhanced URL redirect utility with validation, security checks and error handling
 */
export const redirectUrl = async (url, {
    newTab = false,
    requireInteraction = true,
    onError = null,
    onSuccess = null
} = {}) => {
    // URL validasiyası
    const isValidHttpUrl = (urlString) => {
        try {
            return ['http:', 'https:'].includes(new URL(urlString).protocol);
        } catch {
            return false;
        }
    };

    // Redirect əməliyyatı
    const doRedirect = (targetUrl) => {
        try {
            if (newTab) {
                // Yeni tab-da açmaq
                const newWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer');

                // Popup bloklandığı halda alternativ həll
                if (!newWindow) {
                    const link = document.createElement('a');
                    Object.assign(link, {
                        href: targetUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                    });
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } else {
                window.location.href = targetUrl;
            }
            onSuccess?.();
            return true;
        } catch (error) {
            throw new Error(`Redirect failed: ${error.message}`);
        }
    };

    try {
        // Validasiyalar
        if (!url || typeof url !== 'string') {
            throw new Error('URL must be a non-empty string');
        }

        if (!isValidHttpUrl(url)) {
            throw new Error('Invalid URL format');
        }

        const sanitizedUrl = encodeURI(url);

        // İstifadəçi interaksiyası tələb olunmursa və ya səhifə fokudadırsa
        if (!requireInteraction || document.hasFocus()) {
            return doRedirect(sanitizedUrl);
        }

        // İstifadəçi interaksiyası gözlənilir
        return new Promise((resolve, reject) => {
            const events = ['click', 'touchstart', 'keydown'];
            let timeoutId;

            const cleanup = () => {
                events.forEach(event => document.removeEventListener(event, handleInteraction));
                if (timeoutId) clearTimeout(timeoutId);
            };

            const handleInteraction = () => {
                cleanup();
                try {
                    resolve(doRedirect(sanitizedUrl));
                } catch (error) {
                    reject(error);
                }
            };

            // Timeout əlavə edirik
            timeoutId = setTimeout(() => {
                cleanup();
                reject(new Error('Redirect timeout: User interaction not received'));
            }, 30000); // 30 saniyə gözləyirik

            events.forEach(event =>
                document.addEventListener(event, handleInteraction, { once: true })
            );
        }).catch(error => {
            const errorMessage = error?.message || 'Redirect failed';
            console.error('Redirect Error:', errorMessage);
            onError?.(errorMessage);
            return false;
        });

    } catch (error) {
        const errorMessage = error?.message || 'Redirect failed';
        console.error('Redirect Error:', errorMessage);
        onError?.(errorMessage);
        return false;
    }
};

export const generateHours = (fromHour, toHour) =>
    Array.from({length: toHour - fromHour + 1}, (_, i) => `${(fromHour + i).toString().padStart(2, '0')}:00`);

export const generateNumber = (from, to, zero = false) =>
    Array.from({length: to - from + 1}, (_, i) => (from + i).toString().padStart(zero ? 2 : 1, '0'));

export const multiReplace = (str, replacements) =>
    Object.entries(replacements).reduce((acc, [key, value]) => acc.replace(new RegExp(key, 'g'), value), str);

export const getScreenSize = () => {
    if (typeof window === 'undefined') return 'xs';
    const breakpoints = [
        { size: 'xs', query: '(max-width: 639px)' },
        { size: 'sm', query: '(min-width: 640px) and (max-width: 767px)' },
        { size: 'md', query: '(min-width: 768px) and (max-width: 1023px)' },
        { size: 'lg', query: '(min-width: 1024px) and (max-width: 1279px)' },
        { size: 'xl', query: '(min-width: 1280px) and (max-width: 1535px)' },
        { size: '2xl', query: '(min-width: 1536px)' }
    ];
    return breakpoints.find(bp => window.matchMedia(bp.query).matches)?.size || '2xl';
};

export const currentTimezone = () => {
    let offSet = new Date().getTimezoneOffset();
    let hour = Math.abs(offSet) / 60;
    let minute = Math.abs(offSet) % 60;
    if (parseInt(hour) < 10) hour = "0" + hour;
    if (parseInt(minute) < 10) minute = "0" + minute;
    let timezone = (offSet > 0 ? "-" : "+") + hour + ":" + minute;
    return timezone || null;
}

export const formatCurrency = (number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

export const getAssetsImages = (name) => {
    const cleanName = name.split('.')[0];

    const imageEntries = Object.entries(images);
    const imagePath = imageEntries.find(([path]) => {
        // Get just the filename part
        const fileName = path.split('/').pop();

        // Exact match for the complete filename
        if (name.includes('.')) {
            // If extension is provided, match exactly
            return fileName === name;
        } else {
            // If no extension, match the base name exactly
            const fileNameWithoutExt = fileName.split('.')[0];
            return fileNameWithoutExt === cleanName;
        }
    });

    if (imagePath) {
        return imagePath[1].default || imagePath[1];
    }

    console.warn(`Image not found: ${name}`);
    return null;
}

export const removeInitialTableQuery = (query, defaultValues = []) => {
    const newQuery = { ...query };
    const keysToRemove = new Set([...APP_CONFIG.tableDefaultQueryRemove, ...defaultValues]);
    keysToRemove.forEach(key => delete newQuery[key]);
    return newQuery;
};

export const addCommas = (nStr) => {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

export const mainPath = () => {
    const role = getStorage('role') === 'admin' ? 'admin' : 'user';
    const routes = getRoutesByRole(role)
    const findRoute = routes.find(i => can(i.permission))
    if (findRoute?.path) {
        return findRoute.path;
    }
    else if (role) return `/${role}`
    return '/'
}