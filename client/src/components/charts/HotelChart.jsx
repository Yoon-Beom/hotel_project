// client/src/components/charts/HotelChart.jsx
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
import useChart from '../../hooks/useChart';
import useHotel from '../../hooks/useHotel';
import { getRecentYears } from '../../utils/dateUtils';  // parseDate 추가

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null);

    // years를 useMemo로 감싸서 매 렌더링마다 재생성되는 것을 방지
    const years = useMemo(() => getRecentYears(), []);

    // 호텔 데이터 가져오기
    useEffect(() => {
        const loadHotels = async () => {
            try {
                setIsLoading(true);
                await fetchHotels();
                setError(null);
            } catch (err) {
                setError('호텔 데이터를 불러오는데 실패했습니다.');
                console.error("호텔 데이터 로딩 에러:", err);
            }
        };
        loadHotels();
    }, [fetchHotels]);

    // 차트 데이터 생성
    useEffect(() => {
        if (!hotels.length || !reservationData) return;

        try {
            setIsLoading(true);
            const data = {
                labels: Object.keys(reservationData).map(hotelId => {
                    const hotel = hotels.find(h => h.id === Number(hotelId));
                    return hotel ? hotel.name : `호텔 ${hotelId}`;
                }),
                datasets: years.map((year, index) => ({
                    label: year.toString(),
                    data: Object.values(reservationData).map(yearData => yearData[years.length - 1 - index] || 0),
                    backgroundColor: `rgba(${getColorForYear(year, 0.5)})`,
                    borderColor: `rgba(${getColorForYear(year, 1)})`,
                }))
            };
            setChartData(data);
            setError(null);
        } catch (err) {
            setError('차트 데이터 처리 중 오류가 발생했습니다.');
            console.error("차트 데이터 처리 에러:", err);
        } finally {
            setIsLoading(false);
        }
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
        layout: {
            padding: {
                top: 50,
                bottom: 50,
                left: 30,
                right: 40
            }
        },
        height: Math.max(400, Object.keys(reservationData).length * 100),
        indexAxis: 'y',
        barThickness: 20,
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

    const containerStyle = {
        height: `${Math.max(400, Object.keys(reservationData).length * 120)}px`,
        width: '98%',
        margin: '20px auto',
        padding: '20px'
    };

    if (isLoading) return <div className="loading">차트 데이터를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;
    if (!chartData) return <div className="no-data">표시할 데이터가 없습니다.</div>;

    return (
        <div style={containerStyle}>
            {console.log("HotelChart 실행")}
            <h2>호텔별 예약 통계</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default HotelChart;
