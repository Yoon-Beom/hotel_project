import React, { useState } from 'react';
import useWeb3 from '../hooks/useWeb3';

const AddHotel = ({ onHotelAdded }) => {
    const { contract, account } = useWeb3();
    const [newHotelName, setNewHotelName] = useState('');
    const [newHotelIpfsHash, setNewHotelIpfsHash] = useState('');

    const handleAddHotel = async () => {
        if (!contract) return;
        try {
            await contract.methods.addHotel(newHotelName, newHotelIpfsHash).send({
                from: account,
                gas: 500000
            });
            setNewHotelName('');
            setNewHotelIpfsHash('');
            if (onHotelAdded) onHotelAdded();
        } catch (error) {
            console.error("Error adding hotel:", error);
        }
    };

    return (
        <div>
            <h2>새 호텔 등록</h2>
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
        </div>
    );
};

export default AddHotel;
