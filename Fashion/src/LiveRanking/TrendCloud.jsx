import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router 사용
import PopularSearchTrends from './PopularSearchTrends'; 
import PopularSearchWordCloud from './PopularSearchWordCloud';
import TrendShoppingSearchCloud from "./TrendShoppingSearchCloud";
import { FaSpinner } from 'react-icons/fa';
import './TrendCloud.css';

const TrendCloud = () => {
    const [selectedKeyword, setSelectedKeyword] = useState(null); 
    const [keywords, setKeywords] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 페이지 이동 함수

    const fetchKeywords = async () => {
        try {
            setLoading(true);

            const response = await fetch('http://localhost:8080/keywords');
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }

            const data = await response.json();
            const top50Data = data.map((item) => ({
                text: item.keyword ?? '',
                value: item.idx,
            }));

            setKeywords(top50Data);
            if (top50Data.length > 0) {
                setSelectedKeyword(top50Data[0].text);
            }
        } catch (err) {
            setError('데이터를 가져오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
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
        navigate('/trend-ranking'); // /trend-ranking로 이동
    };
    const handleKeywordSelect = (keyword) => {
        setSelectedKeyword(keyword);
    };

    return (
        <div className="cloud-trend">
            <h1 className="cloud-header">한 눈에 보는 실시간 인기검색어</h1>
            <p className="cloud-subtitle">
                지금 사람들이 가장 많이 검색하는 키워드를 확인해보세요!
            </p>
            <div className="navigate-container">
                <p className="navigate-mention" onClick={handleNavigate}>
                    트렌드를 랭킹으로 보고싶다면?
                </p>
            </div>
            {/* 크롤링 버튼 추가 */}
            <div className="cloud-crawl-button-container" style={{top:'-50px'}}>
                <button onClick={handleCrawlAndReload} className="cloud-crawl-button">
                실시간 업데이트
                </button>
            </div>

            {loading ? (
                <div className="cloud-loading-container">
                    <FaSpinner className="cloud-loading-spinner" />
                    <p className="cloud-loading-message">인기 검색어를 불러오는 중입니다...</p>
                </div>
            ) : error ? (
                <div className="cloud-error-container">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="cloud-cards-container">
                    <div className="cloud-card">
                        <PopularSearchWordCloud 
                            keywords={keywords} 
                            onKeywordSelect={handleKeywordSelect} 
                        />
                    </div>
                    <div className="cloud-card">
                        <PopularSearchTrends selectedKeyword={selectedKeyword} />
                    </div>
                    <div className="cloud-card">
                        <TrendShoppingSearchCloud keyword={selectedKeyword} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrendCloud;
