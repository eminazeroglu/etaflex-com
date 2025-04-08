import {decrypt, encrypt} from "@/utils/cryptoUtil.jsx";

const LocalStorage = localStorage.storage ? JSON.parse(decrypt(localStorage.storage)) : {};

const saveStorage = () => localStorage.setItem('storage', encrypt(JSON.stringify(LocalStorage)))

const storage = (key, value = false) => {
    LocalStorage[key] = value;
    saveStorage()
}

export const allStorage = () => LocalStorage;

export const getStorage = (key) => LocalStorage[key];

export const setStorage = (key, value) => storage(key, value);
export const removeStorage = (key) => {
    if (LocalStorage[key])
        delete LocalStorage[key]
    saveStorage();
};

export const clearStorage = () => {
    localStorage.removeItem('storage')
}