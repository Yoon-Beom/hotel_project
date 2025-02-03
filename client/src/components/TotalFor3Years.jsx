// client\src\components\TotalFor3Years.jsx

// 차트 라이브러리 관련 import
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// 커스텀 훅과 유틸리티
import useHotel from '../hooks/useHotel';
import useStatistics from '../hooks/useStatistics';
import { formatDate } from '../utils/dateUtils';
import '../styles/components/TotalFor3Years.css';

// 차트 애니메이션 비활성화
ChartJS.defaults.animation = false;

// 차트 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TotalFor3Years = ({ selectedDate }) => {
  const { hotels, fetchHotels } = useHotel();
  const { fetchReservationsByDate } = useStatistics();
  const [dateData, setDateData] = useState(null);

  // 호텔 데이터와 예약 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      await fetchHotels();
      const formattedDate = formatDate(selectedDate);
      const reservations = await fetchReservationsByDate(formattedDate);
      console.log("reservations: ", reservations);
      setDateData(reservations);
    };
    loadData();
  }, [fetchHotels, fetchReservationsByDate, selectedDate]);

  // 호텔별 예약 데이터 생성
  const hotelData = React.useMemo(() => {
    if (!dateData || !hotels.length) return [];
    return hotels.map(hotel => ({
      name: hotel.name,
      bookings: dateData[hotel.id] || Array(4).fill(0)
    }));
    
  }, [dateData, hotels]);

  if (!selectedDate || !hotels.length) return null;

  // 차트 데이터 구성
  const chartData = {
    labels: hotelData.map(hotel => hotel.name),
    datasets: [
      {
        label: '2022',
        data: hotelData.map(hotel => hotel.bookings[0]),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
      },
      {
        label: '2023',
        data: hotelData.map(hotel => hotel.bookings[1]),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
      },
      {
        label: '2024',
        data: hotelData.map(hotel => hotel.bookings[2]),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
      },
      {
        label: '2025',
        data: hotelData.map(hotel => hotel.bookings[3]),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
      }
    ]
  };

  // 차트 옵션 설정
  const options = {
    devicePixelRatio: 2,
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    barThickness: 14,
    maxBarThickness: 25,
    barPercentage: 0.9,
    categoryPercentage: 0.25,
    animation: {
      duration: 0,
      easing: 'linear',
    },
    layout: {
      padding: {
        top: 50,
        bottom: 50,
        left: 30,
        right: 40
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 30,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 호텔별 연간 예약 현황`,
        padding: {
          top: 20,
          bottom: 30
        },
        font: {
          size: 20,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: true,
      }
    },
    scales: {
      x: {
        position: 'top',
        stacked: false,
        grid: {
          display: true,
          drawBorder: true
        },
        title: {
          display: true,
          text: '예약 건수',
          padding: 20,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          },
          stepSize: 1 // 눈금 간격을 1로 설정
        },
        min: 0,  // 최소값 0으로 설정
        max: 8, // 최대값 10으로 설정
        suggestedMax: 8 // 제안된 최대값을 10으로 설정
      },
      y: {
        offset: true,
        stacked: false,
        grid: {
          offset: true,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 40
        },
        afterFit: (scaleInstance) => {
          scaleInstance.width = 150;
        }
      }
    }
  };

  // 컨테이너 스타일
  const containerStyle = {
    height: '80vh',
    width: '98%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

 // 차트 래퍼 스타일 수정
 const chartWrapperStyle = {
  height: '90%',  // 컨테이너의 90%
  width: '100%',
  position: 'relative',
  paddingRight: '20px'
};

  return (
    <div className="yearly-stats">
      { console.log("hotelData: ", hotelData) }
      <div className="chart-container" style={containerStyle}>
        <div className="chart-wrapper" style={chartWrapperStyle}>
          <Bar data={chartData} options={options} />
          {console.log("chartData: ", chartData)}
        </div>
      </div>
      <div className="hotel-stats">
        {hotelData.map((hotel, index) => (
          <div key={index} className="hotel-yearly-stats">
            <h3>{hotel.name}</h3>
            <div className="yearly-bookings">
              {[2022, 2023, 2024, 2025].map((year, idx) => (
                <div key={idx} className="booking-year">
                  <span>{year}년</span>
                  <span>총 {hotel.bookings[idx]}건</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalFor3Years;
