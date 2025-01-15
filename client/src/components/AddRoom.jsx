import React, { useState } from 'react';
import { useAddRoom } from '../hooks/useRoom';

const AddRoom = ({ hotelId, onRoomAdded }) => {
    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [newRoomPrice, setNewRoomPrice] = useState('');
    const [newRoomIpfsHash, setNewRoomIpfsHash] = useState('');
    const { addRoom, error } = useAddRoom();

    const handleAddRoom = async () => {
        const success = await addRoom(hotelId, newRoomNumber, newRoomPrice, newRoomIpfsHash, onRoomAdded);
        if (success) {
            setNewRoomNumber('');
            setNewRoomPrice('');
            setNewRoomIpfsHash('');
        }
    };

    return (
        <div>
            <h4>새 객실 추가</h4>
            <input
                type="number"
                placeholder="객실 번호"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
            />
            <input
                type="number"
                placeholder="가격 (ETH)"
                value={newRoomPrice}
                onChange={(e) => setNewRoomPrice(e.target.value)}
            />
            <input
                type="text"
                placeholder="IPFS 해시"
                value={newRoomIpfsHash}
                onChange={(e) => setNewRoomIpfsHash(e.target.value)}
            />
            <button onClick={handleAddRoom}>객실 추가</button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default AddRoom;
