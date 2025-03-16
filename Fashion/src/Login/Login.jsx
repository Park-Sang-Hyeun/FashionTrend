import React, { useState } from 'react';
import Swal from 'sweetalert2'; // SweetAlert2 가져오기
import { renderToString } from 'react-dom/server';
import { FaHandPointRight,FaThumbsUp } from 'react-icons/fa';
import './Login.css';

const Login = ({ isVisible, onClose, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: username, password }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "아이디와 비밀번호를 다시 한 번 확인해주세요.");
          return;
        }

        const data = await response.json();
        console.log("Received token:", data.token); // 디버깅용 로그

        const iconHTML = renderToString(<FaHandPointRight />);
        const thumbsUpIcon = renderToString(<FaThumbsUp />);
        
        // SweetAlert2로 성공 메시지 표시
        Swal.fire({
          title: '<strong>로그인 성공!</strong>', // HTML 사용 가능
          html: `환영합니다!`,
          icon: 'success',
          background: '#fefefe', // 팝업 배경색
          confirmButtonColor: '#007bff', // 확인 버튼 색상
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> 확인', // 버튼에 아이콘 추가
          footer: `<a href="/user-info">
            내 정보 보러가기 ${iconHTML} 
          </a>`,
          showClass: {
            popup: 'animate__animated animate__fadeInDown' // 팝업 애니메이션
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp' // 닫힘 애니메이션
          },
        });
        

        onSubmit(data.token); // 토큰 전달
        setUsername('');
        setPassword('');
        onClose();
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }
    } else {
      setErrorMessage('아이디와 비밀번호를 입력하세요.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className="login-button" onClick={handleSubmit}>로그인</button>
        </form>
        {errorMessage && <span className="error-message">{errorMessage}</span>}
      </div>
    </div>
  );
};

export default Login;
