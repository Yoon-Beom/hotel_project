// hooks/useReservation.js
import { useState, useCallback } from 'react';
import useWeb3 from './useWeb3';

// 예약 목록 로드 함수
export const loadReservations = async (contract, account) => {
    // 사용자의 예약 ID 목록 가져오기
    const reservationIds = await contract.methods.getUserReservations().call({ 
        from: account 
    });
    
    // 예약 상세 정보 가져오기
    const reservations = await contract.methods.getReservationsByIds(reservationIds).call();
    return reservations;
};

// 특정 예약 정보 로드 함수
export const loadReservation = async (contract, reservationId) => {
    const reservation = await contract.methods.getReservation(reservationId).call();
    return reservation;
};

// 예약 추가 훅
export const useAddReservation = () => {
    const { web3, contract, account } = useWeb3();
    const [error, setError] = useState(null);

    const addReservation = async (hotelId, roomId, checkInDate, checkOutDate, price) => {
        if (!contract) {
            setError("Contract not initialized");
            return false;
        }
        try {
            const checkInTimestamp = Math.floor(checkInDate.getTime() / 1000);
            const checkOutTimestamp = Math.floor(checkOutDate.getTime() / 1000);

            await contract.methods.createReservation(
                hotelId,
                roomId,
                checkInTimestamp,
                checkOutTimestamp,
                '' // IPFS 해시
            ).send({
                from: account,
                value: web3.utils.toWei(price.toString(), 'ether'),
                gas: 500000
            });
            return true;
        } catch (error) {
            console.error("Error creating reservation:", error);
            setError(error.message);
            return false;
        }
    };

    return { addReservation, error };
};

// 예약 관리 훅
export const useReservation = () => {
    const { contract, account } = useWeb3();
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 예약 목록 조회
    const fetchReservations = useCallback(async () => {
        if (!contract || !account) {
            console.log("Contract or account not initialized yet. Waiting...");
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const fetchedReservations = await loadReservations(contract, account);
            setReservations(fetchedReservations);
        } catch (err) {
            console.error("Failed to fetch reservations:", err);
            setError('예약 내역을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [contract, account]);

    // 예약 취소
    const cancelReservation = useCallback(async (reservationId) => {
        if (!contract || !account) {
            setError("Contract or account not initialized");
            return false;
        }
        try {
            setIsLoading(true);
            setError(null);
            
            await contract.methods.cancelReservation(reservationId).send({
                from: account,
                gas: 500000
            });

            await fetchReservations(); // 예약 목록 새로고침
            return true;
        } catch (err) {
            console.error("Failed to cancel reservation:", err);
            setError('예약 취소에 실패했습니다.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [contract, account, fetchReservations]);

    return {
        reservations,
        isLoading,
        error,
        fetchReservations,
        cancelReservation
    };
};

export default useReservation;
