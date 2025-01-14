import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import HotelBookingContract from './contracts/HotelBooking.json';

const App = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [contract, setContract] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  // 새로운 호텔 정보를 위한 상태
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelIpfsHash, setNewHotelIpfsHash] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState('');
  const [newRoomIpfsHash, setNewRoomIpfsHash] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  useEffect(() => {
    const init = async () => {
      // 메타마스크가 설치되어 있는지 확인
      if (typeof window.ethereum !== 'undefined') {
        try {
          // 사용자에게 계정 연결 권한 요청
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Web3 인스턴스 생성
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // 연결된 계정 가져오기
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          // 잔액 가져오기
          const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
          const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
          setBalance(balanceEth);

          // 네트워크 ID 가져오기
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = HotelBookingContract.networks[networkId];

          // 컨트랙트 인스턴스 생성
          const instance = new web3Instance.eth.Contract(
            HotelBookingContract.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(instance);
          await loadHotels(instance);
        } catch (error) {
          console.error("사용자가 계정 접근을 거부했거나 오류가 발생했습니다:", error);
        }
      } else {
        console.log('메타마스크를 설치해주세요!');
      }
    };
    init();
  }, []);

  // 계정 변경 감지
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        updateBalance(accounts[0]);
      });
    }
  }, []);

  // 잔액 업데이트 함수
  const updateBalance = async (address) => {
    if (web3) {
      const balanceWei = await web3.eth.getBalance(address);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);
    }
  };

  const loadHotels = async (instance) => {
    const hotelCount = await instance.methods.hotelCount().call();
    const hotelList = [];

    for (let i = 1; i <= hotelCount; i++) {
      const hotel = await instance.methods.hotels(i).call();
      const rooms = await loadRooms(instance, i);
      hotelList.push({ ...hotel, rooms });
    }
    setHotels(hotelList);
    setLoading(false);
  };

  // 호텔의 방 목록을 불러오는 함수
  const loadRooms = async (instance, hotelId) => {
    const roomNumbers = await instance.methods.getHotelRooms(hotelId).call();
    const rooms = [];
    for (let roomNumber of roomNumbers) {
      const room = await instance.methods.hotelRooms(hotelId, roomNumber).call();
      rooms.push(room);
    }
    return rooms;
  };

  // 새로운 호텔을 등록하는 함수
  const registerHotel = async () => {
    if (!contract) return;
    try {
      // 컨트랙트의 addHotel 함수 호출
      await contract.methods.addHotel(newHotelName, newHotelIpfsHash).send({ from: account, gas: 500000 });
      // 호텔 목록 새로고침
      await loadHotels(contract);
      // 입력 필드 초기화
      setNewHotelName('');
      setNewHotelIpfsHash('');
    } catch (error) {
      console.error("Error registering hotel:", error);
    }
  };

  // 새로운 방을 추가하는 함수
  const addRoom = async () => {
    if (!contract || !selectedHotelId) return;
    try {
      await contract.methods.addRoom(
        selectedHotelId,
        newRoomNumber,
        Web3.utils.toWei(newRoomPrice, 'ether'),
        newRoomIpfsHash
      ).send({
        from: account,
        gas: 500000 // 가스 한도 설정
      });
      await loadHotels(contract);
      setNewRoomNumber('');
      setNewRoomPrice('');
      setNewRoomIpfsHash('');
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

      {/* 호텔 등록 폼 */}
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

      {loading ? (<p>로딩중...</p>) : (
        <div>
          <h2>호텔 목록</h2>
          <ul>
            {hotels.map((hotel) => (
              <li key={hotel.id}>
                {hotel.name} (IPFS 해시: {hotel.ipfsHash})
                <h3>객실 목록</h3>
                <ul>
                  {hotel.rooms.map((room) => (
                    <li key={room.roomNumber}>
                      방 번호: {room.roomNumber}, 가격: {Web3.utils.fromWei(room.price, 'ether')} ETH
                    </li>
                  ))}
                </ul>
                {/* 새 방 추가 폼 */}
                <h4>새 방 추가</h4>
                <input
                  type="number"
                  placeholder="방 번호"
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
                <button onClick={() => {
                  setSelectedHotelId(hotel.id);
                  addRoom();
                }}>방 추가</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
