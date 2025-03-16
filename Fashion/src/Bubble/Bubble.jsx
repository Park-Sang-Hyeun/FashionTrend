import React from 'react';
import '../Bubble/Bubble.css'; // 별도의 CSS 파일
import { useNavigate, useLocation } from 'react-router-dom'; // React Router 사용
import { FaUserCircle } from 'react-icons/fa';

const Bubble = ({ avatar,username,isLoggedIn, onLogin, onLogout }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation(); // 현재 경로 확인

  const handleRegister = () => {
    navigate('/register'); // 회원가입 페이지로 이동
  };

  const handleUserInfo = () => {
    navigate('/user-info'); // 내 정보 페이지로 이동
  };

  const handleWishlist = () => navigate('/wishlist');
  const handleFavoriteNews = () => navigate('/favorite-news');

  const handleLogout = () => {
    onLogout(); // 상위에서 전달받은 로그아웃 함수 실행
    if (location.pathname === '/user-info'||location.pathname === '/wishlist'||location.pathname === '/favorite-news') {
      navigate('/'); // 현재 경로가 /user-info라면 홈 화면으로 이동
    }
  };

return (
  <div className="bubble">
    {isLoggedIn ? (
      <>
        {/* 사용자 아바타 */}
        <img
          src={avatar}
          alt="User Avatar"
          onClick={handleUserInfo}
          className="header-avatar"
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '-30px',
            marginTop: '10px',
          }}
        />
        {/* 사용자 이름 */}
        <p className="bubble-username" style={{ fontWeight: 'bold' }}>
          {username}님
        </p>
        {/* 메뉴 항목 */}
        <div className="bubble-menu">
          <div
            className="bubble-item"
            onClick={handleUserInfo}
          >
            <span>내 정보 보기</span>
          </div>
          <div
            className="bubble-item"
            onClick={handleWishlist}
          >
            <span>찜한 상품</span>
          </div>
          <div
            className="bubble-item"
            onClick={handleFavoriteNews}
          >
            <span>관심 뉴스</span>
          </div>
          <div
            className="bubble-item"
            onClick={handleLogout}
          >
            <span>로그아웃하기</span>
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="bubble-menu">
          <div
            className="bubble-item-loggout-top"
            onClick={handleRegister}
          >
            <span>회원가입하기</span>
          </div>
          <div
            className="bubble-item"
            onClick={onLogin}
          >
            <span>로그인하기</span>
          </div>
        </div>
      </>
    )}
  </div>
);

};

export default Bubble;
