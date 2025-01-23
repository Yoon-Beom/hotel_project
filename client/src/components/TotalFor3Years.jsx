import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TotalFor3Years = ({ selectedDate }) => {
    const generateHotelData = () => {
        const hotels = [
            '호텔 롯데 서울',
            '그랜드 하얏트 서울',
            '시그니엘 서울',
            '웨스틴 조선 서울',
            '파크 하얏트 부산',
            '반얀트리 서울',
            '포시즌스 서울',
            '파라다이스 시티'
        ];
        const years = [2022, 2023, 2024, 2025];

        return hotels.map(hotel => ({
            name: hotel,
            bookings: years.map(year => ({
                year,
                count: Math.floor(Math.random() * (150 - 30 + 1)) + 30
            }))
        }));
    };

    const hotelData = React.useMemo(() => {
        if (!selectedDate) return [];
        return generateHotelData();
    }, [selectedDate]);

    if (!selectedDate) return null;

    const chartData = {
        labels: ['2022년', '2023년', '2024년', '2025년'],
        datasets: hotelData.map((hotel, index) => ({
            label: hotel.name,
            data: hotel.bookings.map(booking => booking.count),
            borderColor: [
                'rgb(255, 99, 132)',   // 빨강
                'rgb(53, 162, 235)',   // 파랑
                'rgb(75, 192, 192)',   // 청록
                'rgb(255, 159, 64)',   // 주황
                'rgb(153, 102, 255)',  // 보라
                'rgb(255, 205, 86)',   // 노랑
                'rgb(201, 203, 207)',  // 회색
                'rgb(54, 162, 235)'    // 하늘
            ][index],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(53, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 159, 64, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 205, 86, 0.5)',
                'rgba(201, 203, 207, 0.5)',
                'rgba(54, 162, 235, 0.5)'
            ][index],
            tension: 0.1
        }))
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 호텔별 연간 예약 현황`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '예약 건수',
                    font: {
                        size: 14
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        elements: {
            point: {
                radius: 5,
                hoverRadius: 7
            },
            line: {
                borderWidth: 2
            }
        }
    };

    return (
        <div className="yearly-stats">
            <Line data={chartData} options={options} />
            {hotelData.map((hotel, index) => (
                <div key={index} className="hotel-stats">
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
    );
};

export default TotalFor3Years;