import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { HiOutlineChevronRight } from 'react-icons/hi';

const PopularSearchTrendsRanking = ({ selectedKeyword }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedKeyword) {
      fetchTrendData(selectedKeyword);
    }
  }, [selectedKeyword]);

  const fetchTrendData = async (keyword) => {
    setLoading(true);
    setError(null);

    const year = '2024';
    const gender = 'all';

    try {
      const response = await fetch('http://localhost:8080/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site: 'naver',
          keywords: [keyword],
          year: year,
          gender: gender,
        }),
      });

      if (!response.ok) {
        throw new Error('트렌드 데이터를 가져오는 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderGraph = () => {
    if (!results) return null;

    const data = JSON.parse(results[0]).results[0].data;

    if (!data || data.length === 0) {
      return <div>No data available</div>;
    }

    // Nivo 그래프에 맞게 데이터 구조 변경
    const chartData = [
      {
        id: selectedKeyword,
        data: data.map((item) => ({
          x: item.period,  // 기간을 x축 값으로 사용
          y: item.ratio,   // 비율을 y축 값으로 사용
        })),
      },
    ];

    return (
      <div style={{ height: '500px' ,marginBottom: '13px'}}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 70, right: 110, bottom: 70, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: '0',
            max: 'auto',
            stacked: false,
          }}
          curve="linear"
          axisBottom={{
            legendPosition: 'middle',
            legendOffset: 32,
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            format: (value) => `${value.substr(0, 7)}`,
            line: {
              stroke: '#175ffaa2',
              strokeWidth: 4,
            },
          }}
          axisLeft={{
            legendPosition: 'middle',
            legendOffset: -40,
            tickValues: 5,
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            line: {
              stroke: '#175ffaa2',
              strokeWidth: 4,
            },
          }}
          lineWidth={4}
          enableGridX={true}
          enableGridY={true}
          colors={['#175ffaa2']}
          enablePoints={true}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={4}
          pointBorderColor={{ from: 'serieColor' }}
          useMesh={true}
          crosshairType="none"
          animate={true}
          motionConfig="gentle"
          tooltip={({ point }) => (
            <div
              style={{
                background: '#222', // 사용자 정의 배경
                color: '#fff', // 텍스트 색상
                padding: '8px 12px', // 여백
                borderRadius: '4px', // 둥근 모서리
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', // 그림자
              }}
            >
              <strong>{point.data.xFormatted}</strong>: {point.data.yFormatted}
            </div>
          )}
        />
        
      </div>
    );
  };

  if (!selectedKeyword) {
    return null;  // selectedKeyword가 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div>
      <h2><HiOutlineChevronRight /> {selectedKeyword}의 올해 트렌드</h2>
      <div className="popular-search-trends">
        {error && <div className="error">{error}</div>}
        {renderGraph()}
      </div>
    </div>
  );
};

export default PopularSearchTrendsRanking;
