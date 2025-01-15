import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HotelList from './components/HotelList';
import HotelManagementPage from './pages/HotelManagementPage';
import useWeb3 from './hooks/useWeb3';

function App() {
    const { account } = useWeb3();

    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">홈</Link></li>
                        {account && (
                            <li><Link to="/manage">내 호텔 관리</Link></li>
                        )}
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<HotelList />} />
                    <Route path="/manage" element={<HotelManagementPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
