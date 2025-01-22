// client/src/components/RoomList.jsx
import React, { useEffect, useState } from 'react';
import useRoom from '../hooks/useRoom';
import useWeb3 from '../hooks/useWeb3';
// import '../styles/components/RoomList.css';

/**
 * 특정 호텔의 객실 목록을 표시하는 컴포넌트
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {number} props.hotelId - 객실 목록을 표시할 호텔의 ID
 * @returns {JSX.Element} RoomList 컴포넌트
 */
const RoomList = ({ hotelId }) => {
    const { fetchRooms, isLoading, error } = useRoom();
    const { web3 } = useWeb3();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        /**
         * 객실 목록을 불러오는 비동기 함수
         * @async
         * @function loadRooms
         */
        const loadRooms = async () => {
            if (hotelId) {
                const fetchedRooms = await fetchRooms(hotelId);
                setRooms(fetchedRooms);
            }
        };
        loadRooms();
    }, [hotelId, fetchRooms]);

    if (isLoading) return <div className="loading">객실 정보를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;
    if (rooms.length === 0) return <div className="no-rooms">등록된 객실이 없습니다.</div>;

    return (
        <div className="room-list">
            <h3>객실 목록</h3>
            <ul>
                {rooms.map((room) => (
                    <li key={room.roomNumber} className="room-item">
                        <p>방 번호: {room.roomNumber}</p>
                        <p>가격: {web3.utils.fromWei(room.price, 'ether')} ETH</p>
                        <p>IPFS 해시: {room.ipfsHash}</p>
                        <p>상태: {room.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomList;
