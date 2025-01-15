import React, { useState, useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3';
import { loadRooms } from '../components/RoomList';

export const loadHotels = async (contract, account) => {
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

const HotelManagementList = ({ hotels }) => {
    const { account } = useWeb3();
    const userHotels = getUserHotels(hotels, account);
    
    // console.log("hotels: " + hotels);
    // console.log("userHotels" + userHotels);

    return { userHotels };
};

export default HotelManagementList;