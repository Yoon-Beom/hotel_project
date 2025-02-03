// client/src/components/MonthlyChart.jsx
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
import { getRecentYears } from '../utils/dateUtils';
import useChart from '../hooks/useChart';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MonthlyChart = ({ monthlyData }) => {
    const years = getRecentYears();
    const { getColorForYear } = useChart();

    const chartData = {
        labels: Object.keys(monthlyData).map(month => `${month}월`),
        datasets: years.map(year => ({
            label: year.toString(),
            data: Object.values(monthlyData).map(yearData => yearData[year.toString()]),
            backgroundColor: `rgba(${getColorForYear(year, 0.5)})`,
            borderColor: `rgba(${getColorForYear(year, 1)})`,
        }))
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
                text: '월별 예약 현황',
                font: { size: 20, weight: 'bold' }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 12,
                ticks: {
                    stepSize: 1,
                    font: { size: 12 }
                },
                title: {
                    display: true,
                    text: '월별 예약 건수',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };

    return (
        <div style={{ marginBottom: '40px', height: '400px' }}>
            <h2>최근 4년간 월별 예약 통계</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default MonthlyChart;
