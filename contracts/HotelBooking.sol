// HotelBooking.sol

/// @title: 컨트랙트의 제목
/// @author: 작성자
/// @notice: 함수나 컨트랙트가 무엇을 하는지 설명 (일반 사용자 대상)
/// @dev: 개발자를 위한 추가 세부사항
/// @param: 함수 매개변수 설명
/// @return: 반환값 설명
/// @inheritdoc: 상속된 함수의 문서를 상속

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title 호텔 예약 시스템 스마트 컨트랙트
/// @author Your Name
/// @notice 이 컨트랙트는 호텔 예약, 관리, 통계 기능을 제공합니다
contract HotelBooking {
    // =============================================================================
    // enum
    // =============================================================================
    /// @notice 객실의 현재 상태를 나타내는 열거형
    enum RoomStatus {
        Available,
        Booked,
        NeedsCleaning,
        Maintenance
    }

    /// @notice 특정 날짜의 객실 상태를 나타내는 열거형
    enum RoomDateStatus {
        Available, // 0: 이용 가능
        Booked, // 1: 예약됨
        Occupied, // 2: 사용 중
        CheckedOut, // 3: 체크아웃
        Cleaning // 4: 청소 중
    }

    // =============================================================================
    // 구조체
    // =============================================================================
    /// @notice 예약 정보를 저장하는 구조체
    /// @dev 예약의 모든 세부 정보를 포함합니다
    struct Reservation {
        uint64 id; // 예약 고유 번호
        address user; // 예약자의 이더리움 주소
        uint32 hotelId; // 호텔 고유 번호
        uint16 roomNumber; // 객실 번호
        uint32 checkInDate; // 체크인 날짜 (YYYYMMDD)
        uint32 checkOutDate; // 체크아웃 날짜 (YYYYMMDD)
        uint16 nightCount; // 숙박 일수
        uint8 status; // 예약 상태 (0: 취소, 1: 확정)
        uint256 amount; // 결제 금액 (Wei 단위)
        uint8 rating; // 평점 (1-5)
        string ipfsHash; // IPFS 해시 (추가 정보에 대한 참조)
    }

    /// @notice 객실 정보를 저장하는 구조체
    struct Room {
        uint16 roomNumber; // 객실 번호
        RoomStatus status; // 객실 상태
        uint128 price; // 1박 가격 (Wei 단위)
        string ipfsHash; // IPFS 해시 (객실 세부 정보 및 이미지)
    }

    /// @notice 호텔 정보를 저장하는 구조체
    struct Hotel {
        uint32 id; // 호텔 고유 번호
        string name; // 호텔 이름
        address manager; // 호텔 관리자 주소
        bool isActive; // 호텔 활성화 상태
        string ipfsHash; // IPFS 해시 (호텔 세부 정보 및 이미지)
    }

    // =============================================================================
    // 매핑
    // =============================================================================
    // 호텔 관련 매핑
    /// @notice 호텔 ID -> 호텔 정보
    mapping(uint32 => Hotel) public hotels;

    /// @notice 등록된 총 호텔 수
    uint32 public hotelCount;

    // 객실 관련 매핑
    /// @notice 호텔 ID -> (객실 번호 -> 객실 정보)
    mapping(uint32 => mapping(uint16 => Room)) public hotelRooms;

    /// @notice 호텔 ID -> 객실 번호 목록
    mapping(uint32 => uint16[]) public hotelRoomsList;

    /// @notice 호텔 ID -> (객실 번호 -> (날짜 (YYYYMMDD) -> 객실 상태))
    mapping(uint32 => mapping(uint16 => mapping(uint32 => RoomDateStatus)))
        public roomDateStatus;

    // 예약 관련 매핑
    /// @notice 예약 ID -> 예약 정보
    mapping(uint64 => Reservation) public reservations;

    /// @notice 사용자 주소 -> 예약 ID 목록
    mapping(address => uint64[]) private userReservations;

    // 예약 통계 관련 매핑
    /// @notice 호텔 ID -> (날짜 (YYYYMMDD) -> 예약 수)
    mapping(uint32 => mapping(uint32 => uint256)) public dateReservationCount;

    /// @notice 호텔 ID -> (날짜 (YYYYMM) -> 예약 수)
    mapping(uint32 => mapping(uint32 => uint256))
        public hotelMonthlyReservationCount;

    /// @notice 날짜 (YYYYMM) -> 호텔 총 예약 수
    mapping(uint32 => uint256) public monthlyTotalReservationCount;

    // =============================================================================
    // 이벤트
    // =============================================================================
    /// @notice 새로운 호텔이 추가될 때 발생하는 이벤트
    /// @param hotelId 추가된 호텔의 ID
    /// @param name 호텔 이름
    /// @param manager 호텔 관리자 주소
    event HotelAdded(
        uint32 indexed hotelId,
        string name,
        address indexed manager
    );

    /// @notice 새로운 객실이 추가될 때 발생하는 이벤트
    /// @param hotelId 객실이 추가된 호텔의 ID
    /// @param roomNumber 추가된 객실 번호
    event RoomAdded(uint32 indexed hotelId, uint16 roomNumber);

    /// @notice 새로운 예약이 생성될 때 발생하는 이벤트
    /// @param id 생성된 예약의 ID
    /// @param user 예약한 사용자의 주소
    /// @param hotelId 예약된 호텔의 ID
    event ReservationCreated(
        uint64 indexed id,
        address indexed user,
        uint32 indexed hotelId
    );

    /// @notice 예약이 취소될 때 발생하는 이벤트
    /// @param id 취소된 예약의 ID
    event ReservationCancelled(uint64 indexed id);

    /// @notice 객실 상태가 업데이트될 때 발생하는 이벤트
    /// @param hotelId 객실이 속한 호텔의 ID
    /// @param roomNumber 업데이트된 객실 번호
    /// @param status 새로운 객실 상태
    event RoomStatusUpdated(
        uint32 indexed hotelId,
        uint16 roomNumber,
        RoomStatus status
    );

    /// @notice 예약에 대한 평점이 부여될 때 발생하는 이벤트
    /// @param reservationId 평가된 예약의 ID
    /// @param rating 부여된 평점
    event ReservationRated(uint64 indexed reservationId, uint8 rating);

    // =============================================================================
    // 함수
    // =============================================================================
    // =============================================================================
    // 함수 : 호텔 관리
    // =============================================================================
    /// @notice 새로운 호텔을 등록하는 함수
    /// @param _name 호텔 이름
    /// @param _ipfsHash 호텔 정보가 저장된 IPFS 해시
    function addHotel(string memory _name, string memory _ipfsHash) public {
        hotelCount++;
        hotels[hotelCount] = Hotel(
            hotelCount,
            _name,
            msg.sender,
            true,
            _ipfsHash
        );
        emit HotelAdded(hotelCount, _name, msg.sender);
    }

    /// @notice 객실 상태를 수동으로 업데이트하는 함수 (호텔 관리자 전용)
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _newStatus 새로운 객실 상태
    function updateRoomStatus(
        uint32 _hotelId,
        uint16 _roomNumber,
        RoomStatus _newStatus
    ) public onlyHotelManager(_hotelId) {
        hotelRooms[_hotelId][_roomNumber].status = _newStatus;
        emit RoomStatusUpdated(_hotelId, _roomNumber, _newStatus);
    }

    // =============================================================================
    // 함수 : 객실 관리
    // =============================================================================
    /// @notice 호텔에 새로운 객실을 추가하는 함수
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _price 객실 가격 (Wei 단위)
    /// @param _ipfsHash 객실 정보가 저장된 IPFS 해시
    function addRoom(
        uint32 _hotelId,
        uint16 _roomNumber,
        uint128 _price,
        string calldata _ipfsHash
    ) public onlyHotelManager(_hotelId) {
        require(
            hotelRooms[_hotelId][_roomNumber].roomNumber == 0,
            "Room already exists"
        );
        hotelRooms[_hotelId][_roomNumber] = Room({
            roomNumber: _roomNumber,
            status: RoomStatus.Available,
            price: _price,
            ipfsHash: _ipfsHash
        });
        hotelRoomsList[_hotelId].push(_roomNumber);
        emit RoomAdded(_hotelId, _roomNumber);
    }

    /// @notice 특정 날짜에 객실이 예약 가능한지 확인하는 함수
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _date 확인할 날짜 (YYYYMMDD 형식)
    /// @return 예약 가능 여부
    function isDateAvailable(
        uint32 _hotelId,
        uint16 _roomNumber,
        uint32 _date
    ) public view returns (bool) {
        return
            roomDateStatus[_hotelId][_roomNumber][_date] ==
            RoomDateStatus.Available;
    }

    /// @notice 특정 기간에 대한 객실 예약 가능 여부 확인
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _dates 확인할 날짜들의 배열 (YYYYMMDD 형식)
    /// @return 예약 가능 여부
    function isRoomAvailable(
        uint32 _hotelId,
        uint16 _roomNumber,
        uint32[] memory _dates
    ) public view returns (bool) {
        require(_dates.length > 0, "Empty dates array");

        uint32 currentDate = uint32(block.timestamp / 86400 + 719528) *
            100 +
            uint32((block.timestamp / 86400 + 719528) % 100);
        require(_dates[0] >= currentDate, "Cannot book past dates");

        for (uint256 i = 0; i < _dates.length; i++) {
            if (!isDateAvailable(_hotelId, _roomNumber, _dates[i])) {
                return false;
            }
        }

        return true;
    }

    /// @notice 객실 상태 업데이트 함수
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _dates 업데이트할 날짜들의 배열 (YYYYMMDD 형식)
    /// @param _status 설정할 객실 상태
    function updateRoomDateStatus(
        uint32 _hotelId,
        uint16 _roomNumber,
        uint32[] memory _dates,
        RoomDateStatus _status
    ) internal {
        require(_dates.length > 0, "Empty dates array");

        for (uint256 i = 0; i < _dates.length; i++) {
            roomDateStatus[_hotelId][_roomNumber][_dates[i]] = _status;
        }
    }

    /// @notice 특정 호텔의 모든 방 번호를 조회하는 함수
    /// @param _hotelId 호텔 ID
    /// @return 해당 호텔의 모든 방 번호 배열
    function getHotelRooms(
        uint32 _hotelId
    ) public view returns (uint16[] memory) {
        return hotelRoomsList[_hotelId];
    }

    // =============================================================================
    // 함수 : 예약 관리
    // =============================================================================
    /// @notice 새로운 예약을 생성합니다.
    /// @dev 예약 생성 시 여러 검증 단계를 거치며, 예약 정보를 저장하고 관련 통계를 업데이트합니다.
    /// @param _hotelId 예약할 호텔의 ID
    /// @param _roomNumber 예약할 객실 번호
    /// @param _checkInDate 체크인 날짜 (YYYYMMDD 형식)
    /// @param _checkOutDate 체크아웃 날짜 (YYYYMMDD 형식)
    /// @param _nightCount 숙박 일수
    /// @param _ipfsHash 예약 추가 정보의 IPFS 해시
    function createReservation(
        uint32 _hotelId,
        uint16 _roomNumber,
        uint32 _checkInDate,
        uint32 _checkOutDate,
        uint16 _nightCount,
        string calldata _ipfsHash
    ) public payable {
        // 1. 기본 유효성 검사
        require(hotels[_hotelId].isActive, "Hotel is not active");
        require(_checkInDate < _checkOutDate, "Invalid date range");
        require(
            _checkOutDate - _checkInDate == _nightCount,
            "Night count mismatch"
        );

        uint32 currentDate = uint32(block.timestamp / 86400 + 719528) *
            100 +
            uint32((block.timestamp / 86400 + 719528) % 100);
        require(_checkInDate >= currentDate, "Cannot book past dates");
        require(
            _checkOutDate <= currentDate + 365,
            "Booking too far in advance"
        );

        // 2. 객실 상태 검사
        require(
            hotelRooms[_hotelId][_roomNumber].status == RoomStatus.Available,
            "Room is not available"
        );

        // 날짜 배열 생성
        uint32[] memory reservationDates = _generateDateArray(
            _checkInDate,
            _checkOutDate,
            _nightCount
        );

        // 객실 가용성 확인
        require(
            isRoomAvailable(_hotelId, _roomNumber, reservationDates),
            "Room is not available for these dates"
        );

        // 3. 지불 금액 검사 및 처리
        uint256 requiredAmount = calculatePrice(
            _hotelId,
            _roomNumber,
            _nightCount
        );
        require(msg.value >= requiredAmount, "Insufficient payment");

        // 4. 예약 ID 생성
        uint64 reservationId = uint64(_checkInDate) *
            1000000 +
            uint64(_hotelId) *
            1000 +
            uint64(dateReservationCount[_hotelId][_checkInDate] + 1);

        // 5. 새 예약 정보 저장
        reservations[reservationId] = Reservation({
            id: reservationId,
            user: msg.sender,
            hotelId: _hotelId,
            roomNumber: _roomNumber,
            checkInDate: _checkInDate,
            checkOutDate: _checkOutDate,
            nightCount: _nightCount,
            status: 1, // 확정 상태
            amount: requiredAmount,
            rating: 0,
            ipfsHash: _ipfsHash
        });

        // 6. 금액 처리 및 환불
        if (msg.value > requiredAmount) {
            payable(msg.sender).transfer(msg.value - requiredAmount);
        }

        // 7. 예약 통계 업데이트
        for (uint16 i = 0; i < _nightCount; i++) {
            uint32 date = reservationDates[i];
            dateReservationCount[_hotelId][date]++;
            uint32 yearMonth = date / 100;
            hotelMonthlyReservationCount[_hotelId][yearMonth]++;
            monthlyTotalReservationCount[yearMonth]++;
        }

        // 8. 객실 상태 업데이트
        updateRoomDateStatus(
            _hotelId,
            _roomNumber,
            reservationDates,
            RoomDateStatus.Booked
        );

        // 9. 사용자 예약 목록 업데이트
        userReservations[msg.sender].push(reservationId);

        // 10. 이벤트 발생
        emit ReservationCreated(reservationId, msg.sender, _hotelId);
    }

    /// @notice 예약을 취소하는 함수
    /// @param _reservationId 취소할 예약 ID
    function cancelReservation(uint64 _reservationId) public {
        // 1. 예약 정보 조회 및 유효성 검사
        Reservation storage reservation = reservations[_reservationId];
        require(reservation.user == msg.sender, "Not the reservation owner");
        require(reservation.status != 0, "Reservation already cancelled");

        // 2. 예약금 저장 (환불 전)
        uint256 refundAmount = reservation.amount;

        // 3. 예약 상태 업데이트
        reservation.status = 0; // 취소 상태로 변경

        // 4. 날짜 배열 생성
        uint32[] memory reservationDates = _generateDateArray(
            reservation.checkInDate,
            reservation.checkOutDate,
            reservation.nightCount
        );

        // 5. 예약 통계 업데이트
        for (uint16 i = 0; i < reservation.nightCount; i++) {
            uint32 date = reservationDates[i];
            dateReservationCount[reservation.hotelId][date]--;
            uint32 yearMonth = date / 100;
            hotelMonthlyReservationCount[reservation.hotelId][yearMonth]--;
            monthlyTotalReservationCount[yearMonth]--;
        }

        // 6. 객실 상태 업데이트
        updateRoomDateStatus(
            reservation.hotelId,
            reservation.roomNumber,
            reservationDates,
            RoomDateStatus.Available
        );

        // 7. 예약금 환불
        payable(msg.sender).transfer(refundAmount);

        // 8. 이벤트 발생
        emit ReservationCancelled(_reservationId);
    }

    /// @notice 예약에 대한 평점을 남기는 함수
    /// @param _reservationId 평가할 예약 ID
    /// @param _rating 평점 (1-5)
    function rateReservation(uint64 _reservationId, uint8 _rating) public {
        Reservation storage reservation = reservations[_reservationId];
        require(reservation.user == msg.sender, "Not the reservation owner");
        require(reservation.status == 1, "Reservation not confirmed");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        reservation.rating = _rating;
        emit ReservationRated(_reservationId, _rating);
    }

    // =============================================================================
    // 함수 : 예약 조회
    // =============================================================================
    /// @notice 사용자의 모든 예약 ID를 조회하는 함수
    /// @return 사용자의 예약 ID 배열
    function getUserReservations() public view returns (uint64[] memory) {
        return userReservations[msg.sender];
    }

    /// @notice 여러 예약 정보를 한 번에 조회하는 함수
    /// @param _reservationIds 조회할 예약 ID 배열
    /// @return 예약 정보 배열
    function getReservationsByIds(
        uint64[] calldata _reservationIds
    ) public view returns (Reservation[] memory) {
        Reservation[] memory userReservationList = new Reservation[](
            _reservationIds.length
        );
        for (uint16 i = 0; i < _reservationIds.length; i++) {
            userReservationList[i] = reservations[_reservationIds[i]];
        }
        return userReservationList;
    }

    /// @notice 예약 정보를 조회하는 함수
    /// @param _reservationId 조회할 예약 ID
    /// @return 예약 정보
    function getReservation(
        uint64 _reservationId
    ) public view returns (Reservation memory) {
        return reservations[_reservationId];
    }

    // =============================================================================
    // 함수 : 통계 및 보고
    // =============================================================================
    /// @notice 특정 년월에 대한 예약 수 조회 함수
    /// @param _yearMonth 조회할 년월 (YYYYMM 형식)
    /// @return 해당 월의 예약 수
    function getMonthlyReservationCount(
        uint32 _yearMonth
    ) public view returns (uint256) {
        return monthlyTotalReservationCount[_yearMonth];
    }

    /// @notice 특정 연도의 월별 예약 수를 출력하는 함수
    /// @param _year 조회할 연도 (YYYY 형식)
    /// @return 12개월의 예약 수 배열
    function getMonthlyReservationsForYear(
        uint16 _year
    ) public view returns (uint256[12] memory) {
        uint256[12] memory monthlyCounts;
        for (uint16 month = 1; month <= 12; month++) {
            uint32 yearMonth = (_year * 100) + month;
            monthlyCounts[month - 1] = monthlyTotalReservationCount[yearMonth];
        }
        return monthlyCounts;
    }

    /// @notice 호텔과 날짜를 입력 받아 3년 전부터 오늘 날짜까지의 예약 수를 출력하는 함수
    /// @param _hotelId 호텔 ID
    /// @param _date 기준 날짜 (YYYYMMDD 형식)
    /// @return 4년간의 예약 수 배열 (3년 전부터 현재까지)
    function getHotelReservationsForDate(
        uint32 _hotelId,
        uint32 _date
    ) public view returns (uint256[4] memory) {
        uint256[4] memory reservationCounts;
        uint32 year = _date / 10000;
        uint32 month = (_date % 10000) / 100;
        uint32 day = _date % 100;

        for (uint8 i = 0; i < 4; i++) {
            uint32 targetYear = year - 3 + i;
            uint32 targetDate = (targetYear * 10000) + (month * 100) + day;
            reservationCounts[i] = dateReservationCount[_hotelId][targetDate];
        }

        return reservationCounts;
    }

    /// @notice 특정 월의 일별 예약 수를 반환합니다. (모든 호텔 통합)
    /// @param _yearMonth 조회할 연월 (YYYYMM 형식)
    /// @param _endDay 조회할 마지막 일 (1-31)
    /// @return 해당 월의 일별 예약 수 배열
    function getDailyReservationsForMonth(
        uint32 _yearMonth,
        uint8 _endDay
    ) public view returns (uint256[] memory) {
        require(_endDay >= 1 && _endDay <= 31, "Invalid end day");
        uint256[] memory dailyReservations = new uint256[](_endDay);

        uint32 baseDate = _yearMonth * 100;

        for (uint8 day = 1; day <= _endDay; day++) {
            uint32 date = baseDate + day;
            uint256 reservationCount = 0;

            for (uint32 hotelId = 1; hotelId <= hotelCount; hotelId++) {
                reservationCount += dateReservationCount[hotelId][date];
            }

            dailyReservations[day - 1] = reservationCount;
        }

        return dailyReservations;
    }

    // =============================================================================
    // 함수 : 내부 유틸리티
    // =============================================================================
    /// @notice 예약 가격을 계산하는 함수
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _nightCount 숙박 일수
    /// @return 총 예약 가격
    function calculatePrice(
        uint32 _hotelId,
        uint16 _roomNumber,
        uint16 _nightCount
    ) internal view returns (uint256) {
        Room storage room = hotelRooms[_hotelId][_roomNumber];
        return room.price * _nightCount;
    }

    /// @notice 체크인 날짜부터 체크아웃 날짜까지의 모든 날짜를 배열로 반환하는 내부 함수
    /// @param _checkInDate 체크인 날짜 (YYYYMMDD 형식)
    /// @param _checkOutDate 체크아웃 날짜 (YYYYMMDD 형식)
    /// @param _nightCount 숙박 일수
    /// @return 해당 기간의 모든 날짜 배열 (YYYYMMDD 형식)
    function _generateDateArray(
        uint32 _checkInDate,
        uint32 _checkOutDate,
        uint16 _nightCount
    ) internal pure returns (uint32[] memory) {
        require(_checkOutDate > _checkInDate, "Invalid date range");
        require(
            _checkOutDate - _checkInDate == _nightCount,
            "Night count mismatch"
        );

        uint32[] memory dates = new uint32[](_nightCount);
        uint32 currentDate = _checkInDate;

        for (uint16 i = 0; i < _nightCount; i++) {
            dates[i] = currentDate;
            currentDate = _getNextDate(currentDate);
        }

        return dates;
    }

    /// @notice 주어진 날짜의 다음 날짜를 계산하는 내부 함수
    /// @param _date 현재 날짜 (YYYYMMDD 형식)
    /// @return 다음 날짜 (YYYYMMDD 형식)
    function _getNextDate(uint32 _date) internal pure returns (uint32) {
        uint32 year = _date / 10000;
        uint32 month = (_date % 10000) / 100;
        uint32 day = _date % 100;

        day++;

        if (day > _getDaysInMonth(year, month)) {
            day = 1;
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        }

        return year * 10000 + month * 100 + day;
    }

    /// @notice 주어진 년도와 월의 일수를 반환하는 내부 함수
    /// @param _year 년도
    /// @param _month 월
    /// @return 해당 월의 일수
    function _getDaysInMonth(
        uint32 _year,
        uint32 _month
    ) internal pure returns (uint32) {
        if (_month == 2) {
            return _isLeapYear(_year) ? 29 : 28;
        } else if (_month == 4 || _month == 6 || _month == 9 || _month == 11) {
            return 30;
        } else {
            return 31;
        }
    }

    /// @notice 주어진 년도가 윤년인지 확인하는 내부 함수
    /// @param _year 확인할 년도
    /// @return 윤년 여부
    function _isLeapYear(uint32 _year) internal pure returns (bool) {
        return (_year % 4 == 0 && _year % 100 != 0) || (_year % 400 == 0);
    }

    /// @notice 호텔 관리자만 접근 가능한 함수를 위한 modifier
    /// @param _hotelId 호텔 ID
    modifier onlyHotelManager(uint32 _hotelId) {
        require(
            hotels[_hotelId].manager == msg.sender,
            "Not the hotel manager"
        );
        _;
    }
}
