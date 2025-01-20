// client/src/hooks/useRoom.js
import { useState } from 'react';
import useWeb3 from './useWeb3';

export const loadRooms = async (contract, hotelId) => {
    const roomNumbers = await contract.methods.getHotelRooms(hotelId).call();
    const rooms = [];
    for (let roomNumber of roomNumbers) {
        const room = await contract.methods.hotelRooms(hotelId, roomNumber).call();
        rooms.push(room);
    }
    return rooms;
};

export const useAddRoom = () => {
    const { web3, contract, account } = useWeb3();
    const [error, setError] = useState(null);

    const addRoom = async (hotelId, roomNumber, roomPrice, ipfsHash, onRoomAdded) => {
        if (!contract || !hotelId) {
            setError("Contract not initialized or invalid hotel ID");
            return false;
        }
        try {
            await contract.methods.addRoom(
                hotelId,
                roomNumber,
                web3.utils.toWei(roomPrice, 'ether'),
                ipfsHash
            ).send({
                from: account,
                gas: 500000
            });
            if (onRoomAdded) {
                onRoomAdded();
            }
            return true;
        } catch (error) {
            console.error("Error adding room:", error);
            setError(error.message);
            return false;
        }
    };

    return { addRoom, error };
};

export const useRoom = () => {
    const { contract } = useWeb3();
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async (hotelId) => {
        const fetchedRooms = await loadRooms(contract, hotelId);
        setRooms(fetchedRooms);
    };

    return { rooms, fetchRooms };
};
