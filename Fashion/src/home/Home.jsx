import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {FaHandPointLeft, FaHandPointRight } from 'react-icons/fa';

import './Home.css'; // CSS 파일 추가

const Home = () => {
  const navigate = useNavigate();

  const handleFirstSearchClick = () => {
    navigate('/trend-analysis', { state: { trend: 'first' } });
  };

  const handleSecondSearchClick = () => {
    navigate('/trend-analysis', { state: { trend: 'second' } });
  };

  return (
    <div className="home-container">
      <div className="home-text-container">
        <h1 className="home-title">역대 패션 트렌드를 확인해보세요!</h1>
        <p className="home-subtitle">유행하는, 혹은 유행했던 스타일을 한눈에 분석하고 트렌드를 선도하세요.</p>
      </div>

      <div className="home-search-box">
        <div className="icon-divider-container">
          <FontAwesomeIcon icon={faSearch} className="home-icon" />
          <div className="divider"></div>
        </div>
        <input
          type="text"
          placeholder="역대 트렌드 확인하러 가보기"
          onClick={() => navigate('/trends')}
          className="home-search-input"
          readOnly
        />
      </div>

      <div className="home-compare-container">
        <h1 className="compare-title">트렌드를 비교하고 싶으신가요?</h1>
        <p className="compare-subtitle">당신의 스타일에 딱 맞는 트렌드를 발견해 보세요.</p>
        <div className="compare-search-boxes">
          <div className="compare-search-box">
            <div className="icon-divider-container">
              <FontAwesomeIcon icon={faSearch} className="compare-icon" />
              <div className="divider"></div>
            </div>
            <input
              type="text"
              placeholder="첫 번째 트렌드"
              onClick={handleFirstSearchClick}
              className="compare-search-input"
            />
          </div>
          <span className="compare-vs" onClick={handleSecondSearchClick}>VS</span>
          <div className="compare-search-box">
            <div className="icon-divider-container">
              <FontAwesomeIcon icon={faSearch} className="compare-icon" />
              <div className="divider"></div>
            </div>
            <input
              type="text"
              placeholder="두 번째 트렌드"
              onClick={handleSecondSearchClick}
              className="compare-search-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
