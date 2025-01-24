// client/src/utils/roomUtils.js
import { isValidDate, getDateArray } from './dateUtils';

/**
 * 객실 관련 유틸리티 함수들
 * @module roomUtils
 */

// =============================================================================
// 객실 상태 관리
// =============================================================================

/**
 * 객실 상태 번호를 문자열로 변환하는 함수
 * @function getRoomStatusString
 * @param {number} statusNumber - 객실 상태 번호
 * @returns {string} 객실 상태 문자열
 */
function getRoomStatusString(statusNumber) {
    switch (statusNumber) {
        case 0: return '이용 가능';
        case 1: return '예약됨';
        case 2: return '청소 필요';
        case 3: return '유지보수 중';
        default: return '알 수 없음';
    }
}

/**
 * 특정 날짜의 객실 상태를 조회합니다.
 * @async
 * @function getRoomDateStatus
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {number} roomNumber - 객실 번호
 * @param {number} date - 조회할 날짜 (YYYYMMDD 형식의 정수)
 * @returns {Promise<number>} 객실 상태 코드
 * @throws {Error} 상태 조회 실패 시 에러
 */
export const getRoomDateStatus = async (contract, hotelId, roomNumber, date) => {
    if (!isValidDate(date)) {
        throw new Error('유효하지 않은 날짜입니다.');
    }
    try {
        return await contract.methods.roomDateStatus(hotelId, roomNumber, date).call();
    } catch (error) {
        throw new Error(`객실 상태 조회 실패 (호텔 ID: ${hotelId}, 객실 번호: ${roomNumber}, 날짜: ${date}): ${error.message}`);
    }
};

// =============================================================================
// 객실 가용성 확인
// =============================================================================

/**
 * 객실의 가용성을 확인합니다.
 * @async
 * @function checkRoomAvailability
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {number} roomNumber - 객실 번호
 * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식의 정수)
 * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식의 정수)
 * @returns {Promise<boolean>} 객실 가용성 여부
 * @throws {Error} 가용성 확인 실패 시 에러
 */
export const checkRoomAvailability = async (contract, hotelId, roomNumber, checkInDate, checkOutDate) => {
    if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
        throw new Error('유효하지 않은 날짜입니다.');
    }
    try {
        const dates = getDateArray(checkInDate, checkOutDate);
        return await contract.methods.isRoomAvailable(hotelId, roomNumber, dates).call();
    } catch (error) {
        throw new Error(`객실 가용성 확인 실패 (호텔 ID: ${hotelId}, 객실 번호: ${roomNumber}, 체크인: ${checkInDate}, 체크아웃: ${checkOutDate}): ${error.message}`);
    }
};

// =============================================================================
// 객실 정보 로딩
// =============================================================================

/**
 * 호텔의 객실 정보를 로드합니다.
 * @async
 * @function loadRooms
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @returns {Promise<Array>} 객실 정보 배열
 * @throws {Error} 객실 로딩 실패 시 에러
 */
export const loadRooms = async (contract, hotelId) => {
    try {
        const roomNumbers = await contract.methods.getHotelRooms(hotelId).call();
        const rooms = await Promise.all(roomNumbers.map(async roomNumber => {
            const room = await contract.methods.hotelRooms(hotelId, roomNumber).call();
            return {
                ...room,
                roomNumber: Number(roomNumber),
                status: getRoomStatusString(Number(room.status)),
                price: Number(room.price)
            };
        }));
        return rooms;
    } catch (error) {
        throw new Error(`객실 목록 로딩 실패 (호텔 ID: ${hotelId}): ${error.message}`);
    }
};

/**
 * 특정 객실의 정보를 로드합니다.
 * @async
 * @function loadRoomInfo
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {number} roomNumber - 객실 번호
 * @returns {Promise<Object>} 객실 정보
 * @throws {Error} 객실 정보 로딩 실패 시 에러
 */
export const loadRoomInfo = async (contract, hotelId, roomNumber) => {
    try {
        const room = await contract.methods.hotelRooms(hotelId, roomNumber).call();
        return {
            ...room,
            roomNumber: Number(roomNumber),
            status: getRoomStatusString(Number(room.status)),
            price: Number(room.price)
        };
    } catch (error) {
        throw new Error(`객실 정보 로딩 실패 (호텔 ID: ${hotelId}, 객실 번호: ${roomNumber}): ${error.message}`);
    }
};

// =============================================================================
// 가격 계산
// =============================================================================

/**
 * 예약 가능한 객실을 필터링합니다.
 * @async
 * @function filterAvailableRooms
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식의 정수)
 * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식의 정수)
 * @returns {Promise<Array>} 예약 가능한 객실 목록
 * @throws {Error} 객실 필터링 실패 시 에러
 */
export const filterAvailableRooms = async (contract, hotelId, checkInDate, checkOutDate) => {
    if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
        throw new Error('유효하지 않은 날짜입니다.');
    }
    try {
        const rooms = await loadRooms(contract, hotelId);
        const dates = getDateArray(checkInDate, checkOutDate);
        const availableRooms = await Promise.all(rooms.map(async (room) => {
            const isAvailable = await contract.methods.isRoomAvailable(hotelId, room.roomNumber, dates).call();
            return isAvailable ? room : null;
        }));
        return availableRooms.filter(room => room !== null);
    } catch (error) {
        throw new Error(`예약 가능한 객실 필터링 실패 (호텔 ID: ${hotelId}, 체크인: ${checkInDate}, 체크아웃: ${checkOutDate}): ${error.message}`);
    }
};
