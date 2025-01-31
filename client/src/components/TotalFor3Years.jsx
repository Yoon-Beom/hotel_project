// client\src\components\TotalFor3Years.jsx

import React from 'react';
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

import useHotel from '../hooks/useHotel';
import '../styles/components/TotalFor3Years.css';

ChartJS.defaults.animation = false;

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

  React.useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const generateHotelData = () => {
    const years = [2022, 2023, 2024, 2025];
    console.log("등록된 호텔 목록_hotels : " , hotels);
    return hotels.map(hotel => ({
      name: hotel.name,
      bookings: years.map(year => ({
        year,
        count: Math.floor(Math.random() * (150 - 30 + 1)) + 30
      }))
    }));
  };

  const hotelData = React.useMemo(() => {
    if (!selectedDate || !hotels.length) return [];
    return generateHotelData();
  }, [selectedDate, hotels]);
  console.log("hotelData : " , hotelData);

  if (!selectedDate || !hotels.length) return null;

  const chartData = {
    labels: hotelData.map(hotel => hotel.name),
    datasets: [
      {
        label: '2022',
        data: hotelData.map(hotel => 
          hotel.bookings.find(booking => booking.year === 2022).count
        ),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
      },
      {
        label: '2023',
        data: hotelData.map(hotel => 
          hotel.bookings.find(booking => booking.year === 2023).count
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
      },
      {
        label: '2024',
        data: hotelData.map(hotel => 
          hotel.bookings.find(booking => booking.year === 2024).count
        ),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
      },
      {
        label: '2025',
        data: hotelData.map(hotel => 
          hotel.bookings.find(booking => booking.year === 2025).count
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
      }
    ]
  };

  console.log("chartData.datasets : " , chartData.datasets);

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
          }
        }
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
          scaleInstance.height = hotelData.length * 120; // y축 높이도 동일하게 설정
        }
      }
    }
  };

  const containerStyle = {
    height: '95vh',
    width: '98%',
    margin: '20px auto',
    padding: '20px',
    overflowY: 'auto', // 여기만 스크롤 유지
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const chartWrapperStyle = {
    height: `${hotelData.length * 200}px`, // 각 호텔당 200px의 공간 할당
    width: '100%',
    position: 'relative',
    paddingRight: '20px'
  };

  return (
    <div className="yearly-stats">
      <div className="chart-container" style={containerStyle}>
        <div className="chart-wrapper" style={chartWrapperStyle}>
          <Bar 
            data={chartData} 
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: {
                  display: true,
                  text: `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 호텔별 연간 예약 현황`,
                  font: { size: 20, weight: 'bold' }
                }
              }
            }} 
          />
        </div>
      </div>
      <div className="hotel-stats">
        {hotelData.map((hotel, index) => (
          <div key={index} className="hotel-yearly-stats">
            <h3>{hotel.name}</h3>
            <div className="yearly-bookings">
              {hotel.bookings.map((booking, idx) => (
                <div key={idx} className="booking-year">
                  <span>{booking.year}년</span>
                  <span>총 {booking.count}건</span>
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
