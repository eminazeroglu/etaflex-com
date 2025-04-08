import {getStorage} from "@/utils/localStorageUtil.jsx";

export const APP_CONFIG = {
    theme: getStorage('theme') || 'light',
    defaultLanguage: getStorage('language') ? getStorage('language') : 'en',
}