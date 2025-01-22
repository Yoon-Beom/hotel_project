// client/src/utils/web3Utils.js
import Web3 from 'web3';
import HotelBookingContract from '../contracts/HotelBooking.json';

/**
 * Web3 인스턴스와 컨트랙트 인스턴스를 초기화합니다.
 * @returns {Promise<{web3: Web3, contract: Contract, networkId: number} | {error: string}>}
 */
export const initWeb3 = async () => {
    // MetaMask가 설치되어 있는지 확인
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 사용자에게 계정 연결 권한 요청
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Web3 인스턴스 생성
            const web3 = new Web3(window.ethereum);
            
            // 네트워크 ID 가져오기
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = HotelBookingContract.networks[networkId];

            // 현재 네트워크에 컨트랙트가 배포되어 있는지 확인
            if (!deployedNetwork) {
                return { error: "현재 네트워크에 컨트랙트가 배포되어 있지 않습니다." };
            }

            // 컨트랙트 인스턴스 생성
            const contract = new web3.eth.Contract(
                HotelBookingContract.abi,
                deployedNetwork.address
            );
            
            return { web3, contract, networkId };
        } catch (error) {
            console.error("Web3 초기화 중 오류 발생:", error);
            return { error: "Web3 초기화 중 오류가 발생했습니다." };
        }
    } else {
        return { error: 'MetaMask를 설치해주세요!' };
    }
};

/**
 * 현재 연결된 계정 주소를 반환합니다.
 * @param {Web3} web3 - Web3 인스턴스
 * @returns {Promise<string>} 계정 주소
 */
export const getAccount = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
};

/**
 * 지정된 계정의 잔액을 조회합니다.
 * @param {Web3} web3 - Web3 인스턴스
 * @param {string} account - 계정 주소
 * @returns {Promise<string>} 이더 단위의 잔액
 */
export const getBalance = async (web3, account) => {
    const balanceWei = await web3.eth.getBalance(account);
    return web3.utils.fromWei(balanceWei, 'ether');
};

/**
 * 현재 연결된 네트워크 이름을 반환합니다.
 * @param {number} networkId - 네트워크 ID
 * @returns {string} 네트워크 이름
 */
export const getNetworkName = (networkId) => {
    switch (networkId) {
        case 1: return 'Mainnet';
        case 3: return 'Ropsten';
        case 4: return 'Rinkeby';
        case 5: return 'Goerli';
        case 42: return 'Kovan';
        default: return 'Unknown';
    }
};

/**
 * 이더리움 주소가 유효한지 확인합니다.
 * @param {string} address - 확인할 이더리움 주소
 * @returns {boolean} 주소의 유효성 여부
 */
export const isValidAddress = (address) => {
    return Web3.utils.isAddress(address);
};

/**
 * Wei를 Ether로 변환합니다.
 * @param {string|number} wei - 변환할 Wei 값
 * @returns {string} Ether 값
 */
export const weiToEther = (wei) => {
    return Web3.utils.fromWei(wei.toString(), 'ether');
};

/**
 * Ether를 Wei로 변환합니다.
 * @param {string|number} ether - 변환할 Ether 값
 * @returns {string} Wei 값
 */
export const etherToWei = (ether) => {
    return Web3.utils.toWei(ether.toString(), 'ether');
};
