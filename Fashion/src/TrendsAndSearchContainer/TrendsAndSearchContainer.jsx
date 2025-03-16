import React from 'react';
import Trends from './Trends.jsx';
import ShoppingSearch from './ShoppingSearch.jsx';
import './TrendsAndSearchContainer.css'; // CSS 파일 임포트

const TrendsAndSearchContainer = ({ keyword, gender, handleCategoryChange, handleGenderChange }) => {
  return (
    <div className="trends-and-search-container">
      <div className="trends">
        <h2 className="section-title">트렌드 검색 분석</h2>
        <Trends 
          onCategoryChange={handleCategoryChange} 
          onGenderChange={handleGenderChange} 
        />
      </div>
      <div className="shopping-search">
        <h2 className="section-title">{keyword} 관련 인기 상품 TOP5</h2>
        <ShoppingSearch keyword={keyword} />
      </div>
    </div>
  );
};

export default TrendsAndSearchContainer;
