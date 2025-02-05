// client/src/hooks/useChart.js
import { useState, useCallback, useMemo } from 'react';
import { getRecentYears } from '../utils/dateUtils';
import {
    formatMonthlyData,
    formatHotelYearlyData,
    getBarChartOptions
} from '../utils/chartUtils';

/**
 * 차트 데이터와 옵션을 관리하는 커스텀 훅
 * @returns {Object} 차트 관련 상태와 함수들
 */
const useChart = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * 최근 4년 연도 배열
     */
    const recentYears = useMemo(() =>
        getRecentYears(currentYear),
        [currentYear]
    );

    /**
     * 월별 예약 데이터를 차트 데이터로 변환
     * @function formatMonthlyChartData
     * @param {Object} monthlyData - 월별 예약 데이터
     */
    const formatMonthlyChartData = useCallback((monthlyData) => {
        try {
            const formattedData = formatMonthlyData(monthlyData, currentYear);
            setChartData(formattedData);
            setError(null);
        } catch (err) {
            setError('차트 데이터 변환 중 오류가 발생했습니다.');
            console.error('Chart data formatting error:', err);
        }
    }, [currentYear]);

    /**
     * 호텔별 연간 예약 데이터를 차트 데이터로 변환
     * @function formatHotelChartData
     * @param {Object} hotelData - 호텔별 예약 데이터
     * @param {Array} hotels - 호텔 목록
     */
    const formatHotelChartData = useCallback((hotelData, hotels) => {
        try {
            const formattedData = formatHotelYearlyData(hotelData, hotels, currentYear);
            setChartData(formattedData);
            setError(null);
        } catch (err) {
            setError('호텔 차트 데이터 변환 중 오류가 발생했습니다.');
            console.error('Hotel chart data formatting error:', err);
        }
    }, [currentYear]);

    /**
     * 차트 옵션 생성
     * @function getChartOptions
     * @param {string} title - 차트 제목
     * @param {boolean} [horizontal=false] - 가로 막대 차트 여부
     * @returns {Object} 차트 옵션
     */
    const getChartOptions = useCallback((title, horizontal = false) => {
        return getBarChartOptions(title, horizontal);
    }, []);

    /**
     * 연도 변경 처리
     * @function handleYearChange
     * @param {number} year - 변경할 연도
     */
    const handleYearChange = useCallback((year) => {
        setCurrentYear(year);
    }, []);

    /**
     * 차트 데이터 초기화
     * @function resetChartData
     */
    const resetChartData = useCallback(() => {
        setChartData(null);
        setError(null);
    }, []);

    /**
  * 년도별 색상을 반환하는 함수
  * @function getColorForYear
  * @param {number} year - 연도
  * @param {number} alpha - 투명도 (0-1)
  * @returns {string} RGBA 색상 문자열
  */
    const getColorForYear = useCallback((year, alpha) => {
        const years = getRecentYears();
        const index = years.indexOf(year);
        const colors = [
            `75, 192, 192, ${alpha}`,  // 현재 연도
            `53, 162, 235, ${alpha}`,  // 1년 전
            `255, 99, 132, ${alpha}`,  // 2년 전
            `255, 159, 64, ${alpha}`   // 3년 전
        ];
        return colors[index] || `201, 203, 207, ${alpha}`;
    }, []);

    return {
        chartData,
        currentYear,
        recentYears,
        isLoading,
        error,
        formatMonthlyChartData,
        formatHotelChartData,
        getChartOptions,
        handleYearChange,
        resetChartData,
        getColorForYear
    };
};

export default useChart;
