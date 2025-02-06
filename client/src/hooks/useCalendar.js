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
    const [displayMode, setDisplayMode] = useState('none');

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
        let start, end;

        if (Array.isArray(selectDate)) {
            [start, end] = selectDate;
        } else {
            start = selectDate;
            end = null;
        }

        const normalizedStart = start ? normalizeCalendarDate(start) : null;
        const normalizedEnd = end ? normalizeCalendarDate(end) : null;

        // 단일 선택
        if (end == null) {
            setSelectedDates([normalizedStart, null]);
            setDisplayMode('none');
            return;
        }

        // 체크인 날짜와 동일한 날짜 선택
        if (normalizedStart.getTime() === normalizedEnd.getTime()) {
            console.log("HotelChart 출력");
            setSelectedDates([normalizedStart, null]);
            setDisplayMode('single');
            return;
        }

        // A < 현재, 현재<= B
        if (normalizedStart < initialDate && initialDate <= normalizedEnd) {
            console.log("A < 현재, 현재<= B");
            setSelectedDates([normalizedStart, null]);
            setDisplayMode('none');
            return;
        }

        // A < B, B <= 현재
        if (normalizedStart < initialDate && normalizedEnd < initialDate) {
            console.log("A < B, B <= 현재");
            setSelectedDates([normalizedStart, null]);
            setDisplayMode('none');
            return;
        }

        // 30일 초과 체크
        const daysDiff = calculateDaysDiff(normalizedEnd, normalizedStart);
        if (daysDiff > 30) {
            alert('최대 30일까지만 예약 가능합니다.');
            setDisplayMode('none');
            return;
        }

        setSelectedDates([normalizedStart, normalizedEnd]);
        setDisplayMode('range');
        return;
    }, [selectedDates, initialDate]);


    return {
        selectedDates,
        currentDate,
        setCurrentDate,
        handleDateChange,
        isDateInPast,
        displayMode
    };
};