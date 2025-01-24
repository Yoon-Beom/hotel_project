// client/src/hooks/useRoom.js
import { useState, useCallback } from 'react';
import useWeb3 from './useWeb3';
import {
    loadRooms,
    loadRoomInfo,
    checkRoomAvailability,
    getRoomDateStatus,
    filterAvailableRooms
} from '../utils/roomUtils';

/**
 * 객실 관련 기능을 제공하는 커스텀 훅
 * @returns {Object} 객실 관련 상태와 함수들
 */
export const useRoom = () => {
    const { web3, contract, account } = useWeb3();
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // =============================================================================
    // 객실 조회
    // =============================================================================

    /**
     * 호텔의 모든 객실을 조회합니다.
     * @param {number} hotelId - 호텔 ID
     * @returns {Promise<Array>} 객실 목록
     */
    const fetchRooms = useCallback(async (hotelId) => {
        if (!contract) {
            setError("Contract not initialized");
            return [];
        }
        try {
            setIsLoading(true);
            const fetchedRooms = await loadRooms(contract, hotelId);
            setRooms(fetchedRooms);
            setError(null);
            return fetchedRooms;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    /**
     * 특정 객실의 정보를 조회합니다.
     * @param {number} hotelId - 호텔 ID
     * @param {number} roomNumber - 객실 번호
     * @returns {Promise<Object|null>} 객실 정보 또는 null
     */
    const getRoomInfo = useCallback(async (hotelId, roomNumber) => {
        if (!contract) {
            setError("Contract not initialized");
            return null;
        }
        try {
            setIsLoading(true);
            const roomInfo = await loadRoomInfo(contract, hotelId, roomNumber);
            setError(null);
            return roomInfo;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    // =============================================================================
    // 객실 관리
    // =============================================================================

    /**
     * 새 객실을 추가합니다.
     * @param {number} hotelId - 호텔 ID
     * @param {number} roomNumber - 객실 번호
     * @param {string} roomPrice - 객실 가격 (ETH)
     * @param {string} ipfsHash - IPFS 해시
     * @returns {Promise<boolean>} 추가 성공 여부
     */
    const addRoom = useCallback(async (hotelId, roomNumber, roomPrice, ipfsHash) => {
        if (!contract || !account) {
            setError("Contract or account not initialized");
            return false;
        }
        try {
            setIsLoading(true);
            await contract.methods.addRoom(
                hotelId,
                roomNumber,
                web3.utils.toWei(roomPrice, 'ether'),
                ipfsHash
            ).send({ from: account });
            await fetchRooms(hotelId);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [contract, account, web3, fetchRooms]);

    // =============================================================================
    // 객실 가용성 및 상태 확인
    // =============================================================================

    /**
     * 객실의 가용성을 확인합니다.
     * @param {number} hotelId - 호텔 ID
     * @param {number} roomNumber - 객실 번호
     * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
     * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
     * @returns {Promise<boolean>} 객실 가용성 여부
     */
    const checkAvailability = useCallback(async (hotelId, roomNumber, checkInDate, checkOutDate) => {
        if (!contract) {
            setError("Contract not initialized");
            return false;
        }
        try {
            setIsLoading(true);
            const isAvailable = await checkRoomAvailability(contract, hotelId, roomNumber, checkInDate, checkOutDate);
            setError(null);
            return isAvailable;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    /**
     * 특정 날짜의 객실 상태를 조회합니다.
     * @param {number} hotelId - 호텔 ID
     * @param {number} roomNumber - 객실 번호
     * @param {number} date - 조회할 날짜 (YYYYMMDD 형식)
     * @returns {Promise<number>} 객실 상태 코드
     */
    const getRoomStatus = useCallback(async (hotelId, roomNumber, date) => {
        if (!contract) {
            setError("Contract not initialized");
            return null;
        }
        try {
            setIsLoading(true);
            const status = await getRoomDateStatus(contract, hotelId, roomNumber, date);
            setError(null);
            return status;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    /**
     * 예약 가능한 객실을 필터링합니다.
     * @param {number} hotelId - 호텔 ID
     * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
     * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
     * @returns {Promise<Array>} 예약 가능한 객실 목록
     */
    const getAvailableRooms = useCallback(async (hotelId, checkInDate, checkOutDate) => {
        if (!contract) {
            setError("Contract not initialized");
            return [];
        }
        try {
            setIsLoading(true);
            const availableRooms = await filterAvailableRooms(contract, hotelId, checkInDate, checkOutDate);
            setError(null);
            return availableRooms;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    return {
        rooms,
        isLoading,
        error,
        fetchRooms,
        getRoomInfo,
        addRoom,
        checkAvailability,
        getRoomStatus,
        getAvailableRooms
    };
};

export default useRoom;
