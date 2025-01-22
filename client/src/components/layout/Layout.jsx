// client/src/componets/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../styles/components/layout/Layout.css';

/**
 * 레이아웃 컴포넌트
 * 네비게이션 바, 메인 콘텐츠, 푸터를 포함하는 전체 레이아웃을 구성합니다.
 *
 * @component
 * @param {Object} props - 컴포넌트 프로퍼티
 * @param {React.ReactNode} props.children - 레이아웃 내부에 렌더링될 자식 컴포넌트
 * @returns {JSX.Element} Layout 컴포넌트
 */
const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
