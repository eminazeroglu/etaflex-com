/**
 * Verilən stringi PascalCase formatına çevirir.
 * @param {string} str - Çevriləcək string
 * @returns {string} PascalCase formatında string
 */
export function toPascalCase(str) {
    return str.split(/[-_.\s]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

/**
 * Verilən stringi camelCase formatına çevirir.
 * @param {string} str - Çevriləcək string
 * @returns {string} camelCase formatında string
 */
export function toCamelCase(str) {
    return str.split(/[-_.\s]/).map((word, index) =>
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');
}

/**
 * Verilən stringi kebab-case formatına çevirir.
 * @param {string} str - Çevriləcək string
 * @returns {string} kebab-case formatında string
 */
export function toKebabCase(str) {
    return str.split(/[\s_.]/)
        .map(word => word.toLowerCase())
        .join('-');
}

/**
 * Verilən stringi snake_case formatına çevirir.
 * @param {string} str - Çevriləcək string
 * @returns {string} snake_case formatında string
 */
export function toSnakeCase(str) {
    return str.split(/[\s-.]/)
        .map(word => word.toLowerCase())
        .join('_');
}

/**
 * Verilən stringin ilk hərfini böyük edir.
 * @param {string} str - Çevriləcək string
 * @returns {string} İlk hərfi böyük olan string
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Verilən stringdə təkrarlanan boşluqları tək boşluqla əvəz edir.
 * @param {string} str - Təmizlənəcək string
 * @returns {string} Təmizlənmiş string
 */
export function trimExtraSpaces(str) {
    return str.replace(/\s+/g, ' ').trim();
}

/**
 * Verilən stringi tələb olunan uzunluğa qədər doldurur.
 * @param {string} str - Doldurulacaq string
 * @param {number} length - Hədəf uzunluq
 * @param {string} [char=' '] - Doldurma üçün istifadə ediləcək simvol
 * @returns {string} Doldurulmuş string
 */
export function padString(str, length, char = ' ') {
    return str.padEnd(length, char);
}

/**
 * Verilən stringdə xüsusi simvolları təmizləyir.
 * @param {string} str - Təmizlənəcək string
 * @returns {string} Təmizlənmiş string
 */
export function removeSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Verilən stringi tələb olunan uzunluğa qədər kəsir və '...' əlavə edir.
 * @param {string} str - Kəsiləcək string
 * @param {number} maxLength - Maksimum uzunluq
 * @returns {string} Kəsilmiş string
 */
export function truncate(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
}

/**
 * Verilən stringdə axtarılan sözü yenisi ilə əvəz edir.
 * @param {string} str - Orijinal string
 * @param {string} search - Axtarılan söz
 * @param {string} replace - Əvəz ediləcək söz
 * @returns {string} Yenilənmiş string
 */
export function replaceAll(str, search, replace) {
    return str.split(search).join(replace);
}

/**
 * Verilən stringi tərsinə çevirir.
 * @param {string} str - Çevriləcək string
 * @returns {string} Tərsinə çevrilmiş string
 */
export function reverse(str) {
    return str.split('').reverse().join('');
}

/**
 * Verilən stringdə hər sözün ilk hərfini böyük edir.
 * @param {string} str - Çevriləcək string
 * @returns {string} Hər sözün ilk hərfi böyük olan string
 */
export function titleCase(str) {
    return str.toLowerCase().split(' ').map(word => capitalize(word)).join(' ');
}

/**
 * String formatında olan "true" və "false" dəyərlərini boolean tipinə çevirir.
 * @param {string} value - Çevriləcək dəyər
 * @returns {boolean} Çevrilmiş boolean dəyər
 */
export const toBoolean = (value) => {
    const stringValue = String(value).toLowerCase();
    return stringValue === "true";
};