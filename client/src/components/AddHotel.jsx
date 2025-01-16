import React, { useState } from 'react';
import { useAddHotel } from '../hooks/useHotel';

const AddHotel = ({ onHotelAdded }) => {
    const [newHotelName, setNewHotelName] = useState('');
    const [newHotelIpfsHash, setNewHotelIpfsHash] = useState('');
    const { addHotel, error } = useAddHotel();

    const handleAddHotel = async () => {
        const success = await addHotel(newHotelName, newHotelIpfsHash, onHotelAdded);

        if (success) {
            setNewHotelName('');
            setNewHotelIpfsHash('');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="호텔 이름"
                value={newHotelName}
                onChange={(e) => setNewHotelName(e.target.value)}
            />
            <input
                type="text"
                placeholder="IPFS 해시"
                value={newHotelIpfsHash}
                onChange={(e) => setNewHotelIpfsHash(e.target.value)}
            />
            <button onClick={handleAddHotel}>호텔 등록</button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default AddHotel;
