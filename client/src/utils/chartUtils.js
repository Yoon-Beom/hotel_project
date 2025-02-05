// client/src/utils/chartUtils.js
import { getRecentYears } from './dateUtils';

/**
 * 차트 관련 유틸리티 함수들
 * @module chartUtils
 */

/**
 * 월별 예약 데이터를 차트 데이터 형식으로 변환
 * @function formatMonthlyData
 * @param {Object} data - 월별 예약 데이터
 * @param {number} [currentYear] - 기준 연도 (기본값: 현재 연도)
 * @returns {Object} 차트에서 사용할 수 있는 형식의 데이터
 */
export const formatMonthlyData = (data, currentYear = null) => {
    const years = getRecentYears(currentYear);
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

    return {
        labels: months,
        datasets: years.map(year => ({
            label: year.toString(),
            data: months.map(month => data[month][year.toString()] || 0),
            backgroundColor: getYearColor(year.toString(), 0.5),
            borderColor: getYearColor(year.toString(), 1),
            borderWidth: 1
        }))
    };
};

/**
 * 호텔별 연간 예약 데이터를 차트 데이터 형식으로 변환
 * @function formatHotelYearlyData
 * @param {Object} data - 호텔별 연간 예약 데이터
 * @param {Array} hotels - 호텔 목록
 * @param {number} [currentYear] - 기준 연도 (기본값: 현재 연도)
 * @returns {Object} 차트에서 사용할 수 있는 형식의 데이터
 */
export const formatHotelYearlyData = (data, hotels, currentYear = null) => {
    const years = getRecentYears(currentYear);

    return {
        labels: hotels.map(hotel => hotel.name),
        datasets: years.map((year, index) => ({
            label: year.toString(),
            data: hotels.map(hotel => data[hotel.id]?.[index] || 0),
            backgroundColor: getYearColor(year.toString(), 0.5),
            borderColor: getYearColor(year.toString(), 1),
            borderWidth: 1
        }))
    };
};

/**
 * 년도별 색상 반환
 * @function getYearColor
 * @param {string} year - 년도
 * @param {number} alpha - 투명도 (0-1)
 * @returns {string} RGBA 색상 문자열
 */
export const getYearColor = (year, alpha = 1) => {
    const years = getRecentYears();
    const colorMap = {
        [years[0]]: `rgba(75, 192, 192, ${alpha})`,    // 현재 연도
        [years[1]]: `rgba(53, 162, 235, ${alpha})`,    // 1년 전
        [years[2]]: `rgba(255, 99, 132, ${alpha})`,    // 2년 전
        [years[3]]: `rgba(255, 159, 64, ${alpha})`     // 3년 전
    };
    return colorMap[year] || `rgba(201, 203, 207, ${alpha})`;
};

/**
 * 차트 기본 옵션 생성
 * @function getDefaultChartOptions
 * @param {string} title - 차트 제목
 * @param {Object} [additionalOptions={}] - 추가 옵션
 * @returns {Object} 차트 옵션 객체
 */
export const getDefaultChartOptions = (title, additionalOptions = {}) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                font: {
                    size: 14,
                    weight: 'bold'
                }
            }
        },
        title: {
            display: true,
            text: title,
            font: {
                size: 16,
                weight: 'bold'
            }
        }
    },
    ...additionalOptions
});

/**
 * 막대 차트의 기본 옵션 생성
 * @function getBarChartOptions
 * @param {string} title - 차트 제목
 * @param {boolean} [horizontal=false] - 가로 막대 차트 여부
 * @returns {Object} 막대 차트 옵션 객체
 */
export const getBarChartOptions = (title, horizontal = false) => {
    const baseOptions = getDefaultChartOptions(title);

    return {
        ...baseOptions,
        indexAxis: horizontal ? 'y' : 'x',
        scales: {
            x: {
                grid: {
                    display: true
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: true
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            }
        }
    };
};
