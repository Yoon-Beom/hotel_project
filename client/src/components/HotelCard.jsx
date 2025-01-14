import React, { useState } from 'react';
import Web3 from 'web3';

const HotelCard = ({ hotel, addRoom }) => {
    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [newRoomPrice, setNewRoomPrice] = useState('');
    const [newRoomIpfsHash, setNewRoomIpfsHash] = useState('');

    const handleAddRoom = () => {
        addRoom(hotel.id, newRoomNumber, newRoomPrice, newRoomIpfsHash);
        setNewRoomNumber('');
        setNewRoomPrice('');
        setNewRoomIpfsHash('');
    };

    return (
        <li>
            {hotel.name} (IPFS 해시: {hotel.ipfsHash})
            <h3>객실 목록</h3>
            <ul>
                {hotel.rooms.map((room) => (
                    <li key={room.roomNumber}>
                        방 번호: {room.roomNumber}, 가격: {Web3.utils.fromWei(room.price, 'ether')} ETH
                    </li>
                ))}
            </ul>
            <h4>새 방 추가</h4>
            <input
                type="number"
                placeholder="방 번호"
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
            <button onClick={handleAddRoom}>방 추가</button>
        </li>
    );
};

export default HotelCard;
