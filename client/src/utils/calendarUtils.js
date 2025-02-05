// client/src/utils/calendarUtils.js

/**
 * 날짜의 시간을 제거하여 정규화합니다.
 * @function normalizeCalendarDate
 * @param {Date} date - 정규화할 Date 객체
 * @returns {Date} 시간이 제거된 새로운 Date 객체
 */
export const normalizeCalendarDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

/**
 * 날짜를 'M월 D일' 형식으로 포맷팅합니다.
 * @function formatDateDisplay
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} 'M월 D일' 형식의 문자열
 * @example
 * formatDateDisplay(new Date(2025, 0, 1)) // "1월 1일"
 */
export const formatDateDisplay = (date) => {
    if (!date) return '-월-일';
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

/**
 * 두 날짜 사이의 일수를 계산합니다.
 * @function calculateDaysDiff
 * @param {Date} date1 - 첫 번째 날짜
 * @param {Date} date2 - 두 번째 날짜
 * @returns {number} 두 날짜 사이의 일수
 */
export const calculateDaysDiff = (date1, date2) => {
    return Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
};

/**
 * 달력 타일의 CSS 클래스를 생성합니다.
 * @function getTileClassName
 * @param {Date} date - 타일의 날짜
 * @param {Array<Date>} selectedDates - 선택된 날짜들 [체크인, 체크아웃]
 * @returns {string} 적용할 CSS 클래스 문자열
 */
export const getTileClassName = (date, selectedDates) => {
    const classes = [];
    
    if (selectedDates?.length === 2) {
        if (date >= selectedDates[0] && date <= selectedDates[1]) {
            classes.push('in-range');
        }
    }
    
    if (date.getDay() === 0) {
        classes.push('sunday');
    } else if (date.getDay() === 6) {
        classes.push('saturday');
    }

    if (date < normalizeCalendarDate(new Date())) {
        classes.push('disabled');
    }

    return classes.join(' ');
};