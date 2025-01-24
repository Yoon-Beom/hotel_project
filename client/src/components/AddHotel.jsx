// client/src/components/AddHotel.jsx
import React, { useState } from 'react';
import useHotel from '../hooks/useHotel';
// import useIPFS from '../hooks/useIPFS';
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
    const [hotelImage, setHotelImage] = useState(null);
    const { addHotel, isLoading, error } = useHotel();

    /**
     * 호텔 추가 핸들러
     * @async
     * @function handleAddHotel
     */
    const handleAddHotel = async () => {
        if (!newHotelName || !hotelImage) {
            alert('호텔 이름과 이미지를 모두 입력해주세요.');
            return;
        }

        try {
            const ipfsHash = "dummyIPFS";
            const success = await addHotel(newHotelName, ipfsHash);

            if (success) {
                setNewHotelName('');
                setHotelImage(null);
                if (onHotelAdded) onHotelAdded();
            }
        } catch (err) {
            console.error("호텔 추가 중 오류 발생:", err);
        }
    };

    /**
     * 이미지 파일 변경 핸들러
     * @function handleImageChange
     * @param {Event} e - 파일 입력 이벤트
     */
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setHotelImage(e.target.files[0]);
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
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
