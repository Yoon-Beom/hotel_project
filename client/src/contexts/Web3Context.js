// client/src/contexts/Web3Context.js
import React, { createContext, useState, useEffect } from 'react';
import { initWeb3, getAccount, getBalance } from '../utils/web3Utils';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');

    useEffect(() => {
        const init = async () => {
            const { web3, contract } = await initWeb3();
            if (web3 && contract) {
                setWeb3(web3);
                setContract(contract);
                const acc = await getAccount(web3);
                setAccount(acc);
                const bal = await getBalance(web3, acc);
                setBalance(bal);
            }
        };
        init();
    }, []);

    // 계정 변경 감지
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts) => {
                setAccount(accounts[0]);
                if (web3) {
                    const bal = await getBalance(web3, accounts[0]);
                    setBalance(bal);
                }
            });
        }
    }, [web3]);

    return (
        <Web3Context.Provider value={{ web3, contract, account, balance }}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3Provider;
