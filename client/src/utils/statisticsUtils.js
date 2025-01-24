// client/src/utils/statisticsUtils.js

/**
 * 통계 관련 유틸리티 함수들
 * @module statisticsUtils
 */

// =============================================================================
// 월별 통계
// =============================================================================

/**
 * 최근 4년간 월별 예약 수를 가져옵니다. (모든 호텔 통합)
 * @async
 * @function getMonthlyReservations
 * @param {Object} contract - 스마트 컨트랙트 인스턴스
 * @returns {Promise<Object>} 월별 예약 수 객체
 */
export const getMonthlyReservations = async (contract) => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;
    const monthlyReservations = {};

    for (let year = startYear; year <= currentYear; year++) {
        const yearlyReservations = await contract.methods.getMonthlyReservationsForYear(year).call();
        monthlyReservations[year] = yearlyReservations.map(count => parseInt(count));
    }

    return monthlyReservations;
};

// =============================================================================
// 일별 통계
// =============================================================================

/**
 * 특정 월의 일별 예약 수를 가져옵니다. (모든 호텔 통합)
 * @async
 * @function getDailyReservations
 * @param {Object} contract - 스마트 컨트랙트 인스턴스
 * @param {number} year - 연도
 * @param {number} month - 월
 * @returns {Promise<Object>} 일별 예약 수 객체
 */
export const getDailyReservations = async (contract, year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyReservations = await contract.methods.getDailyReservationsForMonth(year, month, daysInMonth).call();
    
    // 배열을 객체로 변환
    const result = {};
    for (let i = 0; i < dailyReservations.length; i++) {
        result[i + 1] = parseInt(dailyReservations[i]);
    }

    return result;
};

// =============================================================================
// 호텔별 통계
// =============================================================================

/**
 * 특정 날짜의 연도별, 호텔별 예약 수를 가져옵니다.
 * @async
 * @function getReservationsByDate
 * @param {Object} contract - 스마트 컨트랙트 인스턴스
 * @param {number} date - 특정 날짜 (YYYYMMDD 형식)
 * @returns {Promise<Object>} 호텔별, 연도별 예약 수 객체
 */
export const getReservationsByDate = async (contract, date) => {
    const hotelCount = await contract.methods.hotelCount().call();
    const reservationsByHotel = {};

    for (let hotelId = 1; hotelId <= hotelCount; hotelId++) {
        const reservations = await contract.methods.getHotelReservationsForDate(hotelId, date).call();
        reservationsByHotel[hotelId] = reservations.map(count => parseInt(count));
    }

    return reservationsByHotel;
};
