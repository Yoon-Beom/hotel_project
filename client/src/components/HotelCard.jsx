// client/src/components/HotelCard.jsx
import React from 'react';
import RoomList from './RoomList';
import { shortenAddress } from '../utils/web3Utils';
// import '../styles/components/HotelCard.css';

/**
 * 호텔 정보를 카드 형태로 표시하는 컴포넌트
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {Object} props.hotel - 호텔 정보 객체
 * @param {number} props.hotel.id - 호텔 ID
 * @param {string} props.hotel.name - 호텔 이름
 * @param {string} props.hotel.manager - 호텔 관리자 주소
 * @param {string} props.hotel.ipfsHash - 호텔 정보가 저장된 IPFS 해시
 * @param {boolean} props.hotel.isActive - 호텔 활성화 상태
 * @returns {JSX.Element} HotelCard 컴포넌트
 */
const HotelCard = ({ hotel }) => {
    return (
        <div className="hotel-card">
            <h3 className="hotel-name">{hotel.name}</h3>
            <p className="hotel-manager">관리자: {shortenAddress(hotel.manager)}</p>
            <p className="hotel-ipfs">IPFS 해시: {hotel.ipfsHash}</p>
            <p className="hotel-status">
                상태: {hotel.isActive ? '활성' : '비활성'}
            </p>

            <RoomList hotelId={hotel.id} />
        </div>
    );
};

export default HotelCard;
