import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Chart.js의 필수 요소 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const AgeTC = ({ keyword, selectedMonth }) => {
    const [ageRankData, setAgeRankData] = useState([]);
    const category = '50000000'; // 패션의류 카테고리 값은 고정

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/ageRank?keyword=${encodeURIComponent(keyword)}&category=${category}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                const groupedData = data.results.length > 0
                    ? data.results[0].data.reduce((acc, item) => {
                        const { period, ratio, group } = item;
                        const month = period.split('-')[1]; // "YYYY-MM-DD" 형식에서 월만 추출
                        const newPeriod = `${parseInt(month)}월`; // "MM월" 형식으로 변환
                        if (!acc[newPeriod]) {
                            acc[newPeriod] = { date: newPeriod };
                        }
                        acc[newPeriod][group] = ratio;
                        return acc;
                    }, {})
                    : {};

                const sortedGroupedData = Object.values(groupedData).sort((a, b) => {
                    const monthA = parseInt(a.date.split('월')[0]);
                    const monthB = parseInt(b.date.split('월')[0]);
                    return monthA - monthB;
                });

                setAgeRankData(sortedGroupedData.reverse()); // 1월이 위에 오도록 설정
            } catch (error) {
                console.error('Error fetching age rank data:', error);
            }
        };

        if (keyword) {
            fetchData();
        }
    }, [keyword]);

    // selectedMonth (YYYY-MM) -> MM월 형식으로 변환
    const formattedSelectedMonth = selectedMonth ? `${parseInt(selectedMonth.split('-')[1])}월` : null;

    // 선택된 달에 해당하는 데이터 필터링 (selectedMonth와 date 형식이 맞는지 확인)
    const selectedData = formattedSelectedMonth
        ? ageRankData.filter((item) => item.date === formattedSelectedMonth)
        : ageRankData;

    // 선택된 달에 해당하는 데이터가 없다면 메시지와 제목 표시
    if (selectedData.length === 0) {
        return (
            <div>
                <h3 style={{ textAlign: 'center' }}>연령별 비율</h3>
                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '16px', color: '#555' }}>
                    그래프를 그릴 수 없습니다. 검색어를 확인해주세요.
                </div>
            </div>
        );
    }

    // Pie 차트에 필요한 데이터 변환
    const pieData = selectedData.map((item) => ({
        '10대': item['10'] || 0,
        '20대': item['20'] || 0,
        '30대': item['30'] || 0,
        '40대': item['40'] || 0,
        '50대': item['50'] || 0,
        '60대': item['60'] || 0,
    }));

    // Pie 차트 데이터 포맷 변환 (각 연령대별 비율만 필요)
    const chartData = {
        labels: ['10대', '20대', '30대', '40대', '50대', '60대'],
        datasets: [
            {
                data: [
                    pieData[0]['10대'],
                    pieData[0]['20대'],
                    pieData[0]['30대'],
                    pieData[0]['40대'],
                    pieData[0]['50대'],
                    pieData[0]['60대'],
                ],
                backgroundColor: ['#FFB3D9', '#A2CFFE', '#90EE90', '#FFFF66', '#D8BFD8', '#FFB6C1'], // 파스텔톤 색상
            },
        ],
    };

    return (
        <div>
            <h3 style={{ textAlign: 'center' }}>연령별 비율</h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Pie data={chartData} />
            </div>
        </div>
    );
};

export default AgeTC;
