// client/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import useStatistics from '../hooks/useStatistics';
import { formatDate } from '../utils/dateUtils';

/**
 * 홈페이지 컴포넌트
 * 다양한 통계 데이터를 표시합니다.
 * @returns {JSX.Element} HomePage 컴포넌트
 */
const HomePage = () => {
    const {
        fetchMonthlyReservations,
        fetchDailyReservations,
        fetchReservationsByDate,
        isLoading,
        error
    } = useStatistics();

    const [monthlyData, setMonthlyData] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    const [dateData, setDateData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            // 월별 예약 통계
            const monthly = await fetchMonthlyReservations();
            setMonthlyData(monthly);
            console.log("monthly: ", monthly);

            // 2025년 2월의 일별 예약 데이터
            const daily = await fetchDailyReservations(2025, 2);
            setDailyData(daily);

            // 오늘 날짜의 호텔별 예약 데이터
            const today = formatDate(new Date());
            const byDate = await fetchReservationsByDate(today);
            setDateData(byDate);
        };
        loadData();
    }, [fetchMonthlyReservations, fetchDailyReservations, fetchReservationsByDate]);

    if (isLoading) return <div>데이터를 불러오는 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;

    return (
        <div>
            <h1>호텔 예약 시스템 홈페이지</h1>

            <h2>최근 4년간 월별 예약 통계</h2>
            {monthlyData && (
                <ul>
                    {Object.entries(monthlyData).map(([month, yearData]) => (
                        <li key={month}>
                            {month}월:
                            {Object.entries(yearData).map(([year, count]) => (
                                <span key={year}> {year}년: {count}건 </span>
                            ))}
                        </li>
                    ))}
                </ul>
            )}

            <h2>2025년 2월 일별 예약 통계</h2>
            {dailyData && (
                <ul>
                    {Object.entries(dailyData).map(([day, count]) => (
                        <li key={day}>{day}일: {count}건</li>
                    ))}
                </ul>
            )}

            <h2>오늘 날짜 호텔별 예약 통계</h2>
            {dateData && (
                <ul>
                    {Object.entries(dateData).map(([hotelId, yearData]) => (
                        <li key={hotelId}>
                            호텔 ID {hotelId}:
                            {yearData.map((count, index) => (
                                <span key={index}> {new Date().getFullYear() - 3 + index}년: {count}건 </span>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HomePage;
