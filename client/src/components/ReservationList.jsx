// components/ReservationList.jsx
import React, { useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3';
import { useReservation } from '../hooks/useReservation';

const ReservationList = () => {
    const { web3 } = useWeb3();
    const { 
        reservations, 
        isLoading, 
        error, 
        fetchUserReservations, 
        cancelReservation 
    } = useReservation();

    useEffect(() => {
        fetchUserReservations();
    }, [fetchUserReservations]);

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;
    if (reservations.length === 0) return <div>예약 내역이 없습니다.</div>;

    return (
        <div className="reservation-list">
            {reservations.map((reservation) => (
                <div key={reservation.id} className="reservation-item">
                    <h3>예약 번호: {reservation.id}</h3>
                    <p>호텔 ID: {reservation.hotelId}</p>
                    <p>객실 번호: {reservation.roomNumber}</p>
                    <p>체크인: {formatDate(reservation.checkInDate)}</p>
                    <p>체크아웃: {formatDate(reservation.checkOutDate)}</p>
                    <p>금액: {web3.utils.fromWei(reservation.amount, 'ether')} ETH</p>
                    <p>상태: {reservation.status === '1' ? '확정' : '취소됨'}</p>
                    {reservation.status === '1' && (
                        <button 
                            onClick={() => cancelReservation(reservation.id)}
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
