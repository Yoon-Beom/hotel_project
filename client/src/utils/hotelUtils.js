// client/src/utils/hotelUtils.js
import { loadRooms, checkRoomAvailability  } from './roomUtils';
import { formatDate, parseDate, isValidDate } from './dateUtils';

/**
 * 호텔 관련 유틸리티 함수들을 포함하는 모듈
 * @module hotelUtils
 */

/**
 * 새로운 호텔을 추가합니다.
 * @async
 * @function addHotel
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {string} account - 호텔 관리자의 계정 주소
 * @param {string} name - 호텔 이름
 * @param {string} ipfsHash - 호텔 정보가 저장된 IPFS 해시
 * @returns {Promise<Object>} 추가된 호텔 정보
 * @throws {Error} 호텔 추가 실패 시 에러
 */
export const addHotel = async (contract, account, name, ipfsHash) => {
    try {
        const transaction = await contract.methods.addHotel(name, ipfsHash).send({ from: account });
        const hotelId = transaction.events.HotelAdded.returnValues.hotelId;
        const newHotel = await contract.methods.hotels(hotelId).call();
        return { 
            ...newHotel, 
            id: hotelId,
            createdAt: formatDate(new Date()) // 호텔 생성 날짜 추가
        };
    } catch (error) {
        throw new Error(`호텔 추가 실패: ${error.message}`);
    }
};

/**
 * 모든 호텔을 로드합니다.
 * @async
 * @function loadHotels
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @returns {Promise<Array>} 호텔 목록
 * @throws {Error} 호텔 로딩 실패 시 에러
 */
export const loadHotels = async (contract) => {
    try {
        const hotelCount = await contract.methods.hotelCount().call();
        const hotelList = [];
        for (let i = 1; i <= hotelCount; i++) {
            const hotel = await contract.methods.hotels(i).call();
            hotelList.push({
                ...hotel,
                id: i,
                createdAt: formatDate(new Date(hotel.createdAt * 1000)) // Unix 타임스탬프를 Date 객체로 변환 후 포맷팅
            });
        }
        return hotelList;
    } catch (error) {
        throw new Error(`호텔 목록 로딩 실패: ${error.message}`);
    }
};

/**
 * 호텔 목록을 페이지네이션하여 로드합니다.
 * @async
 * @function loadHotelsWithPagination
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} page - 페이지 번호
 * @param {number} pageSize - 페이지당 호텔 수
 * @returns {Promise<{hotels: Array, totalCount: number}>} 호텔 목록과 전체 호텔 수
 * @throws {Error} 호텔 로딩 실패 시 에러
 */
export const loadHotelsWithPagination = async (contract, page, pageSize) => {
    try {
        const hotelCount = await contract.methods.hotelCount().call();
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, hotelCount);

        const hotelList = [];
        for (let i = startIndex + 1; i <= endIndex; i++) {
            const hotel = await contract.methods.hotels(i).call();
            hotelList.push({
                ...hotel,
                createdAt: formatDate(new Date(hotel.createdAt * 1000)) // Unix 타임스탬프를 Date 객체로 변환 후 포맷팅
            });
        }

        return { hotels: hotelList, totalCount: Number(hotelCount) };
    } catch (error) {
        throw new Error(`호텔 목록 로딩 실패: ${error.message}`);
    }
};

/**
 * 특정 호텔의 정보를 로드합니다.
 * @async
 * @function loadHotelInfo
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @returns {Promise<Object>} 호텔 정보
 * @throws {Error} 호텔 정보 로딩 실패 시 에러
 */
export const loadHotelInfo = async (contract, hotelId) => {
    try {
        const hotel = await contract.methods.hotels(hotelId).call();
        const rooms = await loadRooms(contract, hotelId);
        return { 
            ...hotel, 
            rooms,
            createdAt: formatDate(new Date(hotel.createdAt * 1000)) // Unix 타임스탬프를 Date 객체로 변환 후 포맷팅
        };
    } catch (error) {
        throw new Error(`호텔 정보 로딩 실패: ${error.message}`);
    }
};

/**
 * 호텔 목록을 검색합니다.
 * @function searchHotels
 * @param {Array} hotels - 전체 호텔 목록
 * @param {string} searchTerm - 검색어
 * @param {Date} [startDate] - 검색 시작 날짜 (선택적)
 * @param {Date} [endDate] - 검색 종료 날짜 (선택적)
 * @returns {Array} 검색 결과 호텔 목록
 */
export const searchHotels = (hotels, searchTerm, startDate, endDate) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return hotels.filter(hotel => {
        const nameMatch = hotel.name.toLowerCase().includes(lowercasedTerm);
        const locationMatch = hotel.location.toLowerCase().includes(lowercasedTerm);
        
        if (startDate && endDate && isValidDate(startDate) && isValidDate(endDate)) {
            const hotelDate = parseDate(hotel.createdAt);
            return (nameMatch || locationMatch) && hotelDate >= startDate && hotelDate <= endDate;
        }
        
        return nameMatch || locationMatch;
    });
};

/**
 * 사용자의 호텔을 필터링합니다.
 * @function getUserHotels
 * @param {Array} hotels - 전체 호텔 목록
 * @param {string} account - 사용자 계정 주소
 * @returns {Array} 사용자의 호텔 목록
 */
export const getUserHotels = (hotels, account) => {
    return hotels.filter(hotel =>
        hotel.manager.toLowerCase() === account.toLowerCase()
    );
};

/**
 * 예약 가능한 객실이 있는 호텔만 필터링합니다.
 * @async
 * @function filterHotelsWithAvailableRooms
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {Array} hotels - 필터링할 호텔 목록
 * @param {Date} checkInDate - 체크인 날짜
 * @param {Date} checkOutDate - 체크아웃 날짜
 * @returns {Promise<Array>} 예약 가능한 객실이 있는 호텔 목록
 * @throws {Error} 호텔 필터링 실패 시 에러
 */
export const filterHotelsWithAvailableRooms = async (contract, hotels, checkInDate, checkOutDate) => {
    try {
        const availableHotels = [];

        for (const hotel of hotels) {
            const rooms = await loadRooms(contract, hotel.id);
            const availableRooms = await Promise.all(
                rooms.map(async (room) => {
                    const isAvailable = await checkRoomAvailability(
                        contract, 
                        hotel.id, 
                        room.roomNumber, 
                        checkInDate, 
                        checkOutDate
                    );
                    return isAvailable;
                })
            );

            // 하나라도 예약 가능한 객실이 있으면 호텔 추가
            if (availableRooms.some(available => available)) {
                availableHotels.push({
                    ...hotel,
                    availableRoomsCount: availableRooms.filter(Boolean).length
                });
            }
        }

        return availableHotels;
    } catch (error) {
        throw new Error(`호텔 필터링 실패: ${error.message}`);
    }
};