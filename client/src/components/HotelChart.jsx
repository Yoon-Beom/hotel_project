// client/src/components/HotelChart.jsx
import React, { useEffect, useState, useMemo } from 'react';  // useMemo 추가
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
import useChart from '../hooks/useChart';
import useHotel from '../hooks/useHotel';
import { getRecentYears } from '../utils/dateUtils';  // parseDate 추가

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const HotelChart = ({ reservationData, selectedDate }) => {
    const { getColorForYear } = useChart();
    const { hotels, fetchHotels } = useHotel();
    const [chartData, setChartData] = useState(null);

    // years를 useMemo로 감싸서 매 렌더링마다 재생성되는 것을 방지
    const years = useMemo(() => getRecentYears(), []);

    // 호텔 데이터 가져오기
    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    // 차트 데이터 생성
    useEffect(() => {
        if (!hotels.length || !reservationData) return;

        const data = {
            labels: Object.keys(reservationData).map(hotelId => {
                const hotel = hotels.find(h => h.id === Number(hotelId));
                return hotel ? hotel.name : `호텔 ${hotelId}`;
            }),
            datasets: years.map((year, index) => ({
                label: year.toString(),
                data: Object.values(reservationData).map(yearData => yearData[index]),
                backgroundColor: `rgba(${getColorForYear(year, 0.5)})`,
                borderColor: `rgba(${getColorForYear(year, 1)})`,
            }))
        };
        setChartData(data);
    }, [hotels, reservationData, years, getColorForYear]);

    // options를 useMemo로 감싸서 매 렌더링마다 재생성되는 것을 방지
    // options를 생성하기 전에 최대값 계산 로직 추가
    const getMaxValue = useMemo(() => {
        if (!chartData) return 5; // 기본값

        // 모든 데이터셋의 모든 값 중 최대값 찾기
        const maxValue = Math.max(
            ...chartData.datasets.flatMap(dataset => dataset.data)
        );

        // 최대값의 1.2배를 계산하고 올림
        return Math.ceil(maxValue * 1.2);
    }, [chartData]);

    // options 수정
    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 호텔별 연간 예약 현황`,
                font: { size: 20, weight: 'bold' }
            }
        },
        scales: {
            x: {
                position: 'top',
                min: 0,
                max: getMaxValue, // 동적으로 계산된 최대값 사용
                ticks: {
                    stepSize: 1,
                    font: { size: 12 }
                },
                title: {
                    display: true,
                    text: '예약 건수',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    }), [selectedDate, getMaxValue]); // getMaxValue를 의존성 배열에 추가


    if (!chartData) return null;

    return (
        <div style={{ marginBottom: '40px', height: '400px' }}>
            <h2>호텔별 예약 통계</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default HotelChart;
