import Web3 from 'web3';
import HotelBookingContract from '../contracts/HotelBooking.json';

// Web3 인스턴스 생성 및 컨트랙트 인스턴스 반환
export const initWeb3 = async () => {
    // 메타마스크가 설치되어 있는지 확인
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 사용자에게 계정 연결 권한 요청
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Web3 인스턴스 생성
            const web3 = new Web3(window.ethereum);

            // 네트워크 ID 가져오기
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = HotelBookingContract.networks[networkId];

            // 컨트랙트 인스턴스 생성
            const contract = new web3.eth.Contract(
                HotelBookingContract.abi,
                deployedNetwork && deployedNetwork.address
            );

            return { web3, contract };
        } catch (error) {
            console.error("사용자가 계정 접근을 거부했거나 오류가 발생했습니다:", error);
            return { web3: null, contract: null };
        }
    } else {
        console.log('메타마스크를 설치해주세요!');
        return { web3: null, contract: null };
    }
};

// 계정 정보 가져오기
export const getAccount = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
};

// 계정 잔액 가져오기
export const getBalance = async (web3, account) => {
    const balanceWei = await web3.eth.getBalance(account);
    return web3.utils.fromWei(balanceWei, 'ether');
};
