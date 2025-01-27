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
 * @param {Object} _contract - 스마트 컨트랙트 인스턴스
 * @returns {Promise<Object>} 월별 예약 수 객체 (월 -> 년도 -> 예약수)
 */
export const getMonthlyReservations = async (_contract) => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3;
    const monthlyData = {};

    // 1~12월에 대한 객체 초기화
    for (let month = 1; month <= 12; month++) {
        monthlyData[month] = {};
    }

    // 각 연도의 데이터를 가져와서 월별로 재구성
    for (let year = startYear; year <= currentYear; year++) {
        const yearlyReservations = await _contract.methods.getMonthlyReservationsForYear(year).call();

        // 각 월의 데이터를 해당하는 월 객체에 추가
        yearlyReservations.forEach((count, monthIndex) => {
            monthlyData[monthIndex + 1][year] = parseInt(count);
        });
    }

    return monthlyData;
};


// =============================================================================
// 일별 통계
// =============================================================================

/**
 * 특정 월의 일별 예약 수를 가져옵니다. (모든 호텔 통합)
 * @async
 * @function getDailyReservations
 * @param {Object} _contract - 스마트 컨트랙트 인스턴스
 * @param {number} _year - 연도
 * @param {number} _month - 월
 * @returns {Promise<Object>} 일별 예약 수 객체
 */
export const getDailyReservations = async (_contract, _year, _month) => {
    const daysInMonth = new Date(_year, _month, 0).getDate();
    const yearmonth = _year * 100 + _month;
    const dailyReservations = await _contract.methods.getDailyReservationsForMonth(yearmonth, daysInMonth).call();

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
 * @param {Object} _contract - 스마트 컨트랙트 인스턴스
 * @param {number} _date - 특정 날짜 (YYYYMMDD 형식)
 * @returns {Promise<Object>} 호텔별, 연도별 예약 수 객체
 */
export const getReservationsByDate = async (_contract, _date) => {
    const hotelCount = await _contract.methods.hotelCount().call();
    const reservationsByHotel = {};

    for (let hotelId = 1; hotelId <= hotelCount; hotelId++) {
        const reservations = await _contract.methods.getHotelReservationsForDate(hotelId, _date).call();
        reservationsByHotel[hotelId] = reservations.map(count => parseInt(count));
    }

    return reservationsByHotel;
};
