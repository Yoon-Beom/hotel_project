// client/src/components/room/RoomList.jsx
import React, { useEffect, useState } from 'react';
import useRoom from '../../hooks/useRoom';
import useWeb3 from '../../hooks/useWeb3';
import '../../styles/components/room/RoomList.css';

/**
 * 특정 호텔의 객실 목록을 표시하는 컴포넌트
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {number} props.hotelId - 객실 목록을 표시할 호텔의 ID
 * @returns {JSX.Element} RoomList 컴포넌트
 */
const RoomList = ({ hotelId }) => {
    const { fetchRooms, isLoading, error } = useRoom();
    const { web3 } = useWeb3();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        /**
         * 객실 목록을 불러오는 비동기 함수
         * @async
         * @function loadRooms
         */
        const loadRooms = async () => {
            if (hotelId) {
                const fetchedRooms = await fetchRooms(hotelId);
                setRooms(fetchedRooms);
                console.log("fetchedRooms: ", fetchedRooms);
            }
        };
        loadRooms();
    }, [hotelId, fetchRooms]);

    if (isLoading) return <div className="loading">객실 정보를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;
    if (rooms.length === 0) return <div className="no-rooms">등록된 객실이 없습니다.</div>;

    // client/src/components/RoomList.jsx
    return (
        <div className="room-list">
            <h3>객실 목록</h3>
            <div className="room-list-container">
                {rooms.map((room) => (
                    <div key={room.roomNumber} className="room-info-section">
                        <div className="room-info-container">
                            <div className="hotel-image-container">
                                <div className="hotel-image-placeholder">
                                    객실 이미지 준비중
                                </div>
                                <div className="image-navigation">
                                    <button className="nav-button">◀</button>
                                    <button className="nav-button">▶</button>
                                </div>
                            </div>
                            <table className="room-info-table">
                                <tbody>
                                    <tr>
                                        <td className="label">방 번호</td>
                                        <td className="value">{room.roomNumber}호</td>
                                    </tr>
                                    <tr>
                                        <td className="label">가격</td>
                                        <td className="value">{web3.utils.fromWei(room.price, 'ether')} ETH</td>
                                    </tr>
                                    <tr>
                                        <td className="label">IPFS 해시</td>
                                        <td className="value">{room.ipfsHash}</td>
                                    </tr>
                                    <tr>
                                        <td className="label">상태</td>
                                        <td className="value">{room.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}
export default RoomList;
