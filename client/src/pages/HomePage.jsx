// client/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import useStatistics from '../hooks/useStatistics';
import { formatDate } from '../utils/dateUtils';
import MonthlyChart from '../components/MonthlyChart';
import DailyChart from '../components/DailyChart';
import HotelChart from '../components/HotelChart';

/**
 * 홈페이지 컴포넌트
 * 다양한 통계 데이터를 차트로 표시합니다.
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
            try {
                // 월별 예약 통계
                const monthly = await fetchMonthlyReservations();
                setMonthlyData(monthly);
                console.log("월별 데이터:", monthly);

                // 2025년 2월의 일별 예약 데이터
                const daily = await fetchDailyReservations(2025, 2);
                setDailyData(daily);
                console.log("일별 데이터:", daily);

                // 오늘 날짜의 호텔별 예약 데이터
                const today = formatDate(new Date());
                const byDate = await fetchReservationsByDate(today);
                setDateData(byDate);
                console.log("호텔별 데이터:", byDate);
            } catch (err) {
                console.error("데이터 로드 중 오류:", err);
            }
        };
        loadData();
    }, [fetchMonthlyReservations, fetchDailyReservations, fetchReservationsByDate]);

    if (isLoading) return <div>데이터를 불러오는 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>호텔 예약 시스템 통계</h1>

            {monthlyData && (
                <MonthlyChart monthlyData={monthlyData} />
            )}

            {dailyData && (
                <DailyChart 
                    dailyData={dailyData}
                    year={2025}
                    month={2}
                />
            )}

            {dateData && (
                <HotelChart 
                    reservationData={dateData}
                    selectedDate={new Date()}
                />
            )}

            {/* 테스트용 데이터 출력 */}
            <div style={{ marginTop: '50px' }}>
                <h3>원본 데이터 (테스트용)</h3>
                <pre>{JSON.stringify({ monthlyData, dailyData, dateData }, null, 2)}</pre>
            </div>
        </div>

        
    );
};

export default HomePage;
