// client/src/pages/StatisticsPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import useStatistics from '../hooks/useStatistics';
import { formatDate } from '../utils/dateUtils';
import MonthCalendar from '../components/calendar/MonthCalendar';
import DailyChart from '../components/charts/DailyChart';
import HotelChart from '../components/charts/HotelChart';
import '../styles/pages/StatisticsPage.css';

const StatisticsPage = () => {
    const { 
        fetchMonthlyReservations, 
        fetchDailyReservations,
        fetchReservationsByDate,
        isLoading, 
        error 
    } = useStatistics();

    // 날짜 관련 상태
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    
    // 차트 데이터 상태
    const [dailyData, setDailyData] = useState(null);
    const [dateData, setDateData] = useState(null);

    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    // 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            try {
                // 선택된 연도와 월의 일별 예약 데이터
                const daily = await fetchDailyReservations(selectedYear, selectedMonth + 1);
                setDailyData(daily);

                // 오늘 날짜의 호텔별 예약 데이터
                const today = formatDate(new Date());
                const byDate = await fetchReservationsByDate(today);
                setDateData(byDate);
            } catch (err) {
                console.error("데이터 로드 중 오류:", err);
            }
        };
        loadData();
    }, [selectedYear, selectedMonth, fetchDailyReservations, fetchReservationsByDate]);

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

    if (isLoading) return <div className="loading">데이터를 불러오는 중...</div>;
    if (error) return <div className="error">에러 발생: {error}</div>;

    return (
        <div className="statistics-page">
            <h1>상세 통계</h1>

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

            {/* 일별 예약 차트 */}
            {dailyData && (
                <div className="chart-section">
                    <DailyChart 
                        dailyData={dailyData}
                        year={selectedYear}
                        month={selectedMonth + 1}
                    />
                </div>
            )}

            {/* 달력 */}
            {/* {selectedMonth !== null && (
                <div className="calendar-section">
                    <MonthCalendar 
                        year={selectedYear}
                        month={selectedMonth}
                        onMonthChange={setSelectedMonth}
                        onYearChange={setSelectedYear}
                        fetchMonthlyReservations={fetchMonthlyReservations}
                    />
                </div>
            )} */}

            {/* 호텔별 예약 차트 */}
            {/* {dateData && (
                <div className="chart-section">
                    <HotelChart 
                        reservationData={dateData}
                        selectedDate={new Date()}
                    />
                </div>
            )} */}
        </div>
    );
};

export default StatisticsPage;
