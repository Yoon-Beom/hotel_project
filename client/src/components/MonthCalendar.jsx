import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/components/MonthCalendar.css';
import TotalFor3Years from './TotalFor3Years';

const MonthCalendar = ({ month }) => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [showStats, setShowStats] = useState(false);
    const [isRangeSelection, setIsRangeSelection] = useState(true);

    const bookingData = useMemo(() => {
        const data = {};
        const daysInMonth = new Date(2025, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            data[`2025-${month + 1}-${day}`] = Math.floor(Math.random() * 31);
        }
        return data;
    }, [month]);

    const formatDate = (date) => {
        if (!date) return '-월-일';
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const handleDateChange = (dates) => {
        if (!isRangeSelection) {
            // 통계보기 모드
            setSelectedDates([dates]);
            setShowStats(true);
        } else {
            // 체크인/아웃 선택 모드
            if (Array.isArray(dates)) {
                setSelectedDates(dates);
                setShowStats(false);
            } else {
                if (selectedDates.length === 0 || selectedDates.length === 2) {
                    setSelectedDates([dates]);
                } else if (selectedDates.length === 1 && dates > selectedDates[0]) {
                    setSelectedDates([selectedDates[0], dates]);
                } else {
                    setSelectedDates([dates]);
                }
            }
        }
    };

    const handleModeToggle = (isRange) => {
        if (isRange) {
            // 체크인/아웃 모드로 전환
            setIsRangeSelection(true);
            setSelectedDates([]);
            setShowStats(false);
        } else {
            // 통계보기 모드로 전환
            setIsRangeSelection(false);
            // 오늘 날짜를 기본값으로 설정
            const today = new Date(2025, month, 1); // 2025년 해당 월의 1일로 설정
            setSelectedDates([today]);
            setShowStats(true);
        }
    };

    return (
        <div className="calendar-container">
            <div className="mode-toggle">
                <button
                    onClick={() => handleModeToggle(false)}
                    className={`mode-button ${!isRangeSelection ? 'active' : ''}`}
                >
                    통계 보기
                </button>
                <button
                    onClick={() => handleModeToggle(true)}
                    className={`mode-button ${isRangeSelection ? 'active' : ''}`}
                >
                    체크인/아웃 선택
                </button>
            </div>
            <div className="calendar-stats-wrapper">
                <div className={`calendar-section ${showStats ? 'with-stats' : ''}`}>
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDates}
                        selectRange={isRangeSelection}
                        activeStartDate={new Date(2025, month)}
                        navigationLabel={({ date }) => (
                            <div className="navigation-label">
                                <div className="check-date">
                                    <div>체크인</div>
                                    <div>{selectedDates[0] ? formatDate(selectedDates[0]) : '-월-일'}</div>
                                </div>
                                <span className="current-month">{date.getFullYear()}년 {date.getMonth() + 1}월</span>
                                <div className="check-date">
                                    <div>체크아웃</div>
                                    <div>{selectedDates[1] ? formatDate(selectedDates[1]) : '-월-일'}</div>
                                </div>
                            </div>
                        )}
                        tileContent={({ date }) => {
                            const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                            const bookingCount = bookingData[dateStr] || 0;
                            return <p className="booking-count">{bookingCount}</p>;
                        }}
                        tileClassName={({ date }) => {
                            let classes = [];
                            if (selectedDates && selectedDates.length === 2) {
                                if (date >= selectedDates[0] && date <= selectedDates[1]) {
                                    classes.push('in-range');
                                }
                            }
                            if (date.getDay() === 0 || date.getDay() === 6) {
                                classes.push('weekend');
                            }
                            return classes.join(' ');
                        }}
                    />
                </div>
                {!isRangeSelection && showStats && (
                    <div className="stats-section">
                        <TotalFor3Years selectedDate={selectedDates[0] || new Date(2025, month, 1)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthCalendar;