// client/src/components/CalendarHeader.jsx
import React from 'react';
import { formatDateDisplay } from '../../utils/calendarUtils';

const CalendarHeader = ({ date, selectedDates }) => {

    return (
        <div className="navigation-label">
            <div className="check-date">
                <div>체크인</div>
                <div>{selectedDates[0] ? formatDateDisplay(selectedDates[0]) : '-월-일'}</div>
            </div>
            <span className="current-month">
                {date.getFullYear()}년 {date.getMonth() + 1}월
            </span>
            <div className="check-date">
                <div>체크아웃</div>
                <div>{selectedDates[1] ? formatDateDisplay(selectedDates[1]) : '-월-일'}</div>
            </div>
        </div>
    );
};

export default CalendarHeader;
