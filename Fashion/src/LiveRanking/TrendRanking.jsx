import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router 사용
import PopularSearchWords from './PopularSearchWords';
import TrendShoppingSearch from "./TrendShoppingSearch";
import PopularSearchTrendsRanking from "./PopularSearchTrendsRanking";
import { FaSpinner } from 'react-icons/fa';
import './TrendRanking.css';

const TrendRanking = () => {
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    const [keywords, setKeywords] = useState([]); // 키워드 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const navigate = useNavigate(); // 페이지 이동 함수

    const fetchKeywords = async () => {
        try {
            setLoading(true);

            const response = await fetch('http://localhost:8080/keywords');
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }

            const data = await response.json();
            setKeywords(data); // 키워드 상태 업데이트

            // 첫 번째 키워드 자동 선택
            if (data.length > 0) {
                setSelectedKeyword(data[0].keyword);
            }
        } catch (err) {
            setError('데이터를 가져오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    const handleCrawlAndReload = async () => {
        try {
            setLoading(true);
            await fetch('http://localhost:8080/crawl'); // 크롤링 수행
            
        } catch (err) {
            setError('크롤링을 수행하는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeywords(); 
    }, []);

    const handleNavigate = () => {
        navigate('/trend-cloud'); // /trend-cloud로 이동
    };
    
    const handleKeywordSelect = (keyword) => {
        setSelectedKeyword(keyword);
    };

    return (
        <div className="Trend-ranking-whole">
            <h1 className="Trend-ranking-title">랭킹으로 보는 실시간 인기검색어</h1>
            <p className="Trend-ranking-subtitle">
                지금 가장 인기 있는 검색어와 그 트렌드를 확인하세요!
            </p>
            <div className="navigate-container">
                <p className="navigate-mention" onClick={handleNavigate}>
                    트렌드를 한 눈에 보고싶다면?
                </p>
            </div>
            {/* 크롤링 버튼 추가 */}
            <div className="ranking-crawl-button-container">
                <button onClick={handleCrawlAndReload} className="ranking-crawl-button">
                실시간 업데이트
                </button>
            </div>

            {loading ? (
                <div className="ranking-loading-container">
                    <FaSpinner className="ranking-loading-spinner" />
                    <p className="ranking-loading-message">인기 검색어를 불러오는 중입니다...</p>
                </div>
            ) : error ? (
                <div className="ranking-error-container">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="trend-ranking-container">
                    <div className="popular-search-section">
                        <PopularSearchWords 
                            keywords={keywords} 
                            onKeywordSelect={handleKeywordSelect} 
                        />
                        <div className="popular-trends-ranking">
                            <PopularSearchTrendsRanking selectedKeyword={selectedKeyword} />
                        </div>
                    </div>
                    <div className="trend-shopping-search">
                        <TrendShoppingSearch keyword={selectedKeyword} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrendRanking;
