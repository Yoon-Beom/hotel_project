// client/src/pages/StatisticsPage.jsx
import React, { useState, useCallback, useMemo } from 'react';
import MonthCalendar from '../components/calendar/MonthCalendar';
import useStatistics from '../hooks/useStatistics';
import { getCurrentDate } from '../utils/dateUtils';
import '../styles/pages/StatisticsPage.css';

const StatisticsPage = () => {
    const currentDate = useMemo(() => getCurrentDate(), []);
    const currentYear = Math.floor(currentDate / 10000);
    const currentMonth = Math.floor((currentDate % 10000) / 100) - 1;

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const { fetchMonthlyReservations, isLoading, error } = useStatistics();

    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    // 현재 날짜로 이동하는 핸들러
    const handleCurrentDate = useCallback(() => {
        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
    }, [currentYear, currentMonth]);

    const handleMonthClick = useCallback((index) => {
        setSelectedMonth(index);
    }, []);

    const handleYearChange = useCallback((change) => {
        setSelectedYear(prevYear => prevYear + change);
    }, []);

    if (isLoading) return <div className="loading">통계 데이터를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;

    return (
        <div className="statistics-page">
            <h1>예약 통계</h1>
            <div className="navigation-controls">
                <div className="year-selector">
                    <button onClick={() => handleYearChange(-1)}>이전 년도</button>
                    <span>{selectedYear}년</span>
                    <button onClick={() => handleYearChange(1)}>다음 년도</button>
                </div>
                <button 
                    className="current-date-button"
                    onClick={handleCurrentDate}
                >
                    현재 월로 이동
                </button>
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
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                    fetchMonthlyReservations={fetchMonthlyReservations}
                />
            )}
        </div>
    );
};

export default StatisticsPage;
