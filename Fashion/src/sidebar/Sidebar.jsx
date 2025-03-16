import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation 추가
import { FaChartLine, FaTrophy, FaNewspaper, FaSearch, FaTshirt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">
          <h2>Fashion</h2>
        </Link>
      </div>
      <ul>
        <li className={location.pathname === '/trends' ? 'active' : ''}>
          <Link to="/trends">
            <FaChartLine style={{ marginRight: '10px' }} /> Trend
          </Link>
        </li>
        <li className={location.pathname === '/trend-analysis' ? 'active' : ''}>
          <Link to="/trend-analysis">
            <FaSearch style={{ marginRight: '10px' }} /> 올해의 트렌드 분석
          </Link>
        </li>
        <li className={location.pathname === '/live-ranking' || location.pathname === '/trend-ranking' || location.pathname === '/trend-cloud' ? 'active' : ''}>
          <Link to="/live-ranking">
            <FaTrophy style={{ marginRight: '10px' }} /> 실시간 랭킹
          </Link>
        </li>
        <li className={location.pathname === '/brand' ? 'active' : ''}>
          <Link to="/brand">
            <FaTshirt style={{ marginRight: '10px' }} /> 인기 브랜드
          </Link>
        </li>
        <li className={location.pathname === '/news' ? 'active' : ''}>
          <Link to="/news">
            <FaNewspaper style={{ marginRight: '10px' }} /> 패션 뉴스
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
