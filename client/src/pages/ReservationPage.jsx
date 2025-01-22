// client/src/pages/ReservationPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useWeb3 from '../hooks/useWeb3';
import useReservation from '../hooks/useReservation';
import useHotel from '../hooks/useHotel';
import useRoom from '../hooks/useRoom';
import { formatDate, parseDate } from '../utils/dateUtils';
import { weiToEther, etherToWei } from '../utils/web3Utils';
import { calculateReservationDuration, isValidReservationDate } from '../utils/reservationUtils';
// import '../styles/pages/ReservationPage.css';

/**
 * 예약 페이지 컴포넌트
 * 호텔 객실 예약을 위한 폼과 정보를 제공합니다.
 * @component
 * @returns {JSX.Element} ReservationPage 컴포넌트
 */
const ReservationPage = () => {
    const { hotelId, roomId } = useParams();
    const navigate = useNavigate();
    const { account } = useWeb3();
    const { addReservation, isLoading: isReservationLoading, error: reservationError } = useReservation();
    const { getHotelInfo } = useHotel();
    const { getRoomInfo } = useRoom();
    
    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [totalPrice, setTotalPrice] = useState('0');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * 호텔과 객실 정보를 로드하는 함수
     * @async
     * @function loadHotelAndRoom
     */
    const loadHotelAndRoom = useCallback(async () => {
        try {
            setIsLoading(true);
            const hotelData = await getHotelInfo(hotelId);
            const roomData = await getRoomInfo(hotelId, roomId);
            
            setHotel(hotelData);
            setRoom(roomData);
            setError(null);
        } catch (err) {
            setError('호텔과 객실 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [hotelId, roomId, getHotelInfo, getRoomInfo]);

    useEffect(() => {
        loadHotelAndRoom();
    }, [loadHotelAndRoom]);

    useEffect(() => {
        if (checkIn && checkOut && room) {
            const checkInDate = parseDate(checkIn);
            const checkOutDate = parseDate(checkOut);
            if (isValidReservationDate(checkInDate, checkOutDate)) {
                const { nights } = calculateReservationDuration(checkInDate, checkOutDate);
                const pricePerNight = weiToEther(room.price);
                const total = (nights * parseFloat(pricePerNight)).toFixed(4);
                setTotalPrice(total);
            } else {
                setError('유효하지 않은 예약 날짜입니다.');
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
            setError('유효하지 않은 예약 날짜입니다.');
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
            navigate('/my-reservations');
        }
    };

    if (isLoading || isReservationLoading) return <div className="loading">로딩 중...</div>;
    if (error || reservationError) return <div className="error">에러: {error || reservationError}</div>;
    if (!hotel || !room) return <div className="not-found">정보를 찾을 수 없습니다.</div>;

    return (
        <div className="reservation-page">
            <h1>예약하기</h1>
            
            <div className="hotel-info">
                <h2>{hotel.name}</h2>
                <p>객실 번호: {room.roomNumber}</p>
                <p>1박 가격: {weiToEther(room.price)} ETH</p>
            </div>

            <div className="reservation-form">
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
                    disabled={!checkIn || !checkOut || isReservationLoading || !account}
                    className="submit-button"
                >
                    {isReservationLoading ? '예약 처리 중...' : '예약하기'}
                </button>
            </div>
        </div>
    );
};

export default ReservationPage;
