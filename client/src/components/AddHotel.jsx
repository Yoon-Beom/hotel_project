// client/src/components/AddHotel.jsx
import React, { useState } from 'react';
import useHotel from '../hooks/useHotel';
// import '../styles/components/AddHotel.css';

/**
 * 새로운 호텔을 추가하는 컴포넌트
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {Function} props.onHotelAdded - 호텔 추가 완료 후 호출될 콜백 함수
 * @returns {JSX.Element} AddHotel 컴포넌트
 */
const AddHotel = ({ onHotelAdded }) => {
    const [newHotelName, setNewHotelName] = useState('');
    const [newHotelIpfsHash, setNewHotelIpfsHash] = useState('');
    const { addHotel, isLoading, error } = useHotel();

    /**
     * 호텔 추가 핸들러
     * @async
     * @function handleAddHotel
     */
    const handleAddHotel = async () => {
        if (!newHotelName || !newHotelIpfsHash) {
            alert('호텔 이름과 IPFS 해시를 모두 입력해주세요.');
            return;
        }

        const success = await addHotel(newHotelName, newHotelIpfsHash);

        if (success) {
            setNewHotelName('');
            setNewHotelIpfsHash('');
            if (onHotelAdded) onHotelAdded();
        }
    };

    return (
        <div className="add-hotel-container">
            <h2>새 호텔 등록</h2>
            <input
                type="text"
                placeholder="호텔 이름"
                value={newHotelName}
                onChange={(e) => setNewHotelName(e.target.value)}
                className="hotel-input"
            />
            <input
                type="text"
                placeholder="IPFS 해시"
                value={newHotelIpfsHash}
                onChange={(e) => setNewHotelIpfsHash(e.target.value)}
                className="hotel-input"
            />
            <button 
                onClick={handleAddHotel} 
                disabled={isLoading}
                className="add-hotel-button"
            >
                {isLoading ? '처리 중...' : '호텔 등록'}
            </button>
            {error && <p className="error-message">Error: {error}</p>}
        </div>
    );
};

export default AddHotel;
