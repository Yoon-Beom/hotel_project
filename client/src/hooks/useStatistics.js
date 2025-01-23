// client/src/hooks/useStatistics.js
import { useState, useCallback } from 'react';
import useWeb3 from './useWeb3';
import {
    getMonthlyReservations,
    getDailyReservations,
    getReservationsByDate
} from '../utils/statisticsUtils';

/**
 * 통계 관련 기능을 제공하는 커스텀 훅
 * @returns {Object} 통계 관련 상태와 함수들
 */
export const useStatistics = () => {
    const { contract } = useWeb3();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * 최근 3년간 월별 예약 수를 가져옵니다.
     * @async
     * @function fetchMonthlyReservations
     * @returns {Promise<Object|null>} 월별 예약 수 객체 또는 null
     */
    const fetchMonthlyReservations = useCallback(async () => {
        if (!contract) {
            setError("Contract not initialized");
            return null;
        }
        try {
            setIsLoading(true);
            const data = await getMonthlyReservations(contract);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    /**
     * 특정 월의 일별 예약 수를 가져옵니다.
     * @async
     * @function fetchDailyReservations
     * @param {number} year - 연도
     * @param {number} month - 월
     * @returns {Promise<Object|null>} 일별 예약 수 객체 또는 null
     */
    const fetchDailyReservations = useCallback(async (year, month) => {
        if (!contract) {
            setError("Contract not initialized");
            return null;
        }
        try {
            setIsLoading(true);
            const data = await getDailyReservations(contract, year, month);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    /**
     * 특정 날짜의 연도별, 호텔별 예약 수를 가져옵니다.
     * @async
     * @function fetchReservationsByDate
     * @param {Date} date - 특정 날짜
     * @returns {Promise<Object|null>} 호텔별, 연도별 예약 수 객체 또는 null
     */
    const fetchReservationsByDate = useCallback(async (date) => {
        if (!contract) {
            setError("Contract not initialized");
            return null;
        }
        try {
            setIsLoading(true);
            const data = await getReservationsByDate(contract, date);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    return {
        isLoading,
        error,
        fetchMonthlyReservations,
        fetchDailyReservations,
        fetchReservationsByDate
    };
};

export default useStatistics;
