import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
} from 'chart.js';

// Chart.js의 필수 요소 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const GenderComparison = ({ trend, selectedMonth }) => {
    const [genderRankData, setGenderRankData] = useState(null);
    const [showGraph, setShowGraph] = useState(false); // 그래프 표시 상태
    const [dataLoaded, setDataLoaded] = useState(false); // 데이터 로드 상태

    useEffect(() => {
        // 트렌드에 대해 성별 순위 데이터 가져오기
        if (trend) {
            fetchGenderRankData(trend, '50000000'); // 기본값: 패션의류
        }
    }, [trend]);

    const fetchGenderRankData = async (keyword, category) => {
        try {
            setDataLoaded(false); // 데이터 로드 상태 초기화
            const response = await fetch(`http://localhost:8080/api/genderRank?keyword=${encodeURIComponent(keyword)}&category=${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await response.json();
            setGenderRankData(data);
            setShowGraph(true);
            setDataLoaded(true); // 데이터 로드 완료
        } catch (error) {
            console.error('Error fetching gender rank data:', error);
            setShowGraph(false); // 에러 발생 시 그래프 숨기기
            setDataLoaded(true); // 데이터 로드 완료로 간주
        }
    };

    // 성별 그래프 데이터 처리
    const data = genderRankData && genderRankData.results && genderRankData.results.length > 0
        ? genderRankData.results[0].data.reduce((acc, item) => {
            const month = item.period.slice(0, 7); // 'yyyy-mm' 형식으로 월만 추출
            if (!acc[month]) {
                acc[month] = { month, male: 0, female: 0 };
            }
            if (item.group === 'm') {
                acc[month].male = item.ratio;
            } else if (item.group === 'f') {
                acc[month].female = item.ratio;
            }
            return acc;
        }, {})
        : {};

    // Pie 차트에 필요한 데이터 생성
    const selectedMonthData = selectedMonth ? data[selectedMonth] : null;

    const pieData = selectedMonthData
        ? {
            labels: ['남성', '여성'],
            datasets: [
                {
                    data: [selectedMonthData.male, selectedMonthData.female],
                    backgroundColor: ['#A2CFFE', '#FFB3D9'], // 파스텔톤 색상으로 수정
                },
            ],
        }
        : {};

    return (
        <div style={{ textAlign: 'center' }}>
            <h3>성별 차트</h3>
            {/* 성별 Pie 차트 */}
            {selectedMonthData && selectedMonth && pieData.labels && pieData.datasets && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '400px' }}>
                    <Pie data={pieData} />
                </div>
            )}

            {/* 데이터가 없을 때 메시지 표시 */}
            {!selectedMonth && <div>월을 선택해주세요.</div>}
            {dataLoaded && !selectedMonthData && <div>그래프를 그릴 수 없습니다. 검색어를 확인해주세요.</div>}

            {/* 그래프 데이터가 아직 로드되지 않은 경우 로딩 메시지 표시 */}
            {!dataLoaded && <div>로딩 중...</div>}
        </div>
    );
};

export default GenderComparison;
