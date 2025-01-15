import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HotelManagementPage from './pages/HotelManagementPage';
import useWeb3 from './hooks/useWeb3';

const App = () => {
  const { account, balance } = useWeb3();

  return (
    <Router>
      <div>
        <h1>호텔 예약 시스템</h1>
        {account ? (
          <>
            <p>연결된 계정 주소: {account}</p>
            <p>잔액: {balance || '0'} ETH</p>
          </>
        ) : (
          <p>메타마스크에 연결되지 않았습니다. 연결해주세요.</p>
        )}

        <nav>
          <ul>
            <li>
              <Link to="/hotel-management">호텔 관리 페이지</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/hotel-management" element={<HotelManagementPage />} />
          <Route path="/" element={
            <>
              <h2>메인 페이지</h2>
              <p>호텔 관리 페이지로 이동하려면 위의 링크를 클릭하세요.</p>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
