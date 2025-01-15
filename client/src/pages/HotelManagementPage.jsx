import React, { useState, useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3';
import AddHotel from '../components/AddHotel';
import HotelManagementList, { loadHotels } from '../components/HotelManagementList';
import AddRoom from '../components/AddRoom';
import RoomList from '../components/RoomList';

const HotelManagementPage = () => {
    const { web3, contract, account } = useWeb3();
    const [hotels, setHotels] = useState([]);
    const [expandedHotel, setExpandedHotel] = useState(null);

    useEffect(() => {
        if (contract && account) {
            fetchHotels();
        }
    }, [contract, account]);

    const fetchHotels = async () => {
        const hotelList = await loadHotels(contract, account);
        setHotels(hotelList);
    };

    const handleHotelAdded = () => {
        fetchHotels();
    };

    const handleRoomAdded = () => {
        fetchHotels();
    };

    const toggleHotelExpand = (hotelId) => {
        setExpandedHotel(expandedHotel === hotelId ? null : hotelId);
    };

    const { userHotels } = HotelManagementList({ hotels });

    return (
        <div>
            <h1>호텔 관리 페이지</h1>

            <AddHotel onHotelAdded={handleHotelAdded} />
            <h2>내 호텔 목록</h2>
            {userHotels.length === 0 ? (
                <p>등록된 호텔이 없습니다.</p>
            ) : (
                <ul>
                    {userHotels.map((hotel) => (
                        <li key={hotel.id}>
                            <h3>{hotel.name}</h3>
                            <p>IPFS 해시: {hotel.ipfsHash}</p>
                            <button onClick={() => toggleHotelExpand(hotel.id)}>
                                {expandedHotel === hotel.id ? '접기' : '객실 관리'}
                            </button>
                            {expandedHotel === hotel.id && (
                                <div>
                                    <AddRoom
                                        hotelId={hotel.id}
                                        onRoomAdded={handleRoomAdded}
                                    />
                                    <RoomList hotelId={hotel.id} rooms={hotel.rooms} />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HotelManagementPage;
