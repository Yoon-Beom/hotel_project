// client/src/utils/dateUtils.js

// 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 'YYYY-MM-DD' 형식의 문자열을 Date 객체로 변환
export const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// 두 날짜 사이의 일 수 계산
export const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초
    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays;
};
