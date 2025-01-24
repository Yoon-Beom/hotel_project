// client/src/utils/dateUtils.js

/**
 * 날짜 관련 유틸리티 함수들
 * @module dateUtils
 */

// =============================================================================
// 기본 날짜 변환 및 포맷팅
// =============================================================================

/**
 * Date 객체를 YYYYMMDD 형식의 숫자로 변환합니다.
 * @function formatDate
 * @param {Date} date - 변환할 Date 객체
 * @returns {number} YYYYMMDD 형식의 날짜 숫자
 */
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return parseInt(`${year}${month}${day}`, 10);
};

/**
 * YYYYMMDD 형식의 숫자를 Date 객체로 변환합니다.
 * @function parseDate
 * @param {number} dateNumber - 변환할 날짜 숫자
 * @returns {Date} 변환된 Date 객체
 * @throws {Error} 유효하지 않은 날짜 형식일 경우 에러 발생
 */
export const parseDate = (dateNumber) => {
    const dateString = dateNumber.toString().padStart(8, '0');
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1;
    const day = parseInt(dateString.substring(6, 8), 10);
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
        throw new Error('유효하지 않은 날짜 형식입니다.');
    }
    return date;
};

/**
 * 'YYYY-MM-DD' 형식의 문자열을 YYYYMMDD 형식의 숫자로 변환합니다.
 * @function convertToYYYYMMDD
 * @param {string} dateString - 변환할 날짜 문자열 ('YYYY-MM-DD' 형식)
 * @returns {number} YYYYMMDD 형식의 숫자
 * @throws {Error} 유효하지 않은 날짜 형식일 경우 에러 발생
 */
export const convertToYYYYMMDD = (dateString) => {
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        throw new Error('유효하지 않은 날짜 형식입니다. YYYY-MM-DD 형식이어야 합니다.');
    }
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error('유효하지 않은 날짜 형식입니다. 숫자로 변환할 수 없습니다.');
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error('유효하지 않은 날짜입니다.');
    }

    return year * 10000 + month * 100 + day;
};

// =============================================================================
// 날짜 조작 및 계산
// =============================================================================

/**
 * 주어진 날짜의 다음 날짜를 반환합니다.
 * @function getNextDate
 * @param {number} dateNumber - 기준 날짜 (YYYYMMDD 형식)
 * @returns {number} 다음 날짜 (YYYYMMDD 형식)
 */
export const getNextDate = (dateNumber) => {
    const date = parseDate(dateNumber);
    date.setDate(date.getDate() + 1);
    return formatDate(date);
};

/**
 * 두 날짜 사이의 일 수를 계산합니다.
 * @function daysBetween
 * @param {number} date1 - 첫 번째 날짜 (YYYYMMDD 형식)
 * @param {number} date2 - 두 번째 날짜 (YYYYMMDD 형식)
 * @returns {number} 두 날짜 사이의 일 수
 */
export const daysBetween = (date1, date2) => {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초
    return Math.round(Math.abs((d1 - d2) / oneDay));
};

/**
 * 체크인 날짜부터 체크아웃 날짜까지의 모든 날짜를 배열로 반환합니다.
 * @function getDateArray
 * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
 * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
 * @returns {number[]} 체크인부터 체크아웃 전날까지의 날짜 배열 (YYYYMMDD 형식)
 */
export const getDateArray = (checkInDate, checkOutDate) => {
    const dateArray = [];
    let currentDate = checkInDate;

    while (currentDate < checkOutDate) {
        dateArray.push(currentDate);
        currentDate = getNextDate(currentDate);
    }

    return dateArray;
};

// =============================================================================
// 날짜 유효성 검사 및 정보 확인
// =============================================================================

/**
 * 주어진 날짜가 유효한지 확인합니다.
 * @function isValidDate
 * @param {number} dateNumber - 확인할 날짜 숫자 (YYYYMMDD 형식)
 * @returns {boolean} 날짜의 유효성 여부
 */
export const isValidDate = (dateNumber) => {
    try {
        parseDate(dateNumber);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * 주어진 년도가 윤년인지 확인합니다.
 * @function isLeapYear
 * @param {number} year - 확인할 년도
 * @returns {boolean} 윤년 여부
 */
export const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * 주어진 년도와 월의 일수를 반환합니다.
 * @function getDaysInMonth
 * @param {number} year - 년도
 * @param {number} month - 월 (1-12)
 * @returns {number} 해당 월의 일수
 */
export const getDaysInMonth = (year, month) => {
    if (month === 2) {
        return isLeapYear(year) ? 29 : 28;
    }
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
};

// =============================================================================
// 현재 날짜 관련
// =============================================================================

/**
 * 현재 날짜를 YYYYMMDD 형식으로 반환합니다.
 * @function getCurrentDate
 * @returns {number} 현재 날짜의 YYYYMMDD 형식 숫자
 */
export const getCurrentDate = () => formatDate(new Date());
