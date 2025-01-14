import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import HotelBookingContract from './contracts/HotelBooking.json';

const App = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [contract, setContract] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Web3 인스턴스 생성
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      
      // 계정 가져오기
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      
      // 잔액 가져오기
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);

      // 네트워크 ID 가져오기
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HotelBookingContract.networks[networkId];
      
      // 컨트랙트 인스턴스 생성
      const instance = new web3.eth.Contract(
        HotelBookingContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      setContract(instance);
      await loadHotels(instance);
    };
    init();
  }, []);

  const loadHotels = async (instance) => {
    const hotelCount = await instance.methods.hotelCount().call();
    const hotelList = [];

    for (let i = 1; i <= hotelCount; i++) {
      const hotel = await instance.methods.hotels(i).call();
      hotelList.push(hotel);
    }
    setHotels(hotelList);
    setLoading(false);
  };

  return (
    <div>
      <h1>호텔 예약 시스템</h1>
      <p>계정 주소: {account}</p>
      <p>잔액: {balance} ETH</p>
      {loading ? (<p>로딩중...</p>) : (
        <div>
          <h2>호텔 목록</h2>
          <ul>
            {hotels.map((hotel, index) => (
              <li key={index + 1}>
                {hotel.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
