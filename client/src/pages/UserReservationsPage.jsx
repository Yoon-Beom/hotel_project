// pages/UserReservationsPage.jsx
import React, { useState, useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3';
import ReservationList from '../components/ReservationList';

const UserReservationsPage = () => {
    const { contract, account } = useWeb3();
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            if (!contract || !account) return;

            try {
                setIsLoading(true);
                // 사용자의 예약 ID 목록 가져오기
                const reservationIds = await contract.methods.getUserReservations().call({ from: account });
                
                // 예약 상세 정보 가져오기
                const reservationDetails = await contract.methods.getReservationsByIds(reservationIds).call();
                
                setReservations(reservationDetails);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to fetch reservations:", err);
                setError('예약 내역을 불러오는데 실패했습니다.');
                setIsLoading(false);
            }
        };

        fetchReservations();
    }, [contract, account]);

    const handleCancelReservation = async (reservationId) => {
        if (!contract || !account) return;

        try {
            await contract.methods.cancelReservation(reservationId).send({
                from: account,
                gas: 500000
            });
            
            // 예약 목록 새로고침
            const reservationIds = await contract.methods.getUserReservations().call({ from: account });
            const reservationDetails = await contract.methods.getReservationsByIds(reservationIds).call();
            setReservations(reservationDetails);
        } catch (err) {
            console.error("Failed to cancel reservation:", err);
            setError('예약 취소에 실패했습니다.');
        }
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div className="user-reservations-page">
            <h1>내 예약 내역</h1>
            {reservations.length === 0 ? (
                <p>예약 내역이 없습니다.</p>
            ) : (
                <ReservationList 
                    reservations={reservations}
                    onCancelReservation={handleCancelReservation}
                />
            )}
        </div>
    );
};

export default UserReservationsPage;
