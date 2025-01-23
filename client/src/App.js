// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import HotelManagementPage from './pages/HotelManagementPage';
import HotelList from './components/HotelList';
// import HotelDetailsPage from './pages/HotelDetailsPage';
import ReservationPage from './pages/ReservationPage';
// import UserReservationsPage from './pages/UserReservationsPage';
import StatisticsPage from './pages/StatisticsPage';
import UserReservationsPage from './pages/UserReservationsPage';
import './styles/global.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/hotellist" element={<HotelList />} />
                    <Route path="/manage" element={<HotelManagementPage />} />
                    {/* <Route path="/hotel/:id" element={<HotelDetailsPage />} /> */}
                    <Route path="/reservation/:hotelId/:roomId" element={<ReservationPage />} />
                    <Route path="/my-reservations" element={<UserReservationsPage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
