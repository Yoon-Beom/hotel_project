import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useWeb3 from '../../hooks/useWeb3';
import '../../styles/components/layout/Navbar.css';

const Navbar = () => {
    const { web3, account, balance } = useWeb3();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [balanceInEth, setBalanceInEth] = useState('0');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            if (web3 && account) {
                setIsLoading(true);
                try {
                    const balanceWei = await web3.eth.getBalance(account);
                    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
                    
                    setBalanceInEth(parseFloat(balanceEth).toFixed(4));
                } catch (error) {
                    console.error("Failed to fetch balance:", error);
                    setBalanceInEth('0');
                }
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [web3, account]);

    const shortenAddress = (address) => {
        return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
                    {account && (
                        <>
                            <Link to="/manage" className="navbar-item">내 호텔 관리</Link>
                            <Link to="/my-reservations" className="navbar-item">예약 목록</Link>
                        </>
                    )}
                </div>

                <div className="navbar-end">
                    {account ? (
                        <div className="navbar-item">
                            <div className="account-info">
                                <span>계정: {shortenAddress(account)}</span>
                                <span>
                                    {isLoading ? "로딩 중..." : `잔액: ${balanceInEth} ETH`}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="navbar-item">
                            <button className="button is-primary">연결</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
