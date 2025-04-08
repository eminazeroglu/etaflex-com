import CryptoJS from "crypto-js";

const DEFAULT_KEY = 'etaFlex';

/**
 * Mətni şifrələyir.
 * @param {string} text - Şifrələnəcək mətn
 * @param {string} [key=DEFAULT_KEY] - Şifrələmə açarı
 * @returns {string} Şifrələnmiş mətn
 */
export const encrypt = (text, key = DEFAULT_KEY) => {
    return CryptoJS.AES.encrypt(text, key).toString();
};

/**
 * Şifrələnmiş mətni deşifrələyir.
 * @param {string} encryptedText - Deşifrələnəcək mətn
 * @param {string} [key=DEFAULT_KEY] - Deşifrələmə açarı
 * @returns {string} Deşifrələnmiş mətn
 */
export const decrypt = (encryptedText, key = DEFAULT_KEY) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Təsadüfi şifrə generasiya edir.
 * @param {number} [length=12] - Şifrənin uzunluğu
 * @returns {string} Generasiya edilmiş şifrə
 */
export const generatePassword = (length = 12) => {
    const charset = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-={}[]|;:,.<>?'
    };

    const allChars = Object.values(charset).join('');
    let password = '';

    // Hər kateqoriyadan ən azı bir simvol əlavə et
    for (let category in charset) {
        password += charset[category][Math.floor(Math.random() * charset[category].length)];
    }

    // Qalan simvolları təsadüfi seç
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Simvolların yerini qarışdır
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};

/**
 * Şifrənin gücünü yoxlayır.
 * @param {string} password - Yoxlanılacaq şifrə
 * @returns {string} Şifrənin gücü: "Zəif", "Orta", "Güclü" və ya "Çox güclü"
 */
export const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[^a-zA-Z0-9]+/)) strength++;

    switch (strength) {
        case 5:
            return "Çox güclü";
        case 4:
            return "Güclü";
        case 3:
            return "Orta";
        default:
            return "Zəif";
    }
};

export default {
    encrypt,
    decrypt,
    generatePassword,
    checkPasswordStrength
};