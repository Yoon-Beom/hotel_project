import React from 'react';
import useWeb3 from '../hooks/useWeb3';

export const loadRooms = async (contract, hotelId) => {
    const roomNumbers = await contract.methods.getHotelRooms(hotelId).call();
    const rooms = [];
    for (let roomNumber of roomNumbers) {
        const room = await contract.methods.hotelRooms(hotelId, roomNumber).call();
        rooms.push(room);
    }
    return rooms;
};

const RoomList = ({ hotelId, rooms }) => {
    const { web3 } = useWeb3();

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
