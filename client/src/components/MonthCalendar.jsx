// // client/src/components/MonthCalendar.jsx

import React, { useState, useMemo, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/components/MonthCalendar.css';
import TotalFor3Years from './TotalFor3Years';
import AvailableHotels from './AvailableHotels';
import useStatistics from '../hooks/useStatistics';

const MonthCalendar = ({ month }) => {
  const [selectedDates, setSelectedDates] = useState([]); // 체크인/아웃 모드: [체크인날짜, 체크아웃날짜] , 통계 모드: [선택된날짜]
  const [showStats, setShowStats] = useState(false);  // 통계 표시 여부를 관리하는 상태 => true: 통계 표시, false: 통계 숨김
  const [isRangeSelection, setIsRangeSelection] = useState(true); // 날짜 선택 모드를 관리하는 상태 => true: 체크인/아웃 선택 모드, false: 통계 보기 모드
  const [currentDate, setCurrentDate] = useState(new Date(2025, month, 1)); // 현재 표시되는 달을 관리하는 상태
  const [bookingData, setBookingData] = useState({});
  const { fetchDailyReservations } = useStatistics();

  useEffect(() => {
    setCurrentDate(new Date(2025, month, 1));
  }, [month]);
  
  
  useEffect(() => {
    const fetchBookingData = async () => {
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

    fetchBookingData();
  }, [currentDate, fetchDailyReservations]);

  // date는 react-calendar에서 기본으로 제공하는 객체인 듯.
  // calendar에서 날짜 선택하면 날짜 정보가 date를 통해 저장되고 이를 활용할 수 있는 것 같음.
  const formatDate = (date) => {
    //선택한 날짜가 null이면 '-월-일'로 표기
    if (!date) return '-월-일';
    // null 아니면 date객체를 통해 calendar상에서 선택한 달과 날짜를 -월-일 형태로 출력
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // date의 복수 버전인 듯
  // calendar상에서 25.01.22 클릭하면 date=25-01-22(단일 객체) 저장되고, 22~25 드래그 선택하면 dates = [2025-01-22, 2025-01-25](배열) 이렇게 저장되는 형태
  const handleDateChange = (dates) => {
    // 선택한 날짜를 인자로 받아서 날짜 선택 모드의 상태가 false(통계모드)라면
    if (!isRangeSelection) {
      // 통계보기 모드로 적용 (이 때 통계모드는 날짜 선택 시 단일 날짜만 가능함.)
      // dates는 단일 객체 => SelectedDates 저장위해 []로 감싸 형태 일치시켜줌.
      setSelectedDates([dates]);
      // 통계 보여줌
      setShowStats(true);
    } else {// 체크인/아웃 선택 모드(isRangeSelection => true(체크인/체크아웃모드)라면
      if (Array.isArray(dates)) { // 이미 드래그로 체크인/아웃 날짜 선택한 상태
        // dates가 배열이라면,
        //선택한 날짜들을 SelectedDates로 저장
        setSelectedDates(dates);  // dates가 [체크인, 체크아웃] 형태의 배열 타입이기 때문에 [] 씌우지 않고 그대로 저장
        //통계모드를 숨김
        setShowStats(false);
      } else { // 하루만 선택 또는 아예 선택 x 또는 
        // 어떠한 날짜도 선택하지 않았거나, 배열의 길이가 2라면(이미 체크인,체크아웃 날짜를 선택했다면) => 새롭게 날짜 선택
        if (selectedDates.length === 0 || selectedDates.length === 2) {
          //새롭게 선택한 날짜를 저장
          setSelectedDates([dates]);
        } 
        //체크인 날짜만 선택한 상태에서, 새롭게 선택한 날짜가 체크인 날짜보다 크다면(첫번째 선택 날짜보다 두 번째 선택 날짜가 더 크다면)
        else if (selectedDates.length === 1 && dates > selectedDates[0]) {
          // 첫 번째 선택날짜를 체크인 , 두 번째 선택 날짜를 체크아웃으로 저장
          setSelectedDates([selectedDates[0], dates]);
        } else {
          // 그 외의 경우 새롭게 선택한 날짜를 저장
          setSelectedDates([dates]);
        }
      }
    }
  };

  const handleModeToggle = (isRange) => { // isRange 선언 후 인자로 사용 => true: 체크인/아웃 모드, false: 통계보기 모드
    if (isRange) {
      // 체크인/아웃 모드로 전환
      setIsRangeSelection(true);
      setSelectedDates([]);
      setShowStats(false);
    } else {
      // 통계보기 모드로 전환
      setIsRangeSelection(false);
      // 통계모드로 전환 시 해당 월의 1일을 기본값으로 설정
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      setSelectedDates([today]);
      setShowStats(true);
    }
  };

  // 이전 달 또는 다음 달로 이동하는 함수
  const handleMonthChange = (increment) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + increment, 1);
      return newDate;
    });
  };

  return (
    <div className="calendar-container">
      <div className="mode-toggle">
        <button 
          onClick={() => handleModeToggle(false)}  //handleModeToggle(false) 실행
          // !isRangeSelection = !false => ture => active
          className={`mode-button ${!isRangeSelection ? 'active' : ''}`}
        >
          통계 보기
        </button>
        <button 
          onClick={() => handleModeToggle(true)}  //handleModeToggle(true) 실행
          // isRangeSelection = true => ture => active
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
            activeStartDate={currentDate}
            onActiveStartDateChange={({ activeStartDate }) => {
              setCurrentDate(activeStartDate);}}
            minDetail="month"
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
              // 적용할 CSS 클래스들을 담을 배열을 생성
              let classes = [];
              // 배열 o , 배열 길이 = 2 => 체크인/아웃 모두 선택된 경우 
              if (selectedDates && selectedDates.length === 2) {
                // 체크인 < 날짜 < 체크아웃  인 경우
                if (date >= selectedDates[0] && date <= selectedDates[1]) {
                  // css 적용 배열에 넣어줌
                  classes.push('in-range');
                }
              }
              // 주말인 경우
              if (date.getDay() === 0 || date.getDay() === 6) {
                // css 적용 배열에 넣어줌
                classes.push('weekend');
              }
              //배열에 담긴 클래스들을 공백' '으로 구분된 문자열로 바꿔줌
              return classes.join(' ');
            }}
          />
        </div>
        {!isRangeSelection && showStats && (
          //체크인/체크아웃 선택 x , 통계보기 모드 o인 경우 => 특정 선택 날짜 보내주거나 없으면 1일 날짜 데이터 보내줌
          <div className="stats-section">
            <TotalFor3Years selectedDate={selectedDates[0] || new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)} />
          </div>
        )}
        {isRangeSelection && selectedDates.length === 2 && (
          //체크인/체크아웃 선택 o , 통계보기 모드 x 인 경우 => 선택한 체크인/체크아웃 날짜 데이터 보내줌
          <div className="hotels-section">
            <AvailableHotels checkIn={selectedDates[0]} 
                              checkOut={selectedDates[1]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthCalendar;
