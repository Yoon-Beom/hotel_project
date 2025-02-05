// client/src/hooks/useBookingData.js
import { useState, useEffect } from 'react';
import useStatistics from './useStatistics';

export const useBookingData = (currentDate) => {
    const [bookingData, setBookingData] = useState({});
    const { fetchDailyReservations } = useStatistics();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. 날짜 유효성 검사
                const validatedDate =
                    currentDate instanceof Date && !isNaN(currentDate)
                        ? currentDate
                        : new Date();

                // 2. API 호출 + 데이터 검증
                const dailyData = await fetchDailyReservations(
                    validatedDate.getFullYear(),
                    validatedDate.getMonth() + 1
                ) || {};

                // 3. 데이터 변환 전 타입 체크
                const safeData = typeof dailyData === 'object' && dailyData !== null
                    ? dailyData
                    : {};

                // 4. 데이터 포맷팅
                const formattedData = {};
                Object.entries(safeData).forEach(([day, count]) => {
                    const dateKey = `${validatedDate.getFullYear()}-${validatedDate.getMonth() + 1}-${day}`;
                    formattedData[dateKey] = count;
                });

                setBookingData(formattedData);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [currentDate, fetchDailyReservations]);


    return bookingData;
};
