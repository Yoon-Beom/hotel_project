// client/src/hooks/useReservation.js
import { useState, useCallback } from 'react';
import useWeb3 from './useWeb3';
import {
    createReservation,
    cancelReservation,
    loadUserReservations,
    loadReservation,
    isValidReservationDate,
    calculateReservationDuration,
    calculateRoomPrice,
    rateReservation
} from '../utils/reservationUtils';

/**
 * 예약 관련 커스텀 훅
 * @returns {Object} 예약 관련 상태와 함수들
 */
export const useReservation = () => {
    const { contract, account } = useWeb3();
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // =============================================================================
    // 예약 관리
    // =============================================================================

    /**
     * 새로운 예약을 추가하는 함수입니다.
     * @async
     * @function addReservation
     * @param {number} hotelId - 호텔 ID
     * @param {number} roomNumber - 객실 번호
     * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
     * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
     * @param {string} ipfsHash - IPFS 해시
     * @param {string} totalPrice - 총 예약 가격 (Wei 단위)
     * @returns {Promise<boolean>} 예약 추가 성공 여부
     */
    const addReservation = useCallback(async (hotelId, roomNumber, checkInDate, checkOutDate, ipfsHash, totalPrice) => {
        if (!contract || !account) {
            setError("Contract or account not initialized");
            return false;
        }
        if (!isValidReservationDate(checkInDate, checkOutDate)) {
            throw new Error('유효하지 않은 날짜입니다.');
        }
        try {
            setIsLoading(true);
            await createReservation(contract, hotelId, roomNumber, checkInDate, checkOutDate, ipfsHash, account, totalPrice);
            await fetchUserReservations();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [contract, account]);

    /**
     * 예약을 취소합니다.
     * @async
     * @param {number} reservationId - 취소할 예약 ID
     * @returns {Promise<boolean>} 취소 성공 여부
     */
    const cancelUserReservation = useCallback(async (reservationId) => {
        if (!contract || !account) {
            setError("Contract or account not initialized");
            return false;
        }
        try {
            setIsLoading(true);
            await cancelReservation(contract, reservationId, account);
            await fetchUserReservations();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [contract, account]);

    /**
     * 예약에 대한 평점을 남깁니다.
     * @async
     * @param {number} reservationId - 평가할 예약 ID
     * @param {number} rating - 평점 (1-5)
     * @returns {Promise<boolean>} 평가 성공 여부
     */
    const rateUserReservation = useCallback(async (reservationId, rating) => {
        if (!contract || !account) {
            setError("Contract or account not initialized");
            return false;
        }
        try {
            setIsLoading(true);
            await rateReservation(contract, reservationId, rating, account);
            await fetchUserReservations();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [contract, account]);

    // =============================================================================
    // 예약 조회
    // =============================================================================

    /**
     * 사용자의 모든 예약을 조회합니다.
     * @async
     */
    const fetchUserReservations = useCallback(async () => {
        if (!contract || !account) {
            setError("Contract or account not initialized");
            return;
        }
        try {
            setIsLoading(true);
            const userReservations = await loadUserReservations(contract, account);
            setReservations(userReservations);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [contract, account]);

    /**
     * 특정 예약의 상세 정보를 조회합니다.
     * @async
     * @param {number} reservationId - 조회할 예약 ID
     * @returns {Promise<Object|null>} 예약 상세 정보 또는 null
     */
    const getReservationDetails = useCallback(async (reservationId) => {
        if (!contract) {
            setError("Contract not initialized");
            return null;
        }
        try {
            setIsLoading(true);
            const reservationDetails = await loadReservation(contract, reservationId);
            setError(null);
            return reservationDetails;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    // =============================================================================
    // 예약 유효성 검사 및 계산
    // =============================================================================

    /**
     * 예약 날짜의 유효성을 확인합니다.
     * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
     * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
     * @returns {boolean} 예약 날짜의 유효성
     */
    const checkReservationDateValidity = useCallback((checkInDate, checkOutDate) => {
        return isValidReservationDate(checkInDate, checkOutDate);
    }, []);

    /**
     * 예약 기간을 계산합니다.
     * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
     * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
     * @returns {Object} 예약 기간 정보
     */
    const calculateDuration = useCallback((checkInDate, checkOutDate) => {
        return calculateReservationDuration(checkInDate, checkOutDate);
    }, []);

    /**
     * 객실 가격을 계산합니다.
     * @param {Object} room - 객실 정보
     * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
     * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
     * @returns {Object} 계산된 가격 정보
     */
    const calculatePrice = useCallback((room, checkInDate, checkOutDate) => {
        return calculateRoomPrice(room, checkInDate, checkOutDate);
    }, []);

    return {
        reservations,
        isLoading,
        error,
        addReservation,
        cancelUserReservation,
        rateUserReservation,
        fetchUserReservations,
        getReservationDetails,
        checkReservationDateValidity,
        calculateDuration,
        calculatePrice
    };
};

export default useReservation;
