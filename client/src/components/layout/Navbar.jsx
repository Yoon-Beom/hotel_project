// client/src/componets/layout/Navbar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useWeb3 from '../../hooks/useWeb3';
import '../../styles/components/layout/Navbar.css';

/**
 * 네비게이션 바 컴포넌트
 * 웹사이트의 주요 링크와 사용자 계정 정보를 표시합니다.
 * @returns {JSX.Element} Navbar 컴포넌트
 */
const Navbar = () => {
    const { 
        account, 
        balance, 
        networkName, 
        isWeb3Initialized, 
        isConnected,
        updateAccountInfo 
    } = useWeb3();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * 계정 주소를 축약하여 표시합니다.
     * @param {string} address - 이더리움 주소
     * @returns {string} 축약된 주소
     */
    const shortenAddress = useCallback((address) => {
        return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
    }, []);

    /**
     * 모바일 메뉴 토글 함수
     */
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    /**
     * 지갑 연결 함수
     * @returns {Promise<void>}
     */
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                await updateAccountInfo();
            } catch (error) {
                console.error("Failed to connect wallet:", error);
            }
        } else {
            alert("MetaMask를 설치해주세요!");
        }
    };

    // 계정 정보 로딩 상태 관리
    useEffect(() => {
        setIsLoading(!isWeb3Initialized() || !isConnected());
    }, [isWeb3Initialized, isConnected]);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">호텔 예약 시스템</Link>
            </div>

            <button className="navbar-burger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
                <div className="navbar-start">
                    <Link to="/" className="navbar-item">홈</Link>
                    {isConnected() && (
                        <>
                            <Link to="/manage" className="navbar-item">내 호텔 관리</Link>
                            <Link to="/my-reservations" className="navbar-item">예약 목록</Link>
                        </>
                    )}
                </div>

                <div className="navbar-end">
                    {isConnected() ? (
                        <div className="navbar-item">
                            <div className="account-info">
                                <span>계정: {shortenAddress(account)}</span>
                                <span>
                                    {isLoading ? "로딩 중..." : `잔액: ${parseFloat(balance).toFixed(4)} ETH`}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="navbar-item">
                            <button className="button is-primary" onClick={connectWallet}>연결</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
