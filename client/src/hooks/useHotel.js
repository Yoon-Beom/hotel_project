// client/src/hooks/useHotel.js
import { useState, useCallback } from 'react';
import useWeb3 from './useWeb3';
import { loadRooms } from './useRoom';

export const loadHotels = async (contract) => {
    const hotelCount = await contract.methods.hotelCount().call();
    const hotelList = [];
    for (let i = 1; i <= hotelCount; i++) {
        const hotel = await contract.methods.hotels(i).call();
        const rooms = await loadRooms(contract, i);
        hotelList.push({ ...hotel, rooms });
    }
    return hotelList;
};

export const getUserHotels = (hotels, account) => {
    return hotels.filter(hotel =>
        hotel.manager.toLowerCase() === account.toLowerCase()
    );
};

export const useAddHotel = () => {
    const { contract, account } = useWeb3();
    const [error, setError] = useState(null);

    const addHotel = async (hotelName, ipfsHash, onHotelAdded) => {
        if (!contract) {
            setError("Contract not initialized");
            return false;
        }
        try {
            await contract.methods.addHotel(hotelName, ipfsHash).send({
                from: account,
                gas: 500000
            });
            if (onHotelAdded) {
                onHotelAdded();
            }
            return true;
        } catch (error) {
            console.error("Error adding hotel:", error);
            setError(error.message);
            return false;
        }
    };

    return { addHotel, error };
};

export const useHotel = () => {
    const { contract, account } = useWeb3();
    const [hotels, setHotels] = useState([]);

    const fetchHotels = useCallback(async () => {
        if (!contract) {
            console.log("Contract not initialized yet. Waiting...");
            return;
        }
        const fetchedHotels = await loadHotels(contract);
        setHotels(fetchedHotels);
    }, [contract]);

    const userHotels = getUserHotels(hotels, account);

    return {
        hotels,
        userHotels,
        fetchHotels
    };
};
