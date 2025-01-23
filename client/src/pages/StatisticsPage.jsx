import React, { useState } from 'react';
import MonthCalendar from '../components/MonthCalendar';
import '../styles/pages/StatisticsPage.css';

const StatisticsPage = () => {
    // 선택한 달을 저장할 변수 설정
    const [selectedMonth, setSelectedMonth] = useState(null);
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    // 클릭한 요소의 인덱스를 selectedMonth에 저장
    const handleMonthClick = (index) => {
        setSelectedMonth(index);
    };

    return (
        <div className="statistics-page">
            <h1>통계</h1>
            <div className="month-buttons">
                {/* months 배열의 각 요소를 버튼으로 나열함*/}
                {months.map((month, index) => (
                    <button key={index} onClick={() => handleMonthClick(index)}>
                        {month}
                    </button>
                ))}
            </div>
            {/* selectedMonth(선택된 달의 인덱스)의 값이 비어있지 않을 때만 MonthCalendar컴포넌트 실행(month에 선택된 달의 인덱스를 담아 props로 넘겨줌)*/}
            {selectedMonth !== null && <MonthCalendar month={selectedMonth} />}
        </div>
    );
};

export default StatisticsPage;