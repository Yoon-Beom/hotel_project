import React, { useEffect } from 'react';
import { useRoom } from '../hooks/useRoom';
import useWeb3 from '../hooks/useWeb3';

const RoomList = ({ hotelId }) => {
    const { rooms, fetchRooms } = useRoom();
    const { web3 } = useWeb3();

    useEffect(() => {
        if (hotelId) {
            fetchRooms(hotelId);
        }
    }, [hotelId, fetchRooms]);

    return (
        <div>
            <h3>객실 목록</h3>
            <ul>
                {rooms.map((room) => (
                    <li key={room.roomNumber}>
                        방 번호: {room.roomNumber},
                        가격: {web3.utils.fromWei(room.price, 'ether')} ETH,
                        IPFS 해시: {room.ipfsHash}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomList;
