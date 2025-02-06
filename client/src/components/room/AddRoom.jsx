// client/src/components/room/AddRoom.jsx
import React, { useState } from 'react';
import useRoom from '../../hooks/useRoom';
import '../../styles/components/room/AddRoom.css';

const AddRoom = ({ hotelId, onRoomAdded }) => {
    const [newRoomNumber, setNewRoomNumber] = useState(0);
    const [newRoomPrice, setNewRoomPrice] = useState(0);
    const [newRoomIpfsHash, setNewRoomIpfsHash] = useState('');
    const { addRoom, isLoading, error } = useRoom();

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
        <h2>새 객실 등록</h2>
        <div className="input-group">
            <label>객실 번호</label>
            <input
                type="number"
                placeholder="101"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(parseInt(e.target.value) || 0)}
                className="room-input"
            />
        </div>
        <div className="input-group">
            <label>가격 (ETH)</label>
            <input
                type="number"
                step="0.000000000000000001"
                placeholder="0.5"
                value={newRoomPrice}
                onChange={(e) => setNewRoomPrice(parseFloat(e.target.value) || 0)}
                className="room-input"
            />
        </div>
        <div className="input-group">
            <label>IPFS 해시</label>
            <input
                type="text"
                placeholder="QmX..."
                value={newRoomIpfsHash}
                onChange={(e) => setNewRoomIpfsHash(e.target.value)}
                className="room-input"
            />
        </div>
        <button 
            onClick={handleAddRoom} 
            disabled={isLoading}
            className="add-room-button"
        >
            객실 등록
        </button>
        {error && <p className="error-message">Error: {error}</p>}
    </div>
    );
};

export default AddRoom;
