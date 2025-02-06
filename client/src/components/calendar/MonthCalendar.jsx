// client/src/components/calendar/MonthCalendar.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/components/MonthCalendar.css';
import AvailableHotels from '../reservation/AvailableHotels';
import HotelChart from '../charts/HotelChart';
import CalendarHeader from './CalendarHeader';
import { useCalendar } from '../../hooks/useCalendar';
import { useBookingData } from '../../hooks/useBookingData';
import { getTileClassName } from '../../utils/calendarUtils';
import useStatistics from '../../hooks/useStatistics';

const MonthCalendar = ({
    year,
    month,
    onMonthChange,
    onYearChange
}) => {
    const {
        selectedDates,
        currentDate,
        setCurrentDate,
        handleDateChange,
        displayMode
    } = useCalendar();

    const { fetchReservationsByDate } = useStatistics();
    const [dateData, setDateData] = useState(null);
    const bookingData = useBookingData(currentDate);

    // 달력의 월이 변경될 때 호출되는 핸들러
    const handleActiveStartDateChange = ({ activeStartDate }) => {
        setCurrentDate(activeStartDate);
        onMonthChange(activeStartDate.getMonth());
        onYearChange(activeStartDate.getFullYear());
    };

    // 컴포넌트 마운트 시 또는 year/month prop이 변경될 때 달력 날짜 업데이트
    useEffect(() => {
        const newDate = new Date(year, month, 1);
        setCurrentDate(newDate);
    }, [year, month, setCurrentDate]);

    // 단일 날짜 선택시 호텔 차트 데이터 로드
    useEffect(() => {
        const loadHotelData = async () => {
            if (displayMode === 'single') {
                try {
                    const formatDate = date => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        return parseInt(`${year}${month}${day}`, 10);
                    };

                    const formattedDate = formatDate(selectedDates[0]);
                    const data = await fetchReservationsByDate(formattedDate);
                    setDateData(data);
                } catch (err) {
                    console.error("호텔 데이터 로드 중 오류:", err);
                }
            }
        };

        loadHotelData();
    }, [selectedDates, fetchReservationsByDate, displayMode]);

    return (
        <div className="calendar-container">
            <div className="calendar-stats-wrapper">
                <div className="calendar-section">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDates}
                        selectRange={true}
                        allowPartialRange={true}
                        calendarType="gregory"
                        activeStartDate={currentDate}
                        onActiveStartDateChange={handleActiveStartDateChange}
                        minDetail="month"
                        navigationLabel={({ date }) => (
                            <CalendarHeader
                                date={date}
                                selectedDates={selectedDates}
                            />
                        )}
                        tileContent={({ date }) => {
                            const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                            const bookingCount = bookingData[dateStr] || 0;
                            return <p className="booking-count">{bookingCount}</p>;
                        }}
                        tileClassName={({ date }) => getTileClassName(date, selectedDates)}
                    />
                </div>
                {displayMode === 'single' && dateData && (
                    <div className="chart-section">
                        <HotelChart
                            reservationData={dateData}
                            selectedDate={selectedDates[0]}
                        />
                    </div>
                )}

                {displayMode === 'range' && (
                    <div className="hotels-section">
                        <AvailableHotels
                            checkIn={selectedDates[0]}
                            checkOut={selectedDates[1]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthCalendar;
