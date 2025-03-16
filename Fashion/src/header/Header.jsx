import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { FaUserCircle } from 'react-icons/fa';
import Bubble from '../Bubble/Bubble';
import Login from '../Login/Login';
import axiosInstance from '../api/axiosConfig';

const Header = ({avatar}) => {
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); // 이름 저장
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const bubbleRef = useRef(null);
  const iconRef = useRef(null);

  const handleIconClick = () => {
    setIsBubbleVisible((prev) => !prev);
  };

  const handleLoginSubmit = (token) => {
    localStorage.setItem('token', token);
    fetchUserInfo(); // 로그인 성공 후 사용자 정보 가져오기
    setIsLoggedIn(true);
    setIsLoginVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setIsLoggedIn(false);
    setIsBubbleVisible(false);
  };

  const fetchUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance
        .get('/auth/user-info', {
          headers: { Authorization: `Bearer ${token}` }, // Authorization 헤더 추가
        })
        .then((response) => {
          setUsername(response.data.name || response.data.email); // 이름 설정
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }
  };

  useEffect(() => {
    fetchUserInfo(); // 초기 로드 시 사용자 정보 가져오기
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (bubbleRef.current && bubbleRef.current.contains(event.target)) ||
        (iconRef.current && iconRef.current.contains(event.target))
      ) {
        return;
      }
      setIsBubbleVisible(false);
    };

    if (isBubbleVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBubbleVisible]);

  return (
    <div className="header">
      <h1>{isLoggedIn ? `Welcome, ${username}님` : ''}</h1>
      <div
        className="header-right-image"
        ref={iconRef}
        onClick={handleIconClick}
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        {isLoggedIn ? (
          <img
            src={avatar}
            alt="User Avatar"
            className="header-avatar"
            style={{
              width: 45,
              height: 45,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <FaUserCircle size={40} color="#222222" />
        )}
        {isBubbleVisible && (
          <div ref={bubbleRef}>
            <Bubble
              avatar={avatar}
              username={username}
              isLoggedIn={isLoggedIn}
              onLogin={() => setIsLoginVisible(true)}
              onLogout={handleLogout}
            />
          </div>
        )}
      </div>
      {isLoginVisible && (
        <Login
          isVisible={isLoginVisible}
          onClose={() => setIsLoginVisible(false)}
          onSubmit={handleLoginSubmit}
        />
      )}
    </div>
  );
};

export default Header;
