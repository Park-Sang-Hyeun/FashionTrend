import React, { useState } from 'react';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import './PopularSearchWords.css';

const PopularSearchWords = ({ keywords, onKeywordSelect }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 현재 페이지의 키워드 가져오기
    const indexOfLastKeyword = currentPage * itemsPerPage;
    const indexOfFirstKeyword = indexOfLastKeyword - itemsPerPage;
    const currentKeywords = keywords.slice(indexOfFirstKeyword, indexOfLastKeyword);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(keywords.length / itemsPerPage);

    return (
        <div className="popular-search-words">
            <div className="ranking-header">
                <button className="arrow-button" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                    <FaAngleDoubleLeft size={15} />
                </button>
                <button className="arrow-button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <FaAngleLeft size={15} />
                </button>
                <h2>인기 검색어</h2>
                <button className="arrow-button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <FaAngleRight size={15} />
                </button>
                <button className="arrow-button" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                    <FaAngleDoubleRight size={15} />
                </button>
            </div>
            <ul>
                {currentKeywords.map((keyword) => (
                    <li key={keyword.idx} onClick={() => onKeywordSelect(keyword.keyword)} style={{ cursor: 'pointer' }}>
                        {keyword.idx}. {keyword.keyword}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopularSearchWords;
