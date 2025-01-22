// client/src/utils/statisticsUtils.js
/**
 * 최근 3년간 월별 예약 수를 가져옵니다. (모든 호텔 통합)
 * @async
 * @function getMonthlyReservations
 * @param {Object} contract - 스마트 컨트랙트 인스턴스
 * @returns {Promise<Object>} 월별 예약 수 객체
 */
export const getMonthlyReservations = async (contract) => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    const monthlyReservations = {};

    for (let month = 1; month <= 12; month++) {
        monthlyReservations[month] = {};
        for (let year = startYear; year <= currentYear; year++) {
            const count = await contract.methods.getMonthlyReservationCount(year, month).call();
            monthlyReservations[month][year] = parseInt(count);
        }
    }

    return monthlyReservations;
};

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
    const dailyReservations = {};

    for (let day = 1; day <= daysInMonth; day++) {
        const count = await contract.methods.getHotelReservationsForDate(year, month, day).call();
        dailyReservations[day] = parseInt(count);
    }

    return dailyReservations;
};

/**
 * 특정 날짜의 연도별, 호텔별 예약 수를 가져옵니다.
 * @async
 * @function getReservationsByDate
 * @param {Object} contract - 스마트 컨트랙트 인스턴스
 * @param {Date} date - 특정 날짜
 * @returns {Promise<Object>} 호텔별, 연도별 예약 수 객체
 */
export const getReservationsByDate = async (contract, date) => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hotelIds = await contract.methods.getAllHotelIds().call();
    const reservationsByHotel = {};

    for (let hotelId of hotelIds) {
        reservationsByHotel[hotelId] = {};
        for (let year = startYear; year <= currentYear; year++) {
            const count = await contract.methods.getHotelReservationsForDate(year, month, day, hotelId).call();
            reservationsByHotel[hotelId][year] = parseInt(count);
        }
    }

    return reservationsByHotel;
};
