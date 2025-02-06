// client/src/components/reservation/AvailableRoomList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useRoom } from '../../hooks/useRoom';
import { weiToEther } from '../../utils/web3Utils';
import '../../styles/components/reservation/AvailableRoomList.css';

/**
 * 예약 가능한 객실 목록을 표시하는 컴포넌트
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {number} props.hotelId - 호텔 ID
 * @param {number} props.checkInDate - 체크인 날짜 (YYYYMMDD 형식)
 * @param {number} props.checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
 * @returns {JSX.Element} AvailableRoomList 컴포넌트
 */
const AvailableRoomList = ({ hotelId, checkInDate, checkOutDate, onRoomClick }) => {
    const { getAvailableRooms, isLoading, error } = useRoom();
    const [rooms, setRooms] = useState([]);

    const fetchRooms = useCallback(async () => {
        if (!hotelId || !checkInDate || !checkOutDate) return;

        try {
            const availableRooms = await getAvailableRooms(
                hotelId,
                checkInDate,
                checkOutDate
            );
            setRooms(availableRooms);
        } catch (err) {
            console.error("객실 목록 로딩 실패:", err);
        }
    }, [hotelId, checkInDate, checkOutDate, getAvailableRooms]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    if (isLoading) return <div className="loading">객실 정보를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;

    return (
        <div className="available-rooms">
            {rooms.length === 0 ? (
                <p className="no-rooms">예약 가능한 객실이 없습니다.</p>
            ) : (
                rooms.map(room => (
                    <div
                        key={room.roomNumber}
                        className="room-card"
                        onClick={() => onRoomClick(hotelId, room.roomNumber)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="room-header">
                            <h3>객실 번호: {room.roomNumber}호</h3>
                            <span className="room-status">예약 가능</span>
                        </div>
                        <div className="room-details">
                            <p className="room-price">가격: {weiToEther(room.price)} ETH</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AvailableRoomList;
