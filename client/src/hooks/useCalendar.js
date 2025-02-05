// client/src/hooks/useCalendar.js
import { useState, useCallback, useMemo } from 'react';
import { normalizeCalendarDate, calculateDaysDiff } from '../utils/calendarUtils';

/**
 * 캘린더 상태와 날짜 선택 로직을 관리하는 커스텀 훅
 * @function useCalendar
 * @returns {Object} 캘린더 관련 상태와 함수들
 * @property {Array<Date>} selectedDates - 선택된 날짜들 [체크인, 체크아웃]
 * @property {Date} currentDate - 현재 표시되는 달력의 날짜
 * @property {Function} setCurrentDate - 현재 날짜 설정 함수
 * @property {Function} handleDateChange - 날짜 선택 처리 함수
 */
export const useCalendar = () => {
    const initialDate = useMemo(() => normalizeCalendarDate(new Date()), []);
    const [selectedDates, setSelectedDates] = useState([initialDate, null]);
    const [currentDate, setCurrentDate] = useState(initialDate);

    /**
     * 날짜가 과거인지 확인하는 함수
     * @function isDateInPast
     * @param {Date} date - 확인할 날짜
     * @returns {boolean} 과거 날짜 여부
     */
    const isDateInPast = useCallback((date) => {
        const normalizedDate = normalizeCalendarDate(date);
        return normalizedDate < initialDate;
    }, [initialDate]);

    /**
     * 날짜 선택을 처리하는 콜백 함수
     * @function handleDateChange
     * @param {Date} selectDate - 선택된 날짜
     */
    const handleDateChange = useCallback((selectDate) => {
        const [start, end] = selectDate;
        const normalizedStart = normalizeCalendarDate(start);
        const normalizedEnd = end ? normalizeCalendarDate(end) : null;
        console.log("selectDate[0]: ", selectDate[0]);
        console.log("selectDate[1]: ", selectDate[1]);
        console.log("normalizedStart: ", normalizedStart);
        console.log("normalizedEnd: ", normalizedEnd);

        // 시작 상태 (둘 다 null)
        if (!selectedDates[0] && !selectedDates[1]) {
            setSelectedDates([initialDate, null]);
            console.log("=================================================");
            return;
        }

        // 과거 날짜 선택
        if (normalizedStart < initialDate) {
            console.log("과거 날짜 선택");
            setSelectedDates([normalizedStart, null]);
            console.log("=================================================");
            return;
        }

        // 체크인 날짜와 동일한 날짜 선택
        if (normalizedEnd !== null && (normalizedStart.getTime() === normalizedEnd.getTime())
        ) {
            console.log("체크인 날짜와 동일한 날짜 선택");
            setSelectedDates([normalizedStart, null]);
            console.log("=================================================");
            return;
        }

        // 유효하지 않은 종료 날짜 체크 (1970년도 체크)
        if (normalizedEnd === null || normalizedEnd.getFullYear() < 2000) {
            console.log("유효하지 않은 종료 날짜 체크 (1970년도 체크)");
            setSelectedDates([normalizedStart, null]);
            console.log("=================================================");
            return;
        }

        // 30일 초과 체크
        const daysDiff = calculateDaysDiff(normalizedEnd, normalizedStart);
        if (daysDiff > 30) {
            alert('최대 30일까지만 예약 가능합니다.');
            console.log("=================================================");
            return;
        }

        setSelectedDates([normalizedStart, normalizedEnd]);
        console.log("=================================================");
        return;
    }, [selectedDates, initialDate]);


    return {
        selectedDates,
        currentDate,
        setCurrentDate,
        handleDateChange,
        isDateInPast
    };
};