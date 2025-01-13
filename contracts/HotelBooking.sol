// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelBooking {
    // 객실 상태를 나타내는 열거형
    enum RoomStatus {
        Available,
        Booked,
        NeedsCleaning,
        Maintenance
    }

    // 예약 정보를 저장하는 구조체
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

    // 객실 정보를 저장하는 구조체
    struct Room {
        uint256 roomNumber; // 객실 번호
        RoomStatus status; // 객실 상태
        uint256 price; // 1박 가격 (Wei 단위)
    }

    // 호텔 정보를 저장하는 구조체
    struct Hotel {
        uint256 id; // 호텔 고유 번호
        string name; // 호텔 이름
        address manager; // 호텔 관리자 주소
        bool isActive; // 호텔 활성화 상태
    }

    // 상태 변수들
    mapping(uint256 => Reservation) public reservations; // 예약 ID => 예약 정보
    mapping(uint256 => Hotel) public hotels; // 호텔 ID => 호텔 정보
    mapping(uint256 => mapping(uint256 => Room)) public hotelRooms; // 호텔 ID => 객실 번호 => 객실 정보
    mapping(uint256 => uint256[]) public hotelRoomsList; // 호텔 ID => 방 번호 목록
    mapping(uint256 => mapping(uint256 => uint256)) public dateReservationCount; // 호텔 ID => 날짜 => 예약 수
    uint256 public reservationCount; // 총 예약 수
    uint256 public hotelCount; // 총 호텔 수

    // 이벤트 정의
    event HotelAdded(uint256 indexed hotelId, string name, address manager);
    event RoomAdded(uint256 indexed hotelId, uint256 roomNumber, uint256 price);
    event ReservationCreated(
        uint256 indexed id,
        address indexed user,
        uint256 hotelId
    );
    event ReservationCancelled(uint256 indexed id);
    event RoomStatusUpdated(
        uint256 indexed hotelId,
        uint256 roomNumber,
        RoomStatus status
    );

    // 호텔 관리자만 접근 가능한 함수를 위한 modifier
    modifier onlyHotelManager(uint256 _hotelId) {
        require(
            hotels[_hotelId].manager == msg.sender,
            "Not the hotel manager"
        );
        _;
    }

    // 새로운 호텔을 등록하는 함수
    function addHotel(string memory _name) public {
        hotelCount++;
        hotels[hotelCount] = Hotel(hotelCount, _name, msg.sender, true);
        emit HotelAdded(hotelCount, _name, msg.sender);
    }

    // 호텔에 새로운 객실을 추가하는 함수
    function addRoom(
        uint256 _hotelId,
        uint256 _roomNumber,
        uint256 _price
    ) public onlyHotelManager(_hotelId) {
        require(
            hotelRooms[_hotelId][_roomNumber].roomNumber == 0,
            "Room already exists"
        );
        // 객실 정보 등록
        hotelRooms[_hotelId][_roomNumber] = Room(
            _roomNumber,
            RoomStatus.Available,
            _price
        );
        // 호텔의 방 목록에 추가
        hotelRoomsList[_hotelId].push(_roomNumber);
        emit RoomAdded(_hotelId, _roomNumber, _price);
    }

    // 특정 호텔의 모든 방 번호를 조회하는 함수
    function getHotelRooms(uint256 _hotelId)
        public
        view
        returns (uint256[] memory)
    {
        return hotelRoomsList[_hotelId];
    }

    // 새로운 예약을 생성하는 함수
    function createReservation(
        uint256 _hotelId,
        uint256 _roomNumber,
        uint256 _checkInDate,
        uint256 _checkOutDate,
        string memory _ipfsHash
    ) public payable {
        // 유효성 검사
        require(hotels[_hotelId].isActive, "Hotel is not active");
        require(
            hotelRooms[_hotelId][_roomNumber].status == RoomStatus.Available,
            "Room is not available"
        );
        require(_checkInDate < _checkOutDate, "Invalid date range");
        require(
            msg.value >=
                calculatePrice(
                    _hotelId,
                    _roomNumber,
                    _checkInDate,
                    _checkOutDate
                ),
            "Insufficient payment"
        );

        // 예약 ID 생성
        uint256 dailyReservationCount = dateReservationCount[_hotelId][
            _checkInDate
        ] + 1;
        uint256 reservationId = (_checkInDate * 1000000000) +
            (_hotelId * 1000) +
            dailyReservationCount;

        // 새 예약 생성
        Reservation storage newReservation = reservations[reservationId];
        newReservation.id = reservationId;
        newReservation.user = msg.sender;
        newReservation.hotelId = _hotelId;
        newReservation.roomNumber = _roomNumber;
        newReservation.checkInDate = _checkInDate;
        newReservation.checkOutDate = _checkOutDate;
        newReservation.status = 1; // 확정 상태
        newReservation.amount = msg.value;
        newReservation.ipfsHash = _ipfsHash;

        // 날짜별 예약 카운트 증가
        for (
            uint256 date = _checkInDate;
            date < _checkOutDate;
            date += 1 days
        ) {
            dateReservationCount[_hotelId][date]++;
        }

        // 객실 상태 업데이트
        hotelRooms[_hotelId][_roomNumber].status = RoomStatus.Booked;

        // 이벤트 발생
        emit ReservationCreated(reservationId, msg.sender, _hotelId);
    }

    // 예약을 취소하는 함수
    function cancelReservation(uint256 _reservationId) public {
        Reservation storage reservation = reservations[_reservationId];
        require(reservation.user == msg.sender, "Not the reservation owner");
        require(reservation.status != 0, "Reservation already cancelled");

        reservation.status = 0; // 취소 상태로 변경

        // 날짜별 예약 카운트 감소
        for (
            uint256 date = reservation.checkInDate;
            date < reservation.checkOutDate;
            date += 1 days
        ) {
            dateReservationCount[reservation.hotelId][date]--;
        }

        hotelRooms[reservation.hotelId][reservation.roomNumber]
            .status = RoomStatus.Available;

        // 환불 처리 (실제 구현 시 더 복잡할 수 있음)
        payable(msg.sender).transfer(reservation.amount);

        emit ReservationCancelled(_reservationId);
    }

    // 예약에 대한 평점을 남기는 함수
    function rateReservation(uint256 _reservationId, uint8 _rating) public {
        Reservation storage reservation = reservations[_reservationId];
        require(reservation.user == msg.sender, "Not the reservation owner");
        require(reservation.status == 1, "Reservation not confirmed");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        reservation.rating = _rating;
    }

    // 객실 상태를 수동으로 업데이트하는 함수 (호텔 관리자 전용)
    function updateRoomStatus(
        uint256 _hotelId,
        uint256 _roomNumber,
        RoomStatus _newStatus
    ) public onlyHotelManager(_hotelId) {
        hotelRooms[_hotelId][_roomNumber].status = _newStatus;
        emit RoomStatusUpdated(_hotelId, _roomNumber, _newStatus);
    }

    // 예약 정보를 조회하는 함수
    function getReservation(uint256 _reservationId)
        public
        view
        returns (Reservation memory)
    {
        return reservations[_reservationId];
    }

    // 특정 날짜의 예약 수를 조회하는 함수
    function getReservationCountForDate(uint256 _hotelId, uint256 _date)
        public
        view
        returns (uint256)
    {
        return dateReservationCount[_hotelId][_date];
    }

    // 예약 가격을 계산하는 내부 함수
    function calculatePrice(
        uint256 _hotelId,
        uint256 _roomNumber,
        uint256 _checkInDate,
        uint256 _checkOutDate
    ) internal view returns (uint256) {
        uint256 numberOfDays = (_checkOutDate - _checkInDate) / 1 days;
        return hotelRooms[_hotelId][_roomNumber].price * numberOfDays;
    }
}
