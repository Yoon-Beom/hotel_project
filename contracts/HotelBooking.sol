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

    /// @notice 예약 정보를 저장하는 구조체
    /// @dev 예약의 모든 세부 정보를 포함합니다
    struct Reservation {
        uint256 id; // 예약 고유 번호
        address user; // 예약자의 이더리움 주소
        uint256 hotelId; // 호텔 고유 번호
        uint256 roomNumber; // 객실 번호
        uint256 checkInDate; // 체크인 날짜 (Unix 타임스탬프)
        uint256 checkOutDate; // 체크아웃 날짜 (Unix 타임스탬프)
        uint8 status; // 예약 상태 (0: 취소, 1: 확정)
        uint256 amount; // 결제 금액 (Wei 단위)
        uint8 rating; // 평점 (1-5)
        string ipfsHash; // IPFS 해시 (추가 정보에 대한 참조)
    }

    /// @notice 객실 정보를 저장하는 구조체
    struct Room {
        uint256 roomNumber; // 객실 번호
        RoomStatus status; // 객실 상태
        uint256 price; // 1박 가격 (Wei 단위)
        string ipfsHash; // IPFS 해시 (객실 세부 정보 및 이미지)
    }

    /// @notice 호텔 정보를 저장하는 구조체
    struct Hotel {
        uint256 id; // 호텔 고유 번호
        string name; // 호텔 이름
        address manager; // 호텔 관리자 주소
        bool isActive; // 호텔 활성화 상태
        string ipfsHash; // IPFS 해시 (호텔 세부 정보 및 이미지)
    }

    /// @notice 예약 ID -> 예약 정보
    mapping(uint256 => Reservation) public reservations;

    /// @notice 사용자 주소 -> 예약 ID 목록
    mapping(address => uint256[]) private userReservations;

    /// @notice 호텔 ID -> 호텔 정보
    mapping(uint256 => Hotel) public hotels;

    /// @notice 호텔 ID -> (객실 번호 -> 객실 정보)
    mapping(uint256 => mapping(uint256 => Room)) public hotelRooms;

    /// @notice 호텔 ID -> (객실 번호 -> (날짜 -> 객실 상태))
    mapping(uint256 => mapping(uint256 => mapping(uint256 => RoomDateStatus)))
        public roomDateStatus;

    /// @notice 호텔 ID -> (날짜 -> 예약 수)
    mapping(uint256 => mapping(uint256 => uint256)) public dateReservationCount;

    /// @notice 년도 -> (월 -> 예약 수)
    mapping(uint256 => mapping(uint256 => uint256))
        public yearMonthReservationCount;

    /// @notice 년도 -> 총 예약 수
    mapping(uint256 => uint256) public yearTotalReservationCount;

    /// @notice 호텔 ID -> 객실 번호 목록
    mapping(uint256 => uint256[]) public hotelRoomsList;

    /// @notice 등록된 총 호텔 수
    uint256 public hotelCount;

    /// @notice 새로운 호텔이 추가될 때 발생하는 이벤트
    /// @param hotelId 추가된 호텔의 ID
    /// @param name 호텔 이름
    /// @param manager 호텔 관리자 주소
    event HotelAdded(uint256 indexed hotelId, string name, address manager);

    /// @notice 새로운 객실이 추가될 때 발생하는 이벤트
    /// @param hotelId 객실이 추가된 호텔의 ID
    /// @param roomNumber 추가된 객실 번호
    event RoomAdded(uint256 indexed hotelId, uint256 roomNumber);

    /// @notice 새로운 예약이 생성될 때 발생하는 이벤트
    /// @param id 생성된 예약의 ID
    /// @param user 예약한 사용자의 주소
    /// @param hotelId 예약된 호텔의 ID
    event ReservationCreated(
        uint256 indexed id,
        address indexed user,
        uint256 hotelId
    );

    /// @notice 예약이 취소될 때 발생하는 이벤트
    /// @param id 취소된 예약의 ID
    event ReservationCancelled(uint256 indexed id);

    /// @notice 객실 상태가 업데이트될 때 발생하는 이벤트
    /// @param hotelId 객실이 속한 호텔의 ID
    /// @param roomNumber 업데이트된 객실 번호
    /// @param status 새로운 객실 상태
    event RoomStatusUpdated(
        uint256 indexed hotelId,
        uint256 roomNumber,
        RoomStatus status
    );

    /// @notice 호텔 관리자만 접근 가능한 함수를 위한 modifier
    /// @param _hotelId 호텔 ID
    modifier onlyHotelManager(uint256 _hotelId) {
        require(
            hotels[_hotelId].manager == msg.sender,
            "Not the hotel manager"
        );
        _;
    }

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

    /// @notice 호텔에 새로운 객실을 추가하는 함수
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _price 객실 가격 (Wei 단위)
    /// @param _ipfsHash 객실 정보가 저장된 IPFS 해시
    function addRoom(
        uint256 _hotelId,
        uint256 _roomNumber,
        uint256 _price,
        string memory _ipfsHash
    ) public onlyHotelManager(_hotelId) {
        require(
            hotelRooms[_hotelId][_roomNumber].roomNumber == 0,
            "Room already exists"
        );
        hotelRooms[_hotelId][_roomNumber] = Room(
            _roomNumber,
            RoomStatus.Available,
            _price,
            _ipfsHash
        );
        hotelRoomsList[_hotelId].push(_roomNumber);
        emit RoomAdded(_hotelId, _roomNumber);
    }

    /// @notice 특정 날짜에 객실이 예약 가능한지 확인하는 함수
    /// @param hotelId 호텔 ID
    /// @param roomNumber 객실 번호
    /// @param date 확인할 날짜
    /// @return 예약 가능 여부
    function isDateAvailable(
        uint256 hotelId,
        uint256 roomNumber,
        uint256 date
    ) public view returns (bool) {
        RoomDateStatus status = roomDateStatus[hotelId][roomNumber][date];
        return status == RoomDateStatus.Available;
    }

    /// @notice 특정 기간에 대한 객실 예약 가능 여부 확인
    /// @param hotelId 호텔 ID
    /// @param roomNumber 객실 번호
    /// @param checkInDate 체크인 날짜
    /// @param checkOutDate 체크아웃 날짜
    /// @return 예약 가능 여부
    function isRoomAvailable(
        uint256 hotelId,
        uint256 roomNumber,
        uint256 checkInDate,
        uint256 checkOutDate
    ) public view returns (bool) {
        // 체크인 날짜가 체크아웃 날짜보다 이후인 경우
        require(checkInDate < checkOutDate, "Invalid date range");

        // 현재 시간보다 이전 날짜인 경우
        require(checkInDate >= block.timestamp, "Cannot book past dates");

        // 체크인부터 체크아웃 전날까지 모든 날짜 확인
        for (uint256 date = checkInDate; date < checkOutDate; date += 1 days) {
            if (!isDateAvailable(hotelId, roomNumber, date)) {
                return false;
            }
        }

        return true;
    }

    /// @notice 객실 상태 업데이트 함수
    /// @param hotelId 호텔 ID
    /// @param roomNumber 객실 번호
    /// @param startDate 시작 날짜
    /// @param endDate 종료 날짜
    /// @param status 설정할 객실 상태
    function updateRoomDateStatus(
        uint256 hotelId,
        uint256 roomNumber,
        uint256 startDate,
        uint256 endDate,
        RoomDateStatus status
    ) internal {
        for (uint256 date = startDate; date < endDate; date += 1 days) {
            roomDateStatus[hotelId][roomNumber][date] = status;
        }
    }

    /// @notice 새로운 예약을 생성하는 함수
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _checkInDate 체크인 날짜
    /// @param _checkOutDate 체크아웃 날짜
    /// @param _ipfsHash 예약 추가 정보가 저장된 IPFS 해시
    function createReservation(
        uint256 _hotelId,
        uint256 _roomNumber,
        uint256 _checkInDate,
        uint256 _checkOutDate,
        string memory _ipfsHash
    ) public payable {
        // 1. 기본 유효성 검사
        require(hotels[_hotelId].isActive, "Hotel is not active");
        require(_checkInDate < _checkOutDate, "Invalid date range");
        require(_checkInDate >= block.timestamp, "Cannot book past dates");
        require(
            _checkOutDate <= block.timestamp + 365 days,
            "Booking too far in advance"
        );

        // 2. 객실 상태 검사
        require(
            hotelRooms[_hotelId][_roomNumber].status == RoomStatus.Available,
            "Room is not available"
        );
        require(
            isRoomAvailable(_hotelId, _roomNumber, _checkInDate, _checkOutDate),
            "Room is not available for these dates"
        );

        // 3. 지불 금액 검사 및 처리
        uint256 requiredAmount = calculatePrice(
            _hotelId,
            _roomNumber,
            _checkInDate,
            _checkOutDate
        );
        require(
            msg.value >= requiredAmount,
            "Insufficient payment: Please send the exact amount"
        );

        // 4. 예약 ID 생성
        uint256 dailyReservationCount = dateReservationCount[_hotelId][
            _checkInDate
        ] + 1;
        uint256 reservationId = (_checkInDate * 1000000000) +
            (_hotelId * 1000) +
            dailyReservationCount;

        // 5. 새 예약 정보 저장
        Reservation storage newReservation = reservations[reservationId];
        newReservation.id = reservationId;
        newReservation.user = msg.sender;
        newReservation.hotelId = _hotelId;
        newReservation.roomNumber = _roomNumber;
        newReservation.checkInDate = _checkInDate;
        newReservation.checkOutDate = _checkOutDate;
        newReservation.status = 1; // 확정 상태
        newReservation.ipfsHash = _ipfsHash;

        // 6. 금액 처리 및 환불
        if (msg.value > requiredAmount) {
            payable(msg.sender).transfer(msg.value - requiredAmount);
            newReservation.amount = requiredAmount;
        } else {
            newReservation.amount = msg.value;
        }

        // 7. 예약 통계 업데이트
        for (
            uint256 date = _checkInDate;
            date < _checkOutDate;
            date += 1 days
        ) {
            dateReservationCount[_hotelId][date]++;

            uint256 year = (date / 365 days) + 1970;
            uint256 month = ((date % 365 days) / 30 days) + 1;

            yearMonthReservationCount[year][month]++;
            yearTotalReservationCount[year]++;
        }

        // 8. 객실 상태 업데이트
        updateRoomDateStatus(
            _hotelId,
            _roomNumber,
            _checkInDate,
            _checkOutDate,
            RoomDateStatus.Booked
        );

        // 9. 사용자 예약 목록 업데이트
        userReservations[msg.sender].push(reservationId);

        // 10. 이벤트 발생
        emit ReservationCreated(reservationId, msg.sender, _hotelId);
    }

    /// @notice 예약을 취소하는 함수
    /// @param _reservationId 취소할 예약 ID
    function cancelReservation(uint256 _reservationId) public {
        // 1. 예약 정보 조회 및 유효성 검사
        Reservation storage reservation = reservations[_reservationId];
        require(reservation.user == msg.sender, "Not the reservation owner");
        require(reservation.status != 0, "Reservation already cancelled");

        // 2. 예약금 저장 (환불 전)
        uint256 refundAmount = reservation.amount;

        // 3. 예약 상태 업데이트
        reservation.status = 0; // 취소 상태로 변경

        // 4. 예약 통계 업데이트
        for (
            uint256 date = reservation.checkInDate;
            date < reservation.checkOutDate;
            date += 1 days
        ) {
            dateReservationCount[reservation.hotelId][date]--;

            uint256 year = (date / 365 days) + 1970;
            uint256 month = ((date % 365 days) / 30 days) + 1;

            yearMonthReservationCount[year][month]--;
            yearTotalReservationCount[year]--;
        }

        // 5. 객실 상태 업데이트
        updateRoomDateStatus(
            reservation.hotelId,
            reservation.roomNumber,
            reservation.checkInDate,
            reservation.checkOutDate,
            RoomDateStatus.Available
        );

        // 6. 예약금 환불
        payable(msg.sender).transfer(refundAmount);

        // 7. 이벤트 발생
        emit ReservationCancelled(_reservationId);
    }

    /// @notice 사용자의 모든 예약 ID를 조회하는 함수
    /// @return 사용자의 예약 ID 배열
    function getUserReservations() public view returns (uint256[] memory) {
        return userReservations[msg.sender];
    }

    /// @notice 여러 예약 정보를 한 번에 조회하는 함수
    /// @param reservationIds 조회할 예약 ID 배열
    /// @return 예약 정보 배열
    function getReservationsByIds(
        uint256[] memory reservationIds
    ) public view returns (Reservation[] memory) {
        Reservation[] memory userReservationList = new Reservation[](
            reservationIds.length
        );
        for (uint i = 0; i < reservationIds.length; i++) {
            userReservationList[i] = reservations[reservationIds[i]];
        }
        return userReservationList;
    }

    /// @notice 예약에 대한 평점을 남기는 함수
    /// @param _reservationId 평가할 예약 ID
    /// @param _rating 평점 (1-5)
    function rateReservation(uint256 _reservationId, uint8 _rating) public {
        Reservation storage reservation = reservations[_reservationId];
        require(reservation.user == msg.sender, "Not the reservation owner");
        require(reservation.status == 1, "Reservation not confirmed");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        reservation.rating = _rating;
    }

    /// @notice 객실 상태를 수동으로 업데이트하는 함수 (호텔 관리자 전용)
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _newStatus 새로운 객실 상태
    function updateRoomStatus(
        uint256 _hotelId,
        uint256 _roomNumber,
        RoomStatus _newStatus
    ) public onlyHotelManager(_hotelId) {
        hotelRooms[_hotelId][_roomNumber].status = _newStatus;
        emit RoomStatusUpdated(_hotelId, _roomNumber, _newStatus);
    }

    /// @notice 예약 정보를 조회하는 함수
    /// @param _reservationId 조회할 예약 ID
    /// @return 예약 정보
    function getReservation(
        uint256 _reservationId
    ) public view returns (Reservation memory) {
        return reservations[_reservationId];
    }

    /// @notice 특정 년도와 월에 대한 예약 수 조회 함수
    /// @param _year 조회할 연도
    /// @param _month 조회할 월
    /// @return 해당 월의 예약 수
    function getMonthlyReservationCount(
        uint256 _year,
        uint256 _month
    ) public view returns (uint256) {
        return yearMonthReservationCount[_year][_month];
    }

    /// @notice 특정 년도에 대한 총 예약 수 조회 함수
    /// @param _year 조회할 연도
    /// @return 해당 연도의 총 예약 수
    function getTotalReservationsForYear(
        uint256 _year
    ) public view returns (uint256) {
        return yearTotalReservationCount[_year];
    }

    /// @notice 특정 연도의 월별 예약 수를 출력하는 함수
    /// @param _year 조회할 연도
    /// @return 12개월의 예약 수 배열
    function getMonthlyReservationsForYear(
        uint256 _year
    ) public view returns (uint256[] memory) {
        uint256[] memory monthlyCounts = new uint256[](12);

        for (uint256 month = 1; month <= 12; month++) {
            monthlyCounts[month - 1] = yearMonthReservationCount[_year][month];
        }

        return monthlyCounts;
    }

    /// @notice 특정 호텔의 모든 방 번호를 조회하는 함수
    /// @param _hotelId 호텔 ID
    /// @return 해당 호텔의 모든 방 번호 배열
    function getHotelRooms(
        uint256 _hotelId
    ) public view returns (uint256[] memory) {
        return hotelRoomsList[_hotelId];
    }

    /// @notice 예약 가격을 계산하는 내부 함수
    /// @param _hotelId 호텔 ID
    /// @param _roomNumber 객실 번호
    /// @param _checkInDate 체크인 날짜
    /// @param _checkOutDate 체크아웃 날짜
    /// @return 계산된 예약 가격
    function calculatePrice(
        uint256 _hotelId,
        uint256 _roomNumber,
        uint256 _checkInDate,
        uint256 _checkOutDate
    ) internal view returns (uint256) {
        uint256 numberOfDays = (_checkOutDate - _checkInDate) / 1 days;
        return hotelRooms[_hotelId][_roomNumber].price * numberOfDays;
    }

    /// @notice 호텔과 날짜를 입력 받아 3년 전부터 오늘 날짜까지의 예약 수를 출력하는 함수
    /// @param _hotelId 호텔 ID
    /// @param _date 기준 날짜 (YYYYMMDD 형식)
    /// @return 4년간의 예약 수 배열 (3년 전부터 현재까지)
    function getHotelReservationsForDate(
        uint256 _hotelId,
        uint256 _date
    ) public view returns (uint256[4] memory) {
        uint256[4] memory reservationCounts;
        uint256 year = _date / 10000;
        uint256 month = (_date % 10000) / 100;
        uint256 day = _date % 100;

        for (uint256 i = 0; i < 4; i++) {
            uint256 targetYear = year - 3 + i;
            uint256 targetDate = (targetYear * 10000) + (month * 100) + day;
            reservationCounts[i] = dateReservationCount[_hotelId][targetDate];
        }

        return reservationCounts;
    }

    /// @notice 특정 월의 일별 예약 수를 반환합니다. (모든 호텔 통합)
    /// @param year 조회할 연도
    /// @param month 조회할 월
    /// @param endDay 조회할 마지막 일 (1-31)
    /// @return 해당 월의 일별 예약 수 배열
    function getDailyReservationsForMonth(
        uint256 year,
        uint256 month,
        uint256 endDay
    ) public view returns (uint256[] memory) {
        require(endDay >= 1 && endDay <= 31, "Invalid end day");
        uint256[] memory dailyReservations = new uint256[](endDay);

        for (uint256 day = 1; day <= endDay; day++) {
            uint256 date = (year * 10000) + (month * 100) + day;
            uint256 reservationCount = 0;

            for (uint256 hotelId = 1; hotelId <= hotelCount; hotelId++) {
                reservationCount += dateReservationCount[hotelId][date];
            }

            dailyReservations[day - 1] = reservationCount;
        }

        return dailyReservations;
    }
}
