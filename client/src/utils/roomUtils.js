// client/src/utils/roomUtils.js
import { dateToUnixTimestamp, formatDate, daysBetween, isValidDate, parseDate } from './dateUtils';

/**
 * 객실 관련 유틸리티 함수들
 * @module roomUtils
 */

/**
 * 객실의 가용성을 확인합니다.
 * @async
 * @function checkRoomAvailability
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {number} roomId - 객실 ID
 * @param {Date} checkInDate - 체크인 날짜
 * @param {Date} checkOutDate - 체크아웃 날짜
 * @returns {Promise<boolean>} 객실 가용성 여부
 * @throws {Error} 가용성 확인 실패 시 에러
 */
export const checkRoomAvailability = async (contract, hotelId, roomId, checkInDate, checkOutDate) => {
    if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
        throw new Error('유효하지 않은 날짜입니다.');
    }
    try {
        return await contract.methods.isRoomAvailable(
            hotelId,
            roomId,
            dateToUnixTimestamp(checkInDate),
            dateToUnixTimestamp(checkOutDate)
        ).call();
    } catch (error) {
        throw new Error(`객실 가용성 확인 실패 (호텔 ID: ${hotelId}, 객실 ID: ${roomId}, 체크인: ${formatDate(checkInDate)}, 체크아웃: ${formatDate(checkOutDate)}): ${error.message}`);
    }
};

/**
 * 특정 날짜의 객실 상태를 조회합니다.
 * @async
 * @function getRoomDateStatus
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {number} roomId - 객실 ID
 * @param {Date} date - 조회할 날짜
 * @returns {Promise<number>} 객실 상태 코드
 * @throws {Error} 상태 조회 실패 시 에러
 */
export const getRoomDateStatus = async (contract, hotelId, roomId, date) => {
    if (!isValidDate(date)) {
        throw new Error('유효하지 않은 날짜입니다.');
    }
    try {
        return await contract.methods.roomDateStatus(
            hotelId,
            roomId,
            dateToUnixTimestamp(date)
        ).call();
    } catch (error) {
        throw new Error(`객실 상태 조회 실패 (호텔 ID: ${hotelId}, 객실 ID: ${roomId}, 날짜: ${formatDate(date)}): ${error.message}`);
    }
};

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
        const rooms = await Promise.all(roomNumbers.map(async roomId => {
            const room = await contract.methods.hotelRooms(hotelId, roomId).call();
            return {
                ...room,
                lastUpdated: formatDate(new Date(room.lastUpdated * 1000)) // Unix 타임스탬프를 Date 객체로 변환 후 포맷팅
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
 * @param {number} roomId - 객실 ID
 * @returns {Promise<Object>} 객실 정보
 * @throws {Error} 객실 정보 로딩 실패 시 에러
 */
export const loadRoomInfo = async (contract, hotelId, roomId) => {
    try {
        const room = await contract.methods.hotelRooms(hotelId, roomId).call();
        return {
            ...room,
            lastUpdated: formatDate(new Date(room.lastUpdated * 1000)) // Unix 타임스탬프를 Date 객체로 변환 후 포맷팅
        };
    } catch (error) {
        throw new Error(`객실 정보 로딩 실패 (호텔 ID: ${hotelId}, 객실 ID: ${roomId}): ${error.message}`);
    }
};

/**
 * 예약 가능한 객실을 필터링합니다.
 * @async
 * @function filterAvailableRooms
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {Date} checkInDate - 체크인 날짜
 * @param {Date} checkOutDate - 체크아웃 날짜
 * @returns {Promise<Array>} 예약 가능한 객실 목록
 * @throws {Error} 객실 필터링 실패 시 에러
 */
export const filterAvailableRooms = async (contract, hotelId, checkInDate, checkOutDate) => {
    if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
        throw new Error('유효하지 않은 날짜입니다.');
    }
    try {
        const rooms = await loadRooms(contract, hotelId);
        const availableRooms = await Promise.all(rooms.map(async (room) => {
            const isAvailable = await checkRoomAvailability(contract, hotelId, room.id, checkInDate, checkOutDate);
            return isAvailable ? room : null;
        }));
        return availableRooms.filter(room => room !== null);
    } catch (error) {
        throw new Error(`예약 가능한 객실 필터링 실패 (호텔 ID: ${hotelId}, 체크인: ${formatDate(checkInDate)}, 체크아웃: ${formatDate(checkOutDate)}): ${error.message}`);
    }
};

/**
 * 특정 기간 동안의 객실 가격을 계산합니다.
 * @function calculateRoomPrice
 * @param {Object} room - 객실 정보
 * @param {Date} checkInDate - 체크인 날짜
 * @param {Date} checkOutDate - 체크아웃 날짜
 * @returns {Object} 총 가격과 숙박 일수
 */
export const calculateRoomPrice = (room, checkInDate, checkOutDate) => {
    if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
        throw new Error('유효하지 않은 날짜입니다.');
    }
    const numberOfNights = daysBetween(checkInDate, checkOutDate);
    const totalPrice = room.price * numberOfNights;
    return {
        totalPrice,
        numberOfNights,
        checkIn: formatDate(checkInDate),
        checkOut: formatDate(checkOutDate)
    };
};
