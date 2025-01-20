// client/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/layout/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>호텔 예약 시스템</h3>
                        <p>블록체인 기반의 안전하고 투명한 호텔 예약 서비스를 제공합니다.</p>
                    </div>
                    <div className="footer-section">
                        <h3>빠른 링크</h3>
                        <ul>
                            <li><Link to="/">홈</Link></li>
                            <li><Link to="/manage">호텔 관리</Link></li>
                            <li><Link to="/my-reservations">내 예약</Link></li>
                            <li><Link to="/statistics">통계</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>연락처</h3>
                        <p>이메일: support@hotelchain.com</p>
                        <p>전화: 123-456-7890</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 호텔 예약 시스템. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
