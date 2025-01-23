// client/src/hooks/useWeb3.js
import { useContext, useMemo, useCallback } from 'react';
import { Web3Context } from '../contexts/Web3Context';

/**
 * Web3Context의 값을 사용하기 위한 커스텀 훅
 * @returns {Object} Web3Context의 값과 추가 유틸리티 함수들
 * @throws {Error} Web3Provider 외부에서 사용될 경우 에러 발생
 */
export const useWeb3 = () => {
    const context = useContext(Web3Context);
    
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }

    const {
        web3,
        contract,
        account,
        balance,
        networkId,
        networkName,
        error,
        updateAccountInfo,
        updateNetworkInfo
    } = context;

    /**
     * Web3 인스턴스가 초기화되었는지 확인
     * @returns {boolean} Web3 초기화 여부
     */
    const isWeb3Initialized = () => {
        return web3 !== null && contract !== null;
    };

    /**
     * 현재 연결된 계정이 있는지 확인
     * @returns {boolean} 계정 연결 여부
     */
    const isConnected = () => {
        return account !== '' && account !== undefined;
    };

    /**
     * 에러 메시지 초기화
     */
    const clearError = useCallback(() => {
        if (error) {
            context.setError(null);
        }
    }, [error, context]);    

    return useMemo(() => ({
        web3,
        contract,
        account,
        balance,
        networkId,
        networkName,
        error,
        updateAccountInfo,
        updateNetworkInfo,
        isWeb3Initialized,
        isConnected,
        clearError
    }), [web3, contract, account, balance, networkId, networkName, error]);
};

export default useWeb3;

