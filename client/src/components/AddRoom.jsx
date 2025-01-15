import React, { useState } from 'react';
import useWeb3 from '../hooks/useWeb3';

const AddRoom = ({ hotelId, onRoomAdded }) => {
    const { web3, contract, account } = useWeb3();
    const [newRoomNumber, setNewRoomNumber] = useState('');
    const [newRoomPrice, setNewRoomPrice] = useState('');
    const [newRoomIpfsHash, setNewRoomIpfsHash] = useState('');

    const addRoom = async () => {
        if (!contract || !hotelId) return;
        try {
            await contract.methods.addRoom(
                hotelId,
                newRoomNumber,
                web3.utils.toWei(newRoomPrice, 'ether'),
                newRoomIpfsHash
            ).send({
                from: account,
                gas: 500000 // 가스 한도 설정
            });

            // 입력 필드 초기화
            setNewRoomNumber('');
            setNewRoomPrice('');
            setNewRoomIpfsHash('');

            // 부모 컴포넌트에 객실 추가 완료 알림
            if (onRoomAdded) onRoomAdded();
        } catch (error) {
            console.error("Error adding room:", error);
        }
    };

    return (
        <div>
            <h4>새 객실 추가</h4>
            <input
                type="number"
                placeholder="객실 번호"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
            />
            <input
                type="number"
                placeholder="가격 (ETH)"
                value={newRoomPrice}
                onChange={(e) => setNewRoomPrice(e.target.value)}
            />
            <input
                type="text"
                placeholder="IPFS 해시"
                value={newRoomIpfsHash}
                onChange={(e) => setNewRoomIpfsHash(e.target.value)}
            />
            <button onClick={addRoom}>객실 추가</button>
        </div>
    );
};

export default AddRoom;
