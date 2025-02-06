// client/src/components/reservation/ReservationList.jsx
import React, { useEffect } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import useReservation from '../../hooks/useReservation';
import { parseDate } from '../../utils/dateUtils';
import '../../styles/components/ReservationList.css';

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
    if (error) return <div className="error">러: {error}</div>;
    if (reservations.length === 0) return <div className="no-reservations">예약 내역이 없습니다.</div>;

    return (
        <div className="reservation-list">
            <h2>예약 페이지</h2>
            {[...reservations].reverse().map((reservation) => (
                <div key={reservation.id} className="reservation-item">
                    <div className="info-section">
                        <table className="reservation-info-table">
                            <tbody>
                                <tr>
                                    <td className="label">객실 번호</td>
                                    <td className="value">{reservation.roomNumber}호</td>
                                </tr>
                                <tr>
                                    <td className="label">1박 가격</td>
                                    <td className="value">
                                        {web3.utils.fromWei(reservation.amount.toString(), 'ether')} ETH
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
    
                    <div className="info-section">
                        <table className="reservation-info-table">
                            <tbody>
                                <tr>
                                    <td className="label">체크인</td>
                                    <td className="value">
                                        {parseDate(reservation.checkInDate).toLocaleDateString()} 15:00
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">체크아웃</td>
                                    <td className="value">
                                        {parseDate(reservation.checkOutDate).toLocaleDateString()} 11:00
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">숙박일</td>
                                    <td className="value">2박 3일</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
    
                    {reservation.status === 1 && (
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
