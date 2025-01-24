import React, { useState, useCallback } from 'react';
import MonthCalendar from '../components/MonthCalendar';
import useStatistics from '../hooks/useStatistics';
import { getCurrentDate } from '../utils/dateUtils';
import '../styles/pages/StatisticsPage.css';

/**
 * 통계 페이지 컴포넌트
 * 월별 예약 통계를 표시합니다.
 * @component
 * @returns {JSX.Element} StatisticsPage 컴포넌트
 */
const StatisticsPage = () => {
    const currentDate = getCurrentDate();
    const currentYear = Math.floor(currentDate / 10000);
    const currentMonth = Math.floor((currentDate % 10000) / 100) - 1;

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const { fetchMonthlyReservations, isLoading, error } = useStatistics();

    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    /**
     * 월 선택 핸들러
     * @function handleMonthClick
     * @param {number} index - 선택된 월의 인덱스 (0-11)
     */
    const handleMonthClick = useCallback((index) => {
        setSelectedMonth(index);
    }, []);

    /**
     * 년도 변경 핸들러
     * @function handleYearChange
     * @param {number} change - 년도 변경값 (+1 또는 -1)
     */
    const handleYearChange = useCallback((change) => {
        setSelectedYear(prevYear => prevYear + change);
    }, []);

    if (isLoading) return <div className="loading">통계 데이터를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;

    return (
        <div className="statistics-page">
            <h1>예약 통계</h1>
            <div className="year-selector">
                <button onClick={() => handleYearChange(-1)}>이전 년도</button>
                <span>{selectedYear}년</span>
                <button onClick={() => handleYearChange(1)}>다음 년도</button>
            </div>
            <div className="month-buttons">
                {months.map((month, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleMonthClick(index)}
                        className={selectedMonth === index ? 'selected' : ''}
                    >
                        {month}
                    </button>
                ))}
            </div>
            {selectedMonth !== null && (
                <MonthCalendar 
                    year={selectedYear}
                    month={selectedMonth} 
                    fetchMonthlyReservations={fetchMonthlyReservations}
                />
            )}
        </div>
    );
};

export default StatisticsPage;
