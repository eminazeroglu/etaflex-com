import React from 'react';
import { createRoot } from 'react-dom/client';
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Button } from "@/components/ui";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { translate } from "@/utils/localeUtil.jsx";
import { MdOutlineCancel } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { CgSpinner } from "react-icons/cg";
import { FiX } from "react-icons/fi";

// Alert tipləri konfiqurasiyası
const ALERT_TYPES = {
    info: {
        icon: HiOutlineInformationCircle,
        iconColor: 'text-[#0077B6]',
    },
    success: {
        icon: IoCheckmarkCircleOutline,
        iconColor: 'text-green-500',
    },
    error: {
        icon: MdOutlineCancel,
        iconColor: 'text-red-500',
    },
    warning: {
        icon: PiWarningCircle,
        iconColor: 'text-yellow-500'
    },
    loading: {
        icon: CgSpinner,
        iconColor: 'text-primary',
    }
};

// Aktiv alert-ləri saxlamaq üçün Map
const activeAlerts = new Map();

// Alert üçün unikal key yaratmaq
const createAlertKey = (config) => {
    return JSON.stringify({
        message: config.message,
        type: config.type,
        title: config.title
    });
};

export const showAlert = (
    {
        title = translate('notification.warningTitle'),
        message,
        type = 'info',
        actionButtonText = translate('button.yes'),
        closeButtonText = translate('button.no'),
        denyButtonText = translate('button.no'),
        showCloseButton = true,
        showXButton = false,
        showActionButton = true,
        showDenyButton = false,
        onAction,
        onClose,
        onDeny,
        onCommon,
        duration = 0,
        loading = false,
        maxHeight = '70vh'
    }
) => {
    // Alert konfiqurasiyası üçün unikal key yaradırıq
    const alertKey = createAlertKey({ title, message, type });

    // Əgər eyni alert artıq mövcuddursa, yenisini yaratmırıq
    if (activeAlerts.has(alertKey)) {
        return () => {
        };
    }

    const alertContainer = document.createElement('div');
    document.body.appendChild(alertContainer);
    const root = createRoot(alertContainer);

    // Alert-i aktiv siyahıya əlavə edirik
    activeAlerts.set(alertKey, alertContainer);

    const removeAlert = (isClose = true) => {
        // Alert-i aktiv siyahıdan silirik
        activeAlerts.delete(alertKey);

        root.unmount();
        document.body.removeChild(alertContainer);
        document.body.style.overflow = 'unset';

        if (onClose && isClose) onClose();
        else if (onCommon) onCommon();
    };

    const handleAction = () => {
        if (onAction) {
            onAction();
        }
        else if (onCommon) onCommon();
        if (!loading) removeAlert(false);
    };

    const handleDeny = () => {
        if (onDeny) {
            onDeny();
        }
        else if (onCommon) onCommon();
        if (!loading) removeAlert();
    }

    const alertConfig = loading ? ALERT_TYPES.loading : ALERT_TYPES[type] || ALERT_TYPES.info;
    const AlertIcon = alertConfig.icon;

    if (duration > 0) {
        setTimeout(removeAlert, duration);
    }

    document.body.style.overflow = 'hidden';

    const Alert = () => {
        const [isVisible, setIsVisible] = React.useState(false);

        React.useEffect(() => {
            requestAnimationFrame(() => setIsVisible(true));

            const handleEscape = (e) => {
                if (e.key === 'Escape' && !loading) removeAlert();
            };

            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }, []);

        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                <div
                    className={`
                        absolute inset-0 bg-black/40 backdrop-blur-sm
                        transition-opacity duration-300
                        ${isVisible ? 'opacity-100' : 'opacity-0'}
                    `}
                    onClick={() => !loading && removeAlert()}
                />

                <div className={`
                    relative
                    bg-white
                    dark-bg-light-mute
                    rounded-lg
                    py-[16px]
                    max-w-sm
                    w-[90%]
                    shadow-lg
                    transform
                    transition-all
                    duration-300
                    ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'}
                `}>
                    {showXButton && !loading && (
                        <button
                            onClick={removeAlert}
                            className="absolute size-6 rounded-lg inline-flex items-center justify-center bg-primary text-white -top-2 -right-2 transition-colors"
                        >
                            <FiX />
                        </button>
                    )}

                    <div>
                        <div className="flex gap-[12px] px-[16px]">
                            <div className="flex justify-center">
                                <AlertIcon
                                    className={`
                                    w-7 h-7 theme-text-mute ${alertConfig.iconColor}
                                    ${loading ? 'animate-spin' : ''}
                                `}
                                />
                            </div>

                            {title && (
                                <h3
                                    className="flex-1 text-xl font-semibold text-gray-900 theme-text"
                                    dangerouslySetInnerHTML={{ __html: title }}
                                />
                            )}
                        </div>

                        <div
                            className="mt-3 overflow-y-auto px-[16px]"
                            style={{ maxHeight }}
                        >
                            {message && (
                                <div className="text-mute text-sm">
                                    {typeof message === 'string' ? (
                                        <p dangerouslySetInnerHTML={{ __html: message }} />
                                    ) : message}
                                </div>
                            )}
                        </div>
                    </div>

                    {(showCloseButton || showActionButton) && (
                        <div className="flex mt-[12px] justify-end space-x-[8px] px-[16px]">
                            {showCloseButton && !loading && (
                                <Button
                                    property="secondary"
                                    onClick={removeAlert}
                                >
                                    {closeButtonText}
                                </Button>
                            )}
                            {showDenyButton && (
                                <Button
                                    property="secondary"
                                    onClick={handleDeny}
                                    disabled={loading}
                                >
                                    {denyButtonText}
                                </Button>
                            )}
                            {showActionButton && (
                                <Button
                                    onClick={handleAction}
                                    disabled={loading}
                                >
                                    {actionButtonText}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    root.render(<Alert />);
    return removeAlert;
};

export const showConfirmAlert = async ({ onAction, onClose, onCommon }) => {
    await showAlert({
        message: translate('notification.alertConfirm'),
        onAction,
        onClose,
        onCommon
    });
};

export const showDeleteAlert = async ({ onAction, onClose, onCommon }) => {
    await showAlert({
        message: translate('notification.alertConfirmDelete'),
        onAction,
        onClose,
        onCommon
    });
};