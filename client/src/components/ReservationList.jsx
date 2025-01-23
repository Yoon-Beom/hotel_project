// client/src/components/ReservationList.jsx
import React, { useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3';
import useReservation from '../hooks/useReservation';
import { formatDate } from '../utils/dateUtils';
// import '../styles/components/ReservationList.css';

/**
 * 사용자의 예약 목록을 표시하는 컴포넌트
 * @component
 * @returns {JSX.Element} ReservationList 컴포넌트
 */
const ReservationList = () => {
    const { web3 } = useWeb3();
    const { 
        reservations, 
        isLoading, 
        error, 
        fetchUserReservations, 
        cancelUserReservation 
    } = useReservation();

    useEffect(() => {
        fetchUserReservations();
    }, [fetchUserReservations]);

    /**
     * 예약 취소 핸들러
     * @async
     * @function handleCancelReservation
     * @param {number} reservationId - 취소할 예약 ID
     */
    const handleCancelReservation = async (reservationId) => {
        const success = await cancelUserReservation(reservationId);
        if (success) {
            alert('예약이 성공적으로 취소되었습니다.');
            fetchUserReservations();
        }
    };

    if (isLoading) return <div className="loading">예약 정보를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;
    if (reservations.length === 0) return <div className="no-reservations">예약 내역이 없습니다.</div>;

    return (
        <div className="reservation-list">
            <h2>내 예약 목록</h2>
            {reservations.map((reservation) => (
                <div key={reservation.id} className="reservation-item">
                    <h3>예약 번호: {reservation.id}</h3>
                    <p>호텔 ID: {reservation.hotelId}</p>
                    <p>객실 번호: {reservation.roomNumber}</p>
                    <p>체크인: {formatDate(new Date(Number(reservation.checkInDate)))}</p>
                    <p>체크아웃: {formatDate(new Date(reservation.checkOutDate))}</p>
                    <p>금액: {web3.utils.fromWei(reservation.amount, 'ether')} ETH</p>
                    <p>상태: {String(reservation.status) === '1' ? '확정' : '취소됨'}</p>
                    {String(reservation.status) === '1' && (
                        <button 
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="cancel-button"
                        >
                            예약 취소
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReservationList;
