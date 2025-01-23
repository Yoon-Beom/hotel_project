// client/src/utils/dateUtils.js
/**
 * 날짜 관련 유틸리티 함수들
 * @module dateUtils
 */

/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환합니다.
 * @function formatDate
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} 'YYYY-MM-DD' 형식의 날짜 문자열
 */
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 'YYYY-MM-DD' 형식의 문자열을 Date 객체로 변환합니다.
 * @function parseDate
 * @param {string} dateString - 변환할 날짜 문자열
 * @returns {Date} 변환된 Date 객체
 * @throws {Error} 유효하지 않은 날짜 형식일 경우 에러 발생
 */
export const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
        throw new Error('유효하지 않은 날짜 형식입니다.');
    }
    return date;
};

/**
 * 두 날짜 사이의 일 수를 계산합니다.
 * @function daysBetween
 * @param {Date} date1 - 첫 번째 날짜
 * @param {Date} date2 - 두 번째 날짜
 * @returns {number} 두 날짜 사이의 일 수
 */
export const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초
    return Math.round(Math.abs((date1 - date2) / oneDay));
};

/**
 * JavaScript Date 객체를 Unix 타임스탬프로 변환합니다.
 * @function dateToUnixTimestamp
 * @param {Date} date - 변환할 Date 객체
 * @returns {number} Unix 타임스탬프
 */
export const dateToUnixTimestamp = (date) => {
    return Math.floor(date.getTime() / 1000).toString();
};

/**
 * Unix 타임스탬프를 JavaScript Date 객체로 변환합니다.
 * @function unixTimestampToDate
 * @param {number} timestamp - 변환할 Unix 타임스탬프
 * @returns {Date} 변환된 Date 객체
 */
export const unixTimestampToDate = (timestamp) => new Date(timestamp * 1000);

/**
 * 현재 날짜를 반환합니다.
 * @function getCurrentDate
 * @returns {Date} 현재 날짜의 Date 객체
 */
export const getCurrentDate = () => new Date();

/**
 * 주어진 날짜가 유효한지 확인합니다.
 * @function isValidDate
 * @param {Date} date - 확인할 Date 객체
 * @returns {boolean} 날짜의 유효성 여부
 */
export const isValidDate = (date) => date instanceof Date && !isNaN(date);

