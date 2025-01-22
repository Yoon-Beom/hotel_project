// client/src/contexts/Web3Context.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { initWeb3, getAccount, getBalance, getNetworkName } from '../utils/web3Utils';

/**
 * Web3 관련 상태와 함수를 제공하는 Context
 */
export const Web3Context = createContext();

/**
 * Web3 관련 상태를 관리하고 제공하는 Provider 컴포넌트
 * @param {Object} props 
 * @param {React.ReactNode} props.children
 */
export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');
    const [networkId, setNetworkId] = useState(null);
    const [networkName, setNetworkName] = useState('');
    const [error, setError] = useState(null);

    /**
     * Web3 인스턴스와 컨트랙트를 초기화합니다.
     */
    const initializeWeb3 = useCallback(async () => {
        const result = await initWeb3();
        if (result.error) {
            setError(result.error);
            return;
        }
        
        const { web3, contract, networkId } = result;
        setWeb3(web3);
        setContract(contract);
        setNetworkId(networkId);
        setNetworkName(getNetworkName(networkId));

        const acc = await getAccount(web3);
        setAccount(acc);

        const bal = await getBalance(web3, acc);
        setBalance(bal);
    }, []);

    /**
     * 계정 정보를 업데이트합니다.
     */
    const updateAccountInfo = useCallback(async () => {
        if (web3) {
            const acc = await getAccount(web3);
            setAccount(acc);
            const bal = await getBalance(web3, acc);
            setBalance(bal);
        }
    }, [web3]);

    /**
     * 네트워크 정보를 업데이트합니다.
     */
    const updateNetworkInfo = useCallback(async () => {
        if (web3) {
            const networkId = await web3.eth.net.getId();
            setNetworkId(networkId);
            setNetworkName(getNetworkName(networkId));
        }
    }, [web3]);

    // 초기 Web3 설정
    useEffect(() => {
        initializeWeb3();
    }, [initializeWeb3]);

    // 계정 변경 감지
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', updateAccountInfo);
            return () => {
                window.ethereum.removeListener('accountsChanged', updateAccountInfo);
            };
        }
    }, [updateAccountInfo]);

    // 네트워크 변경 감지
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                initializeWeb3();
            });
            return () => {
                window.ethereum.removeListener('chainChanged', initializeWeb3);
            };
        }
    }, [initializeWeb3]);

    // Context 값
    const value = {
        web3,
        contract,
        account,
        balance,
        networkId,
        networkName,
        error,
        updateAccountInfo,
        updateNetworkInfo
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3Provider;
