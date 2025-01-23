// client/src/components/AddReservation.jsx
import React, { useState, useEffect } from 'react';
import useReservation from '../hooks/useReservation';
import useWeb3 from '../hooks/useWeb3';
import { formatDate, parseDate } from '../utils/dateUtils';
import { weiToEther, etherToWei } from '../utils/web3Utils';
import { calculateReservationDuration, isValidReservationDate } from '../utils/reservationUtils';

/**
 * 새로운 예약을 추가하는 컴포넌트
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {number} props.hotelId - 호텔 ID
 * @param {number} props.roomId - 객실 ID
 * @param {Object} props.room - 객실 정보
 * @param {Function} props.onReservationAdded - 예약 추가 완료 후 호출될 콜백 함수
 * @returns {JSX.Element} AddReservation 컴포넌트
 */
const AddReservation = ({ hotelId, roomId, room, onReservationAdded }) => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [totalPrice, setTotalPrice] = useState('0');
    const { addReservation, isLoading, error } = useReservation();
    const { account } = useWeb3();

    useEffect(() => {
        if (checkIn && checkOut && room) {
            const checkInDate = parseDate(checkIn);
            const checkOutDate = parseDate(checkOut);
            if (isValidReservationDate(checkInDate, checkOutDate)) {
                const { nights } = calculateReservationDuration(checkInDate, checkOutDate);
                const pricePerNight = weiToEther(room.price);
                const total = (nights * parseFloat(pricePerNight)).toFixed(4);
                setTotalPrice(total);
            }
        }
    }, [checkIn, checkOut, room]);

    /**
     * 예약 제출 핸들러
     * @async
     * @function handleSubmit
     */
    const handleSubmit = async () => {
        if (!checkIn || !checkOut) return;

        const checkInDate = parseDate(checkIn);
        const checkOutDate = parseDate(checkOut);

        if (!isValidReservationDate(checkInDate, checkOutDate)) {
            alert('유효하지 않은 예약 날짜입니다.');
            return;
        }

        const success = await addReservation(
            hotelId,
            roomId,
            checkInDate,
            checkOutDate,
            etherToWei(totalPrice)
        );

        if (success) {
            setCheckIn('');
            setCheckOut('');
            setTotalPrice('0');
            if (onReservationAdded) onReservationAdded();
        }
    };

    return (
        <div className="add-reservation-container">
            <h2>예약하기</h2>
            <div className="form-group">
                <label htmlFor="checkIn">체크인 날짜:</label>
                <input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={formatDate(new Date())}
                />
            </div>
            <div className="form-group">
                <label htmlFor="checkOut">체크아웃 날짜:</label>
                <input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                />
            </div>
            {checkIn && checkOut && (
                <div className="price-info">
                    <h3>총 결제 금액: {totalPrice} ETH</h3>
                </div>
            )}
            <button
                onClick={handleSubmit}
                disabled={!checkIn || !checkOut || isLoading || !account}
                className="submit-button"
            >
                {isLoading ? '예약 처리 중...' : '예약하기'}
            </button>
            {error && <p className="error-message">Error: {error}</p>}
        </div>
    );
};

export default AddReservation;
