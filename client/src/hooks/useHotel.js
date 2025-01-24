// client/src/hooks/useHotel.js
import { useState, useCallback, useMemo, useRef } from 'react';
import useWeb3 from './useWeb3';
import {
    addHotel as addHotelUtil,
    loadHotels,
    loadHotelsWithPagination,
    loadHotelInfo,
    searchHotels,
    getUserHotels,
    filterHotelsWithAvailableRooms
} from '../utils/hotelUtils';

/**
 * 호텔 관련 상태와 기능을 관리하는 커스텀 훅
 * @returns {Object} 호텔 관련 상태와 함수들
 */
export const useHotel = () => {
    const { contract, account } = useWeb3();
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetchTime, setLastFetchTime] = useState(0);
    const fetchTimeoutRef = useRef(null);

    /**
     * 메모이제이션된 호텔 목록
     * @type {Array}
     */
    const memoizedHotels = useMemo(() => hotels, [hotels]);

    /**
     * 로딩 상태를 설정하는 함수
     * @function setLoadingState
     * @param {boolean} loading - 로딩 상태
     */
    const setLoadingState = useCallback((loading) => {
        setIsLoading(loading);
    }, []);

    /**
     * 에러 상태를 설정하는 함수
     * @function setErrorState
     * @param {string|null} errorMessage - 에러 메시지
     */
    const setErrorState = useCallback((errorMessage) => {
        setError(errorMessage);
    }, []);

    // =============================================================================
    // 호텔 관리
    // =============================================================================

    /**
     * 새로운 호텔을 추가합니다.
     * @async
     * @function addHotel
     * @param {string} hotelName - 호텔 이름
     * @param {string} ipfsHash - IPFS 해시
     * @returns {Promise<boolean>} 추가 성공 여부
     */
    const addHotel = useCallback(async (hotelName, ipfsHash) => {
        if (!contract || !account) {
            setErrorState("Contract or account not initialized");
            return false;
        }
        try {
            setLoadingState(true);
            await addHotelUtil(contract, account, hotelName, ipfsHash);
            setErrorState(null);
            return true;
        } catch (err) {
            setErrorState(err.message);
            return false;
        } finally {
            setLoadingState(false);
        }
    }, [contract, account, setLoadingState, setErrorState]);

    // =============================================================================
    // 호텔 조회
    // =============================================================================

    /**
     * 모든 호텔 정보를 불러옵니다.
     * @async
     * @function fetchHotels
     * @param {boolean} [force=false] - 강제 새로고침 여부
     * @returns {Promise<void>}
     */
    const fetchHotels = useCallback(async (force = false) => {
        if (!contract) {
            setErrorState("Contract not initialized");
            return;
        }

        const now = Date.now();
        if (!force && now - lastFetchTime < 60000) {
            console.log("아직 때가 아니라서 가져오기를 건너뜁니다.");
            return;
        }

        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }

        fetchTimeoutRef.current = setTimeout(async () => {
            try {
                setLoadingState(true);
                const fetchedHotels = await loadHotels(contract);
                setHotels(fetchedHotels);
                setErrorState(null);
                setLastFetchTime(now);
            } catch (err) {
                console.error("Error fetching hotels:", err);
                setErrorState(err.message);
            } finally {
                setLoadingState(false);
            }
        }, 100);
    }, [contract, lastFetchTime, setLoadingState, setErrorState]);

    /**
     * 페이지네이션된 호텔 정보를 불러옵니다.
     * @async
     * @function fetchHotelsWithPagination
     * @param {number} page - 페이지 번호
     * @param {number} pageSize - 페이지당 호텔 수
     * @returns {Promise<Object|null>} 페이지네이션된 호텔 정보 또는 null
     */
    const fetchHotelsWithPagination = useCallback(async (page, pageSize) => {
        if (!contract) {
            setErrorState("Contract not initialized");
            return null;
        }
        try {
            setLoadingState(true);
            const result = await loadHotelsWithPagination(contract, page, pageSize);
            setErrorState(null);
            return result;
        } catch (err) {
            setErrorState(err.message);
            return null;
        } finally {
            setLoadingState(false);
        }
    }, [contract, setLoadingState, setErrorState]);

    /**
     * 특정 호텔의 상세 정보를 불러옵니다.
     * @async
     * @function getHotelInfo
     * @param {number} hotelId - 호텔 ID
     * @returns {Promise<Object|null>} 호텔 정보 또는 null
     */
    const getHotelInfo = useCallback(async (hotelId) => {
        if (!contract) {
            setErrorState("Contract not initialized");
            return null;
        }
        try {
            setLoadingState(true);
            const hotelInfo = await loadHotelInfo(contract, hotelId);
            setErrorState(null);
            return hotelInfo;
        } catch (err) {
            setErrorState(err.message);
            return null;
        } finally {
            setLoadingState(false);
        }
    }, [contract, setLoadingState, setErrorState]);

    // =============================================================================
    // 호텔 검색 및 필터링
    // =============================================================================

    /**
     * 검색어와 날짜를 기준으로 호텔을 검색합니다.
     * @function searchHotelsFunc
     * @param {string} searchTerm - 검색어
     * @param {number} startDate - 검색 시작 날짜 (YYYYMMDD 형식)
     * @param {number} endDate - 검색 종료 날짜 (YYYYMMDD 형식)
     * @returns {Array} 검색 결과 호텔 목록
     */
    const searchHotelsFunc = useCallback((searchTerm, startDate, endDate) => {
        return searchHotels(memoizedHotels, searchTerm, startDate, endDate);
    }, [memoizedHotels]);

    /**
     * 현재 사용자가 관리하는 호텔 목록을 반환합니다.
     * @function getUserHotelsFunc
     * @returns {Array} 사용자가 관리하는 호텔 목록
     */
    const getUserHotelsFunc = useCallback(() => {
        return getUserHotels(memoizedHotels, account);
    }, [memoizedHotels, account]);

    /**
     * 특정 날짜 범위 내에서 예약 가능한 호텔을 필터링합니다.
     * @async
     * @function filterAvailableHotels
     * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
     * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
     * @returns {Promise<Array>} 예약 가능한 호텔 목록
     */
    const filterAvailableHotels = useCallback(async (checkInDate, checkOutDate) => {
        if (!contract) {
            setErrorState("Contract not initialized");
            return [];
        }
        try {
            setLoadingState(true);
            const availableHotels = await filterHotelsWithAvailableRooms(contract, memoizedHotels, checkInDate, checkOutDate);
            setErrorState(null);
            return availableHotels;
        } catch (err) {
            setErrorState(err.message);
            return [];
        } finally {
            setLoadingState(false);
        }
    }, [contract, memoizedHotels, setLoadingState, setErrorState]);

    return useMemo(() => ({
        hotels: memoizedHotels,
        isLoading,
        error,
        fetchHotels,
        fetchHotelsWithPagination,
        getHotelInfo,
        addHotel,
        searchHotels: searchHotelsFunc,
        getUserHotels: getUserHotelsFunc,
        filterAvailableHotels,
    }), [memoizedHotels, isLoading, error, fetchHotels, fetchHotelsWithPagination, getHotelInfo, addHotel, searchHotelsFunc, getUserHotelsFunc, filterAvailableHotels]);
};

export default useHotel;
