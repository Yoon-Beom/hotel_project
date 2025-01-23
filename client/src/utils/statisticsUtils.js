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
    const dailyReservations = await contract.methods.getDailyReservationsForMonth(year, month, daysInMonth).call();
    // 배열을 객체로 변환
    const result = {};
    for (let i = 0; i < dailyReservations.length; i++) {
        result[i + 1] = parseInt(dailyReservations[i]);
    }

    for (let i = 2024; i <= 2026; i++) {
        for (let j = 1; j <= 12; j++) {
            const IndaysInMonth = new Date(year, month, 0).getDate();
            const IndailyReservations = await contract.methods.getDailyReservationsForMonth(i, j, IndaysInMonth).call();
            console.log(i + "년 " + j + "월 : ", IndailyReservations);
        }
    }

    return result;
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

    const hotelCount = await contract.methods.hotelCount().call();
    const reservationsByHotel = {};

    for (let hotelId = 1; hotelId <= hotelCount; hotelId++) {
        reservationsByHotel[hotelId] = {};
        for (let year = startYear; year <= currentYear; year++) {
            const count = await contract.methods.getHotelReservationsForDate(hotelId, year * 10000 + month * 100 + day).call();
            reservationsByHotel[hotelId][year] = parseInt(count);
        }
    }

    return reservationsByHotel;
};

