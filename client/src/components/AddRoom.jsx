import React, { useState } from 'react';
import useRoom from '../hooks/useRoom';
// import '../styles/components/AddRoom.css';

/**
 * 새로운 객실을 추가하는 컴포넌트
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {number} props.hotelId - 객실을 추가할 호텔의 ID
 * @param {Function} props.onRoomAdded - 객실 추가 완료 후 호출될 콜백 함수
 * @returns {JSX.Element} AddRoom 컴포넌트
 */
const AddRoom = ({ hotelId, onRoomAdded }) => {
    const [newRoomNumber, setNewRoomNumber] = useState(0);
    const [newRoomPrice, setNewRoomPrice] = useState(0);
    const [newRoomIpfsHash, setNewRoomIpfsHash] = useState('');
    const { addRoom, isLoading, error } = useRoom();

    /**
     * 객실 추가 핸들러
     * @async
     * @function handleAddRoom
     */
    const handleAddRoom = async () => {
        if (newRoomNumber <= 0 || newRoomPrice <= 0 || !newRoomIpfsHash) {
            alert('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        const success = await addRoom(hotelId, newRoomNumber, newRoomPrice, newRoomIpfsHash);

        if (success) {
            setNewRoomNumber(0);
            setNewRoomPrice(0);
            setNewRoomIpfsHash('');
            if (onRoomAdded) onRoomAdded();
        }
    };

    return (
        <div className="add-room-container">
            <h4>새 객실 추가</h4>
            <input
                type="number"
                placeholder="객실 번호"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(parseInt(e.target.value) || 0)}
                className="room-input"
            />
            <input
                type="number"
                step="0.000000000000000001"
                placeholder="가격 (ETH)"
                value={newRoomPrice}
                onChange={(e) => setNewRoomPrice(parseFloat(e.target.value) || 0)}
                className="room-input"
            />
            <input
                type="text"
                placeholder="IPFS 해시"
                value={newRoomIpfsHash}
                onChange={(e) => setNewRoomIpfsHash(e.target.value)}
                className="room-input"
            />
            <button 
                onClick={handleAddRoom} 
                disabled={isLoading}
                className="add-room-button"
            >
                {isLoading ? '처리 중...' : '객실 추가'}
            </button>
            {error && <p className="error-message">Error: {error}</p>}
        </div>
    );
};

export default AddRoom;
