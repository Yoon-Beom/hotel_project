// client/src/components/reservation/ReservationList.jsx
import React, { useEffect, useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import useReservation from '../../hooks/useReservation';
import useHotel from '../../hooks/useHotel';
import { parseDate } from '../../utils/dateUtils';
import '../../styles/components/reservation/ReservationList.css';

/**
 * 사용자의 예약 목록을 표시하는 컴포넌트
 * @component
 * @returns {JSX.Element} ReservationList 컴포넌트
 */
const ReservationList = () => {
    const { web3 } = useWeb3();
    const {
        reservations,
        isLoading: isReservationLoading,
        error: reservationError,
        fetchUserReservations,
        cancelUserReservation
    } = useReservation();
    const { getHotelInfo, isLoading: isHotelLoading, error: hotelError } = useHotel();
    const [reservationsWithHotelInfo, setReservationsWithHotelInfo] = useState([]);

    useEffect(() => {
        fetchUserReservations();
    }, [fetchUserReservations]);

    useEffect(() => {
        const fetchHotelInfo = async () => {
            const reservationsWithInfo = await Promise.all(reservations.map(async (reservation) => {
                const hotelInfo = await getHotelInfo(reservation.hotelId);
                return { ...reservation, hotelInfo };
            }));
            setReservationsWithHotelInfo(reservationsWithInfo);
        };

        if (reservations.length > 0) {
            fetchHotelInfo();
        }
    }, [reservations, getHotelInfo]);

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

    if (isReservationLoading || isHotelLoading) return <div className="loading">예약 정보를 불러오는 중...</div>;
    if (reservationError || hotelError) return <div className="error">에러: {reservationError || hotelError}</div>;
    if (reservationsWithHotelInfo.length === 0) return <div className="no-reservations">예약 내역이 없습니다.</div>;

    return (
        <div className="reservation-list">
            {[...reservationsWithHotelInfo].reverse().map((reservation) => (
                <div key={reservation.id} className={`reservation-item ${reservation.status === 0 ? 'cancelled' : ''}`}>
                    <div className="info-section">
                        <table className="reservation-info-table">
                            <tbody>
                                <tr>
                                    <td className="label">호텔 이름</td>
                                    <td className="value">{reservation.hotelInfo?.name || '정보 없음'}</td>
                                </tr>
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
                                    <td className="value">{Number(reservation.nightCount)}박 {Number(reservation.nightCount) + 1}일</td>
                                </tr>
                                <tr>
                                    <td className="label">예약 상태</td>
                                    <td className="value">
                                        <span className={reservation.status === 0 ? 'status-cancelled' : 'status-active'}>
                                            {reservation.status === 0 ? '취소된 예약' : '예약 완료'}
                                        </span>
                                    </td>
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
