import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandPointRight } from 'react-icons/fa'; // 손가락 화살표 아이콘 임포트
import './LiveRanking.css';

const LiveRanking = () => {
  return (
    <div className="live-ranking-container">
      {/* 글씨와 버튼을 하나의 그룹으로 묶음 */}
      <div className="float-group">
        <h1 className="live-ranking-title">실시간 트렌드 확인</h1>

        {/* 첫 번째 큰 버튼: 랭킹으로 보기 */}
        <Link to="/trend-ranking">
          <button
            className="ranking-button"
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
          >
            랭킹으로 보기
            <FaHandPointRight className="button-icon" />
          </button>
        </Link>

        {/* 두 번째 큰 버튼: 한 눈에 보기 */}
        <Link to="/trend-cloud">
          <button
            className="cloud-button"
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#007bb5')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#008CBA')}
          >
            한 눈에 보기
            <FaHandPointRight className="button-icon" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LiveRanking;
