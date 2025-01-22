import React, { useEffect, useCallback } from 'react';
import useReservation from '../hooks/useReservation';
import useWeb3 from '../hooks/useWeb3';
import ReservationList from '../components/ReservationList';
// import '../styles/pages/UserReservationsPage.css';

/**
 * 사용자의 예약 내역을 표시하는 페이지 컴포넌트
 * @component
 * @returns {JSX.Element} UserReservationsPage 컴포넌트
 */
const UserReservationsPage = () => {
    const { 
        reservations, 
        isLoading, 
        error, 
        fetchUserReservations, 
        cancelUserReservation 
    } = useReservation();
    const { account, isConnected } = useWeb3();

    const loadReservations = useCallback(async () => {
        if (isConnected && account) {
            await fetchUserReservations();
        }
    }, [isConnected, account, fetchUserReservations]);

    useEffect(() => {
        loadReservations();
    }, [loadReservations]);

    /**
     * 예약 취소 핸들러
     * @async
     * @function handleCancelReservation
     * @param {number} reservationId - 취소할 예약 ID
     */
    const handleCancelReservation = async (reservationId) => {
        if (!isConnected) {
            alert('지갑을 연결해주세요.');
            return;
        }
        const success = await cancelUserReservation(reservationId);
        if (success) {
            alert('예약이 성공적으로 취소되었습니다.');
            loadReservations();
        }
    };

    if (!isConnected) return <div className="error">지갑을 연결해주세요.</div>;
    if (isLoading) return <div className="loading">예약 정보를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;

    return (
        <div className="user-reservations-page">
            <h1>내 예약 내역</h1>
            {reservations.length === 0 ? (
                <p className="no-reservations">예약 내역이 없습니다.</p>
            ) : (
                <ReservationList 
                    reservations={reservations}
                    onCancelReservation={handleCancelReservation}
                />
            )}
        </div>
    );
};

export default UserReservationsPage;
