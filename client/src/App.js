import React, { useState, useEffect } from 'react';
import { Web3Provider } from './contexts/Web3Context';
import useWeb3 from './hooks/useWeb3';
import HotelList from './components/HotelList';

const App = () => {
  const { web3, contract, account, balance } = useWeb3();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelIpfsHash, setNewHotelIpfsHash] = useState('');

  useEffect(() => {
    if (contract) {
      loadHotels();
    }
  }, [contract]);

  const loadHotels = async () => {
    const hotelCount = await contract.methods.hotelCount().call();
    const hotelList = [];
    for (let i = 1; i <= hotelCount; i++) {
      const hotel = await contract.methods.hotels(i).call();
      const rooms = await loadRooms(i);
      hotelList.push({ ...hotel, rooms });
    }
    setHotels(hotelList);
    setLoading(false);
  };

  const loadRooms = async (hotelId) => {
    const roomNumbers = await contract.methods.getHotelRooms(hotelId).call();
    const rooms = [];
    for (let roomNumber of roomNumbers) {
      const room = await contract.methods.hotelRooms(hotelId, roomNumber).call();
      rooms.push(room);
    }
    return rooms;
  };

  const registerHotel = async () => {
    if (!contract) return;
    try {
      await contract.methods.addHotel(newHotelName, newHotelIpfsHash).send({ from: account, gas: 500000 });
      await loadHotels();
      setNewHotelName('');
      setNewHotelIpfsHash('');
    } catch (error) {
      console.error("Error registering hotel:", error);
    }
  };

  const addRoom = async (hotelId, roomNumber, price, ipfsHash) => {
    if (!contract) return;
    try {
      await contract.methods.addRoom(
        hotelId,
        roomNumber,
        web3.utils.toWei(price, 'ether'),
        ipfsHash
      ).send({ from: account, gas: 500000 });
      await loadHotels();
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  return (
    <div>
      <h1>호텔 예약 시스템</h1>
      {account ? (
        <>
          <p>연결된 계정 주소: {account}</p>
          <p>잔액: {balance} ETH</p>
        </>
      ) : (
        <p>메타마스크에 연결되지 않았습니다. 연결해주세요.</p>
      )}

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
      <button onClick={registerHotel}>호텔 등록</button>

      {loading ? (
        <p>로딩중...</p>
      ) : (
        <HotelList hotels={hotels} addRoom={addRoom} />
      )}
    </div>
  );
}

export default App;
