import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { HiOutlineChevronRight } from 'react-icons/hi';

const PopularSearchTrends = ({ selectedKeyword }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // selectedKeyword가 변경될 때마다 트렌드 데이터 가져오기
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
          x: item.period, // 기간을 x축 값으로 사용
          y: item.ratio, // 비율을 y축 값으로 사용
        })),
      },
    ];

    return (
      <div style={{ height: '500px', marginBottom: '100px', width: '95%' }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: '0', max: 'auto' }}
          axisBottom={{
            tickRotation: -45,
            legend: undefined,
            legendOffset: 50,
            ticks: null,
            format: (value) => `${value.substr(0, 7)}`,
          }}
          axisLeft={{
            legend: undefined,
            legendOffset: -40,
            ticks: null,
            tickValues: 5,
          }}
          enablePoints={true}
          pointSize={8} // 포인트 크기를 더 크게 설정
          pointBorderWidth={2} // 포인트의 테두리를 추가하여 강조
          pointBorderColor="#fff" // 포인트 테두리 색상
          useMesh={true}
          crosshairType="none"
          lineWidth={4} // 선의 두께를 약간 더 굵게 설정
          colors={['#3498db']} // 선의 색상 설정
          curve="monotoneX" // 부드러운 곡선
          enableArea={false} // 채우기 효과 비활성화
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: 'transparent', // 축의 선을 투명하게 설정
                },
              },
            },
            legends: {
              text: {
                fill: 'transparent', // 레전드 텍스트를 투명하게 설정
              },
            },
            tooltip: {
              container: {
                background: '#333', // 툴팁 배경색 (어두운 회색)
                color: '#fff', // 툴팁 텍스트 색상 (흰색)
                fontSize: '14px', // 툴팁 텍스트 크기
                borderRadius: '8px', // 툴팁 모서리 둥글게
                padding: '10px', // 툴팁 내부 여백
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // 툴팁 그림자
              },
            },
          }}
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
    return null; // selectedKeyword가 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div>
      <h2>
        <HiOutlineChevronRight />
        {selectedKeyword}의 올해 트렌드
      </h2>
      <div className="popular-search-trends">
        {error && <div className="error">{error}</div>}
        {renderGraph()}
      </div>
    </div>
  );
};

export default PopularSearchTrends;
