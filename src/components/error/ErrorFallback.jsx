import React, { useState, useEffect } from 'react';
import { Alert } from "@/components/ui/index.jsx";

export function ErrorFallback({ error, resetError }) {
    // Avtomatik yeniləmə üçün state və countdown
    const [countdown, setCountdown] = useState(10);
    const [isAutoReloadEnabled, setIsAutoReloadEnabled] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Xətanın baş vermə vaxtını qeyd edirik
    const [errorTime] = useState(new Date().toLocaleTimeString());

    // Avtomatik yeniləmə məntiqini idarə edir
    useEffect(() => {
        let timer;
        if (isAutoReloadEnabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (isAutoReloadEnabled && countdown === 0) {
            window.location.reload();
        }
        return () => clearInterval(timer);
    }, [countdown, isAutoReloadEnabled]);

    // Xətanın tipini və onunla bağlı məlumatları müəyyən edir
    const getErrorContent = () => {
        // Şəbəkə xətası
        if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
            return {
                title: 'Şəbəkə xətası',
                message: 'İnternet bağlantınızı yoxlayın və yenidən cəhd edin',
                icon: '📡',
                suggestion: 'İnternet bağlantınızı yoxlayın və ya başqa bir şəbəkə istifadə edin',
                color: 'yellow'
            };
        }
        // 404 xətası
        if (error?.status === 404 || error?.message?.includes('not found')) {
            return {
                title: 'Səhifə tapılmadı',
                message: 'Axtardığınız səhifə mövcud deyil və ya silinib',
                icon: '🔍',
                suggestion: 'URL-i yoxlayın və ya ana səhifəyə qayıdın',
                color: 'blue'
            };
        }
        // İcazə xətası
        if (error?.status === 403 || error?.message?.includes('forbidden')) {
            return {
                title: 'Giriş qadağandır',
                message: 'Bu səhifəyə baxmaq üçün icazəniz yoxdur',
                icon: '🔒',
                suggestion: 'Hesabınıza yenidən daxil olun və ya admin ilə əlaqə saxlayın',
                color: 'red'
            };
        }
        // Default xəta
        return {
            title: 'Xəta baş verdi',
            message: error?.message || 'Gözlənilməz xəta baş verdi',
            icon: '⚠️',
            suggestion: 'Zəhmət olmasa bir az sonra yenidən cəhd edin',
            color: 'red'
        };
    };

    const errorContent = getErrorContent();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                <Alert type={errorContent.color} className="backdrop-blur-sm bg-white/95 shadow-2xl border-2 transition-all duration-300">
                    {/* Xəta başlığı */}
                    <div className="flex items-center gap-3 text-xl font-semibold mb-4">
                        <span className="text-2xl animate-bounce">{errorContent.icon}</span>
                        <span className="text-gray-800">{errorContent.title}</span>
                    </div>

                    <div className="mt-2">
                        {/* Xəta məlumatları */}
                        <div className="text-base text-gray-600 mb-6 space-y-2">
                            <p>{errorContent.message}</p>
                            <p className="text-sm text-gray-500 italic">
                                Məsləhət: {errorContent.suggestion}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Əsas düymələr */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => window.history.back()}
                                    className="btn btn--danger flex-1 min-w-[140px] flex items-center justify-center gap-2 transform hover:scale-105 transition-transform duration-200"
                                >
                                    <span className="transform hover:-translate-x-1 transition-transform">←</span>
                                    Geri qayıt
                                </button>
                                <button
                                    onClick={() => {
                                        resetError?.();
                                        window.location.reload();
                                    }}
                                    className="btn btn--primary flex-1 min-w-[140px] flex items-center justify-center gap-2 transform hover:scale-105 transition-transform duration-200"
                                >
                                    <span className="animate-spin-slow">↻</span>
                                    Yenilə
                                </button>
                            </div>

                            {/* Əlavə əməliyyatlar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="btn btn--ghost text-sm hover:text-blue-600 transition-colors duration-200"
                                >
                                    Ana səhifəyə qayıt
                                </button>

                                <div className="flex items-center gap-4">
                                    {/* Avtomatik yeniləmə seçimi */}
                                    <label className="inline-flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-blue-600 transition-all duration-200
                                                     group-hover:ring-2 group-hover:ring-blue-300"
                                            checked={isAutoReloadEnabled}
                                            onChange={() => {
                                                setIsAutoReloadEnabled(!isAutoReloadEnabled);
                                                setCountdown(10);
                                            }}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Avtomatik yenilə
                                            {isAutoReloadEnabled && (
                                                <span className="ml-1 text-blue-600 font-medium">
                                                    ({countdown}s)
                                                </span>
                                            )}
                                        </span>
                                    </label>

                                    {/* Texniki detalları göstər/gizlət */}
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                    >
                                        {showDetails ? 'Detalları gizlət' : 'Detalları göstər'}
                                    </button>
                                </div>
                            </div>

                            {/* Texniki detallar */}
                            {showDetails && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-500 space-y-1">
                                    <p>Xəta vaxtı: {errorTime}</p>
                                    <p>Xəta tipi: {error?.name || 'Naməlum'}</p>
                                    <p>Status: {error?.status || 'Naməlum'}</p>
                                    {error?.stack && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer hover:text-gray-700">
                                                Stack trace
                                            </summary>
                                            <pre className="mt-2 whitespace-pre-wrap">
                                                {error.stack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Alert>
            </div>
        </div>
    );
}