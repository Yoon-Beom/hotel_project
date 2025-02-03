// client/src/components/DailyChart.jsx
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
import useChart from '../hooks/useChart';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DailyChart = ({ dailyData, year, month }) => {
    const { getColorForYear } = useChart();

    const chartData = {
        labels: Object.keys(dailyData).map(day => `${day}일`),
        datasets: [{
            label: `${year}년 ${month}월 예약 수`,
            data: Object.values(dailyData),
            backgroundColor: `rgba(${getColorForYear(year, 0.5)})`,
            borderColor: `rgba(${getColorForYear(year, 1)})`,
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${year}년 ${month}월 일별 예약 현황`,
                font: { size: 20, weight: 'bold' }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 20,
                ticks: {
                    stepSize: 1,
                    font: { size: 12 }
                },
                title: {
                    display: true,
                    text: '일별 예약 건수',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };

    return (
        <div style={{ marginBottom: '40px', height: '400px' }}>
            <h2>{year}년 {month}월 일별 예약 통계</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default DailyChart;
