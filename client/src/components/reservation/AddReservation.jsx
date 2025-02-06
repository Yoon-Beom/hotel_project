// client/src/components/reservation/AddReservation.jsx
import React, { useState, useEffect } from 'react';
import useReservation from '../../hooks/useReservation';
import useWeb3 from '../../hooks/useWeb3';
import { weiToEther, etherToWei } from '../../utils/web3Utils';
import { calculateReservationDuration, isValidReservationDate } from '../../utils/reservationUtils';
import '../../styles/components/reservation/AddReservation.css'


/**
 * 새로운 예약을 추가하는 컴포넌트
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {number} props.hotelId - 호텔 ID
 * @param {number} props.roomId - 객실 ID
 * @param {Object} props.room - 객실 정보
 * @param {string} props.initialCheckIn - 초기 체크인 날짜 (YYYY-MM-DD 형식)
 * @param {string} props.initialCheckOut - 초기 체크아웃 날짜 (YYYY-MM-DD 형식)
 * @param {Function} props.onReservationAdded - 예약 추가 완료 후 호출될 콜백 함수
 * @returns {JSX.Element} AddReservation 컴포넌트
 */

const AddReservation = ({ hotelId, roomId, room, initialCheckIn, initialCheckOut, onReservationAdded }) => {
    const [totalPrice, setTotalPrice] = useState('0');
    const { addReservation, isLoading, error } = useReservation();
    const { account } = useWeb3();
    const [nights, setNights] = useState(0);

    // 값과 타입 확인을 위한 useEffect
    useEffect(() => {
        console.log("AddReservation - Props 값과 타입 확인:");
        console.log("initialCheckIn:", initialCheckIn, "타입:", typeof initialCheckIn);
        console.log("initialCheckOut:", initialCheckOut, "타입:", typeof initialCheckOut);
    }, [initialCheckIn, initialCheckOut, hotelId, roomId, room]);



    // 가격과 숙박일수 계산
    useEffect(() => {
        if (initialCheckIn && initialCheckOut && room) {
            if (isValidReservationDate(initialCheckIn, initialCheckOut)) {
                const { nights } = calculateReservationDuration(initialCheckIn, initialCheckOut);
                setNights(nights); // nights 값 저장
                const pricePerNight = weiToEther(room.price);
                const total = (nights * parseFloat(pricePerNight)).toFixed(4);
                setTotalPrice(total);
            }
        }
    }, [initialCheckIn, initialCheckOut, room]);

    const handleSubmit = async () => {
        if (!initialCheckIn || !initialCheckOut) return;


        if (!isValidReservationDate(initialCheckIn, initialCheckOut)) {
            alert('유효하지 않은 예약 날짜입니다.');
            return;
        }

        const success = await addReservation(
            hotelId,
            roomId,
            initialCheckIn,
            initialCheckOut,
            "dummyIPFS",
            etherToWei(totalPrice)
        );

        if (success && onReservationAdded) {
            onReservationAdded();
        }
    };

    return (
        <div className="add-reservation-container">
            <h2>예약 정보</h2>
            <div className="reservation-info">
                <div className="booking-section">
                    <table className="booking-table">
                        <tbody>
                            <tr>
                                <td className="label">체크인</td>
                                <td className="value">
                                    {initialCheckIn && 
                                        `${('' + initialCheckIn).substring(0, 4)}년 ${('' + initialCheckIn).substring(4, 6)}월 ${('' + initialCheckIn).substring(6, 8)}일`}
                                    <span className="time-info">(15:00이후부터 입실)</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="label">체크아웃</td>
                                <td className="value">
                                    {initialCheckOut && 
                                        `${('' + initialCheckOut).substring(0, 4)}년 ${('' + initialCheckOut).substring(4, 6)}월 ${('' + initialCheckOut).substring(6, 8)}일`}
                                    <span className="time-info">(11:00까지 퇴실)</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="label">숙박일</td>
                                <td className="value">{`${nights}박 ${nights + 1}일`}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
    
                <div className="price-info">
                    <span>총 결제 금액</span>
                    <span className="amount">{totalPrice} ETH</span>
                </div>
    
                <button
                    onClick={handleSubmit}
                    disabled={!initialCheckIn || !initialCheckOut || isLoading || !account}
                    className="submit-button"
                >
                    {isLoading ? '예약 처리 중...' : '예약하기'}
                </button>
                {error && <p className="error-message">Error: {error}</p>}
            </div>
        </div>
    );
};

export default AddReservation;
