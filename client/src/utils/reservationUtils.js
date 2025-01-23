// client/src/utils/reservationUtils.js
import { dateToUnixTimestamp, formatDate, isValidDate, daysBetween } from './dateUtils';

/**
 * 예약 관련 유틸리티 함수들
 * @module reservationUtils
 */

/**
 * 스마트 컨트랙트를 통해 새로운 예약을 생성합니다.
 * @async
 * @function createReservation
 * @param {Object} contract - 호텔 예약 스마트 컨트랙트 인스턴스
 * @param {number} hotelId - 호텔 ID
 * @param {number} roomId - 객실 ID
 * @param {Date} checkInDate - 체크인 날짜
 * @param {Date} checkOutDate - 체크아웃 날짜
 * @param {string} price - 예약 가격 (Wei 단위)
 * @param {string} account - 사용자 계정 주소
 * @returns {Promise<number>} 생성된 예약 ID
 * @throws {Error} 예약 생성 실패 시 에러
 */
export const createReservation = async (contract, hotelId, roomId, checkInDate, checkOutDate, price, account) => {
    try {
        console.log("formatDate(checkInDate): ", formatDate(checkInDate));
        console.log("formatDate(checkOutDate): ", formatDate(checkOutDate));
        console.log("dateToUnixTimestamp(checkInDate): ", dateToUnixTimestamp(checkInDate));
        console.log("dateToUnixTimestamp(checkOutDate): ", dateToUnixTimestamp(checkOutDate));
        const result = await contract.methods.createReservation(
            hotelId,
            roomId,
            dateToUnixTimestamp(checkInDate),
            dateToUnixTimestamp(checkOutDate),
            "dummyIPFS"
        ).send({ from: account, gas: 1000000, value: price })  // value 추가

        return result.events.ReservationCreated.returnValues.reservationId;
    } catch (error) {
        throw new Error(`예약 생성 실패 (호텔 ID: ${hotelId}, 객실 ID: ${roomId}, 체크인: ${formatDate(checkInDate)}, 체크아웃: ${formatDate(checkOutDate)}): ${error.message}`);
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
        return reservations.map(reservation => {
            
            const checkInDate = new Date(parseInt(reservation.checkInDate) * 1000);
            const checkOutDate = new Date(parseInt(reservation.checkOutDate) * 1000);
            
            return {
                ...reservation,
                id: Number(reservation.id),
                hotelId: Number(reservation.hotelId),
                roomNumber: Number(reservation.roomNumber),
                checkInDate: Number(checkInDate),
                checkOutDate: Number(checkOutDate),
                duration: daysBetween(checkInDate, checkOutDate),
                isValidDate: isValidDate(new Date(Number(reservation.checkInDate) * 1000)) && 
                             isValidDate(new Date(Number(reservation.checkOutDate) * 1000))
            };
        });
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
        const checkInDate = new Date(reservation.checkInDate * 1000);
        const checkOutDate = new Date(reservation.checkOutDate * 1000);
        return {
            ...reservation,
            checkInDate,
            checkOutDate,
            formattedCheckInDate: formatDate(checkInDate),
            formattedCheckOutDate: formatDate(checkOutDate),
            duration: daysBetween(checkInDate, checkOutDate),
            isValidDate: isValidDate(checkInDate) && isValidDate(checkOutDate)
        };
    } catch (error) {
        throw new Error(`예약 정보 로딩 실패 (예약 ID: ${reservationId}): ${error.message}`);
    }
};

/**
 * 예약 가능한 날짜인지 확인합니다.
 * @function isValidReservationDate
 * @param {Date} checkInDate - 체크인 날짜
 * @param {Date} checkOutDate - 체크아웃 날짜
 * @returns {boolean} 예약 가능 여부
 */
export const isValidReservationDate = (checkInDate, checkOutDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return isValidDate(checkInDate) &&
        isValidDate(checkOutDate) &&
        checkInDate >= today &&
        checkOutDate > checkInDate;
};

/**
 * 예약 기간을 계산합니다.
 * @function calculateReservationDuration
 * @param {Date} checkInDate - 체크인 날짜
 * @param {Date} checkOutDate - 체크아웃 날짜
 * @returns {Object} 예약 기간 정보
 */
export const calculateReservationDuration = (checkInDate, checkOutDate) => {
    const nights = daysBetween(checkInDate, checkOutDate);
    return {
        nights,
        formattedCheckIn: formatDate(checkInDate),
        formattedCheckOut: formatDate(checkOutDate)
    };
};
