// client/src/hooks/useBookingData.js
import { useState, useEffect } from 'react';
import useStatistics from './useStatistics';

export const useBookingData = (currentDate) => {
    const [bookingData, setBookingData] = useState({});
    const { fetchDailyReservations } = useStatistics();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dailyData = await fetchDailyReservations(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                );
                

                const formattedData = {};
                Object.entries(dailyData).forEach(([day, count]) => {
                    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
                    formattedData[dateKey] = count;
                });
                
                setBookingData(formattedData);
            } catch (error) {
                console.error("Error fetching daily reservations:", error);
            }
        };

        fetchData();
    }, [currentDate, fetchDailyReservations]);

    return bookingData;
};
