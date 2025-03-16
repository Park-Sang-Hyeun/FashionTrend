import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';

const TwoComparison = ({ trend1, trend2 }) => {
  const [results1, setResults1] = useState(null);
  const [results2, setResults2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const handleCompareTrends = async () => {
      if (!trend1 || !trend2) {
        setError('키워드를 모두 입력해주세요.');
        return;
      }

      setLoading(true);
      setError(null);

      const year = '2025';
      const gender = 'all';

      try {
        // Fetch Trend 1
        const response1 = await fetch('http://localhost:8080/api/trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            site: 'naver',
            keywords: [trend1],
            year: year,
            gender: gender,
          }),
        });

        if (!response1.ok) {
          throw new Error('트렌드 1 데이터를 가져오는 중 오류가 발생했습니다.');
        }

        const data1 = await response1.json();
        setResults1(data1);

        // Fetch Trend 2
        const response2 = await fetch('http://localhost:8080/api/trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            site: 'naver',
            keywords: [trend2],
            year: year,
            gender: gender,
          }),
        });

        if (!response2.ok) {
          throw new Error('트렌드 2 데이터를 가져오는 중 오류가 발생했습니다.');
        }

        const data2 = await response2.json();
        setResults2(data2);

        // Process data and set chartData
        const data1Processed = JSON.parse(data1[0]).results[0]?.data || [];
        const data2Processed = JSON.parse(data2[0]).results[0]?.data || [];

        if (data1Processed.length === 0 && data2Processed.length === 0) {
          setError('그래프를 그릴 수 없습니다. 검색어를 다시 한 번 확인해주세요.');
        } else {
          setChartData([
            {
              id: trend1,
              data: data1Processed.map(item => ({
                x: item.period,
                y: item.ratio,
              })),
            },
            {
              id: trend2,
              data: data2Processed.map(item => ({
                x: item.period,
                y: item.ratio,
              })),
            },
          ]);
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    handleCompareTrends();
  }, [trend1, trend2]);

  const renderGraph = () => {
    if (!chartData.length) return null;

    return (
      <div style={{ height: '80vh', width: '80vw' }}>
        <div style={{ marginBottom: '20px', fontSize: '10px', color: '#aaa' }}>
          *데이터가 부족하거나 오타가 있을 경우, 그래프가 그려지지 않을 수 있습니다.
        </div>
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
          curve="catmullRom"
          axisBottom={{
            legendPosition: 'middle',
            legendOffset: 32,
            tickValues: 'every 1 month',
            tickSize: 10,
            format: value => `${value.substr(0, 7)}`, // 날짜 포맷 간소화
          }}
          axisLeft={{
            legendPosition: 'middle',
            legendOffset: -40,
            tickValues: 5,
            tickSize: 10,
          }}
          lineWidth={3}
          enableGridX={true}
          enableGridY={true}
          enableArea={false}
          colors={['#ff8c00', '#4682b4']}
          enablePoints={true}
          pointSize={10}
          pointColor={{ from: 'color', modifiers: [] }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-15}
          useMesh={true}
          animate={true}
          motionConfig="wobbly"
          tooltip={({ point }) => (
            <div
              style={{
                padding: '10px',
                color: '#fff',
                background: point.serieColor,
                borderRadius: '4px',
              }}
            >
              <strong>{point.serieId}</strong> {point.data.xFormatted} :{' '}
              {point.data.yFormatted}
            </div>
          )}
          crosshairType="none"
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 5,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {renderGraph()}
    </div>
  );
};

export default TwoComparison;
