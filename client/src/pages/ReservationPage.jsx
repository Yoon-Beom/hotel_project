// client/src/pages/ReservationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useWeb3 from '../hooks/useWeb3';
import { useAddReservation } from '../hooks/useReservation';
import { formatDate, parseDate } from '../utils/dateUtils';
import { useHotel } from '../hooks/useHotel';
import { useRoom } from '../hooks/useRoom';

const ReservationPage = () => {
    // URL 파라미터와 네비게이션
    const { hotelId, roomId } = useParams();
    const navigate = useNavigate();

    // Web3와 예약 훅
    const { web3, contract } = useWeb3();
    const { addReservation, error: reservationError } = useAddReservation();
    
    // 상태 관리
    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [totalPrice, setTotalPrice] = useState('0');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 호텔과 객실 정보 로드
    useEffect(() => {
        const loadHotelAndRoom = async () => {
            if (!contract) return;
            
            try {
                setIsLoading(true);
                const hotelData = await contract.methods.hotels(hotelId).call();
                const roomData = await contract.methods.hotelRooms(hotelId, roomId).call();
                
                setHotel(hotelData);
                setRoom(roomData);
                setError(null);
            } catch (err) {
                console.error('Failed to load hotel and room data:', err);
                setError('호텔과 객실 정보를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadHotelAndRoom();
    }, [contract, hotelId, roomId]);

    // 총 가격 계산
    useEffect(() => {
        if (checkIn && checkOut && room) {
            const startDate = parseDate(checkIn);
            const endDate = parseDate(checkOut);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const pricePerDay = web3.utils.fromWei(room.price, 'ether');
            const total = (days * parseFloat(pricePerDay)).toString();
            setTotalPrice(total);
        }
    }, [checkIn, checkOut, room, web3]);

    // 예약 처리
    const handleSubmit = async () => {
        if (!checkIn || !checkOut) {
            setError('체크인/체크아웃 날짜를 선택해주세요.');
            return;
        }

        const success = await addReservation(
            hotelId,
            roomId,
            parseDate(checkIn),
            parseDate(checkOut),
            totalPrice
        );

        if (success) {
            navigate('/my-reservations');
        }
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (error || reservationError) return <div>에러: {error || reservationError}</div>;
    if (!hotel || !room) return <div>정보를 찾을 수 없습니다.</div>;

    return (
        <div className="reservation-page">
            <h1>예약하기</h1>
            
            <div className="hotel-info">
                <h2>{hotel.name}</h2>
                <p>객실 번호: {room.roomNumber}</p>
                <p>1박 가격: {web3.utils.fromWei(room.price, 'ether')} ETH</p>
            </div>

            <div className="reservation-form">
                <div className="form-group">
                    <label>체크인 날짜:</label>
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={formatDate(new Date())}
                    />
                </div>

                <div className="form-group">
                    <label>체크아웃 날짜:</label>
                    <input
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
                    disabled={!checkIn || !checkOut || isLoading}
                    className="submit-button"
                >
                    {isLoading ? '예약 처리 중...' : '예약하기'}
                </button>
            </div>
        </div>
    );
};

export default ReservationPage;
