// client/src/utils/reservationUtils.js
import { formatDate, isValidDate, daysBetween } from './dateUtils';

/**
 * 예약 관련 유틸리티 함수들
 * @module reservationUtils
 */

// =============================================================================
// 예약 생성 및 관리
// =============================================================================

/**
 * 스마트 컨트랙트를 통해 새로운 예약을 생성합니다.
 * @async
 * @function createReservation
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {number} roomNumber - 객실 번호
 * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
 * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
 * @param {string} ipfsHash - 예약 추가 정보의 IPFS 해시
 * @param {string} account - 사용자 계정 주소
 * @returns {Promise<number>} 생성된 예약 ID
 * @throws {Error} 예약 생성 실패 시 에러
 */
export const createReservation = async (contract, hotelId, roomNumber, checkInDate, checkOutDate, ipfsHash, account) => {
    try {
        const nightCount = daysBetween(checkInDate.toString(), checkOutDate.toString());
        const result = await contract.methods.createReservation(
            hotelId,
            roomNumber,
            checkInDate,
            checkOutDate,
            nightCount,
            ipfsHash
        ).send({ from: account, gas: 1000000 });

        return result.events.ReservationCreated.returnValues.id;
    } catch (error) {
        throw new Error(`예약 생성 실패 (호텔 ID: ${hotelId}, 객실 번호: ${roomNumber}, 체크인: ${checkInDate}, 체크아웃: ${checkOutDate}): ${error.message}`);
    }
};

/**
 * 예약을 취소합니다.
 * @async
 * @function cancelReservation
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} reservationId - 취소할 예약 ID
 * @param {string} account - 사용자 계정 주소
 * @returns {Promise<boolean>} 취소 성공 여부
 * @throws {Error} 예약 취소 실패 시 에러
 */
export const cancelReservation = async (contract, reservationId, account) => {
    try {
        await contract.methods.cancelReservation(reservationId).send({ from: account });
        return true;
    } catch (error) {
        throw new Error(`예약 취소 실패 (예약 ID: ${reservationId}): ${error.message}`);
    }
};

/**
 * 예약에 대한 평점을 남깁니다.
 * @async
 * @function rateReservation
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} reservationId - 평가할 예약 ID
 * @param {number} rating - 평점 (1-5)
 * @param {string} account - 사용자 계정 주소
 * @returns {Promise<boolean>} 평가 성공 여부
 * @throws {Error} 예약 평가 실패 시 에러
 */
export const rateReservation = async (contract, reservationId, rating, account) => {
    try {
        await contract.methods.rateReservation(reservationId, rating).send({ from: account });
        return true;
    } catch (error) {
        throw new Error(`예약 평가 실패 (예약 ID: ${reservationId}): ${error.message}`);
    }
};

// =============================================================================
// 예약 조회
// =============================================================================

/**
 * 사용자의 모든 예약을 로드합니다.
 * @async
 * @function loadUserReservations
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {string} account - 사용자 계정 주소
 * @returns {Promise<Array>} 사용자의 예약 목록
 * @throws {Error} 예약 로딩 실패 시 에러
 */
export const loadUserReservations = async (contract, account) => {
    try {
        const reservationIds = await contract.methods.getUserReservations().call({ from: account });
        const reservations = await contract.methods.getReservationsByIds(reservationIds).call();
        return reservations.map(reservation => ({
            ...reservation,
            id: Number(reservation.id),
            hotelId: Number(reservation.hotelId),
            roomNumber: Number(reservation.roomNumber),
            checkInDate: Number(reservation.checkInDate),
            checkOutDate: Number(reservation.checkOutDate),
            nightCount: Number(reservation.nightCount),
            status: Number(reservation.status),
            amount: Number(reservation.amount),
            rating: Number(reservation.rating)
        }));
    } catch (error) {
        throw new Error(`사용자 예약 로딩 실패 (계정: ${account}): ${error.message}`);
    }
};

/**
 * 특정 예약의 상세 정보를 로드합니다.
 * @async
 * @function loadReservation
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} reservationId - 예약 ID
 * @returns {Promise<Object>} 예약 상세 정보
 * @throws {Error} 예약 정보 로딩 실패 시 에러
 */
export const loadReservation = async (contract, reservationId) => {
    try {
        const reservation = await contract.methods.getReservation(reservationId).call();
        return {
            ...reservation,
            id: Number(reservation.id),
            hotelId: Number(reservation.hotelId),
            roomNumber: Number(reservation.roomNumber),
            checkInDate: Number(reservation.checkInDate),
            checkOutDate: Number(reservation.checkOutDate),
            nightCount: Number(reservation.nightCount),
            status: Number(reservation.status),
            amount: Number(reservation.amount),
            rating: Number(reservation.rating)
        };
    } catch (error) {
        throw new Error(`예약 정보 로딩 실패 (예약 ID: ${reservationId}): ${error.message}`);
    }
};

// =============================================================================
// 예약 유효성 검사 및 계산
// =============================================================================

/**
 * 예약 가능한 날짜인지 확인합니다.
 * @function isValidReservationDate
 * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
 * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
 * @returns {boolean} 예약 가능 여부
 */
export const isValidReservationDate = (checkInDate, checkOutDate) => {
    const today = Number(formatDate(new Date()));
    return isValidDate(checkInDate.toString()) &&
        isValidDate(checkOutDate.toString()) &&
        checkInDate >= today &&
        checkOutDate > checkInDate;
};

/**
 * 예약 기간을 계산합니다.
 * @function calculateReservationDuration
 * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
 * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
 * @returns {Object} 예약 기간 정보
 */
export const calculateReservationDuration = (checkInDate, checkOutDate) => {
    const nights = daysBetween(checkInDate.toString(), checkOutDate.toString());
    return {
        nights,
        checkInDate,
        checkOutDate
    };
};

/**
 * 특정 기간 동안의 객실 가격을 계산합니다.
 * @function calculateRoomPrice
 * @param {Object} room - 객실 정보
 * @param {number} checkInDate - 체크인 날짜 (YYYYMMDD 형식)
 * @param {number} checkOutDate - 체크아웃 날짜 (YYYYMMDD 형식)
 * @returns {Object} 총 가격과 숙박 일수
 */
export const calculateRoomPrice = (room, checkInDate, checkOutDate) => {
    if (!isValidDate(checkInDate.toString()) || !isValidDate(checkOutDate.toString())) {
        throw new Error('유효하지 않은 날짜입니다.');
    }
    const numberOfNights = daysBetween(checkInDate.toString(), checkOutDate.toString());
    const totalPrice = room.price * numberOfNights;
    return {
        totalPrice,
        numberOfNights,
        checkInDate,
        checkOutDate
    };
};