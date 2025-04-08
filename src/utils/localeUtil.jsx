import {APP_CONFIG} from "@/config/appConfig.jsx";
import store from "@/store/index.jsx";
import React from "react";

let role = store.getState().auth.role === 'user' ? 'user' : 'admin';

let localeFiles;

if (role === 'admin')
    localeFiles = import.meta.glob(`../locales/admin/*.js`, {eager: true});
else
    localeFiles = import.meta.glob(`../locales/user/*.js`, {eager: true});

const locales = Object.keys(localeFiles).reduce((acc, path) => {
    const langCode = path.match(/\.\/locales\/(.+)\.js/)[1];
    acc[langCode] = localeFiles[path].default;
    return acc;
}, {});

const defaultLanguage = APP_CONFIG.defaultLanguage;

function getSystemLanguage() {
    return defaultLanguage;
}

export function translate(key, params = {}) {
    const selectedLocale = locales[`${role}/${defaultLanguage}`];

    const keys = key?.split('.');
    let result = selectedLocale;

    if (keys && keys.length > 0) {

        for (const k of keys) {
            if (result && result.hasOwnProperty(k)) {
                result = result[k];
            } else {
                return key; // Tapılmadıqda açarı qaytarırıq
            }
        }

        if (typeof result !== 'string') {
            return result;
        }

        const parts = result.split(/(:\w+)/);

        if (parts.length > 1) {
            const translatedParts = parts.map((part, index) => {
                if (part.startsWith(':')) {
                    const paramName = part.slice(1);
                    if (params.hasOwnProperty(paramName)) {
                        const replacement = params[paramName];
                        if (React.isValidElement(replacement)) {
                            return React.cloneElement(replacement, {key: index});
                        }
                        return replacement;
                    }
                }
                return part;
            });

            // Əgər React elementləri varsa, array qaytarırıq
            if (translatedParts.some(React.isValidElement)) {
                return translatedParts;
            }

            // Əks halda, birləşdirilmiş string qaytarırıq
            return translatedParts.join('');
        }

        return result;
    }
    else {
        return key;
    }
}

export function getCurrentLanguage() {
    return getSystemLanguage();
}

export function getAvailableLanguages() {
    return Object.keys(locales).map(i => i.replace(`${role}/`, ''));
}