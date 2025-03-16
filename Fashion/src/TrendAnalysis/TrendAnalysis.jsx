import React, { useState, useEffect } from 'react';
import './TrendAnalysis.css';
import { FaEye } from 'react-icons/fa';
import TwoComparison from './TwoComparison.jsx';
import GenderComparison from './GenderComparison.jsx';
import AgeTC from './AgeTC.jsx';

const TrendAnalysis = () => {
  const [trend1, setTrend1] = useState('');
  const [trend2, setTrend2] = useState('');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedMonth1, setSelectedMonth1] = useState('');
  const [selectedMonth2, setSelectedMonth2] = useState('');
  const [months, setMonths] = useState([]);

  // 현재 날짜를 기반으로 월 목록 생성
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // 1월부터 현재 달까지의 월 생성
    const monthList = Array.from({ length: currentMonth }, (_, index) => {
      const month = (index + 1).toString().padStart(2, '0'); // 월을 두 자리로 변환
      return `${currentYear}-${month}`;
    });

    setMonths(monthList);
    setSelectedMonth1(monthList[0]); // 초기 선택값 설정
    setSelectedMonth2(monthList[0]); // 초기 선택값 설정
  }, []);

  // const months = Array.from({ length: 12 }, (_, index) => `2024-${String(index + 1).padStart(2, '0')}`); //1월부터 12월까지 생성

  const handleKeyword1Change = (e) => {
    setInput1(e.target.value);
  };

  const handleKeyword2Change = (e) => {
    setInput2(e.target.value);
  };

  const handleClick = () => {
    if (!input1 || !input2) {
      setErrorMessage('두 트렌드를 모두 입력해주세요.');
      return;
    }
    setTrend1(input1);
    setTrend2(input2);
    setShowComparison(true);
    setErrorMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleMonthChange1 = (e) => {
    setSelectedMonth1(e.target.value);
  };

  const handleMonthChange2 = (e) => {
    setSelectedMonth2(e.target.value);
  };

  return (
    <div className="trend-analysis">
      <div className="left-panel">
        <div className="inputs">
          <input
            type="text"
            value={input1}
            onChange={handleKeyword1Change}
            onKeyDown={handleKeyPress}
            placeholder="트렌드가 보고싶은 첫번째 상품을 입력해주세요"
          />
          <input
            type="text"
            value={input2}
            onChange={handleKeyword2Change}
            onKeyDown={handleKeyPress}
            placeholder="트렌드가 보고싶은 두번째  상품을 입력해주세요"
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className="btn" onClick={handleClick}>
            트렌드 보기
          </button>
        </div>

        {showComparison && (
          <div className="comparison-container">
            <TwoComparison trend1={trend1} trend2={trend2} />
          </div>
        )}
      </div>

      {showComparison && (
        <div className="right-panel">
          <h2 style={{ fontSize: '30px' }}>
            <FaEye style={{ marginRight: '8px' }} />
            트렌드 상세히 보기
          </h2>

          {/* 트렌드1 - 달 선택 드롭다운 */}
          <div className="month-dropdown-container">
            <h3>{trend1}의 상세 트렌드</h3>
            <div className="month-dropdown">
              <label htmlFor="month-select1" style={{ fontWeight: 'bold', marginRight: '10px' }}>
                달 선택:
              </label>
              <select
                id="month-select1"
                value={selectedMonth1}
                onChange={handleMonthChange1}
                style={{ padding: '5px', fontSize: '16px', borderRadius: '5px' }}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month.slice(5)}월
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="trend1-comparison">
            <div className="comparison-row">
              <div className="gender-comparison-container">
                <GenderComparison trend={trend1} selectedMonth={selectedMonth1} />
              </div>
              <div className="age-comparison-container">
                <AgeTC keyword={trend1} selectedMonth={selectedMonth1} />
              </div>
            </div>
          </div>

          {/* 트렌드2 - 달 선택 드롭다운 */}
          <div className="month-dropdown-container">
            <h3>{trend2}의 상세 트렌드</h3>
            <div className="month-dropdown">
              <label htmlFor="month-select2" style={{ fontWeight: 'bold', marginRight: '10px' }}>
                달 선택:
              </label>
              <select
                id="month-select2"
                value={selectedMonth2}
                onChange={handleMonthChange2}
                style={{ padding: '5px', fontSize: '16px', borderRadius: '5px' }}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month.slice(5)}월
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="trend2-comparison">
            <div className="comparison-row">
              <div className="gender-comparison-container">
                <GenderComparison trend={trend2} selectedMonth={selectedMonth2} />
              </div>
              <div className="age-comparison-container">
                <AgeTC keyword={trend2} selectedMonth={selectedMonth2} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysis;
