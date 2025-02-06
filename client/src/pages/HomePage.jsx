// client/src/pages/HomePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import useStatistics from '../hooks/useStatistics';
import { formatDate } from '../utils/dateUtils';
import MonthlyChart from '../components/charts/MonthlyChart';
import MonthCalendar from '../components/calendar/MonthCalendar';
import '../styles/pages/HomePage.css';

const HomePage = () => {
    const { fetchMonthlyReservations, isLoading, error } = useStatistics();
    const [monthlyData, setMonthlyData] = useState(null);

    // StatisticsPage에서 가져온 상태들
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    useEffect(() => {
        const loadData = async () => {
            try {
                const monthly = await fetchMonthlyReservations();
                setMonthlyData(monthly);
            } catch (err) {
                console.error("데이터 로드 중 오류:", err);
            }
        };
        loadData();
    }, [fetchMonthlyReservations]);

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

    if (isLoading) return <div>데이터를 불러오는 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;

    return (
        <div className="home-container">
            <h1>호텔 예약 시스템 통계</h1>

            {/* 월별 예약 통계 차트 */}
            <div className="chart-section">
                {monthlyData && <MonthlyChart monthlyData={monthlyData} />}
            </div>

            {/* StatisticsPage 내용 */}
            <div className="statistics-section">
                <h2>일별 예약 현황</h2>
                <div className="navigation-controls">
                    <button
                        className="current-date-button"
                        onClick={handleCurrentDate}
                    >
                        현재 월로 이동
                    </button>
                    <div className="year-selector">
                        <button onClick={() => handleYearChange(-1)}>이전 년도</button>
                        <span>{selectedYear}년</span>
                        <button onClick={() => handleYearChange(1)}>다음 년도</button>
                    </div>
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
        </div>
    );
};

export default HomePage;
