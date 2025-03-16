import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line'; // Nivo 라이브러리 임포트
import './Trends.css';

const Trends = ({ onCategoryChange, onGenderChange }) => {
    const [activeTab, setActiveTab] = useState('clothes');
    const [type, setType] = useState('tops');
    const [category, setCategory] = useState('블라우스');
    const [year, setYear] = useState('2025');
    const [gender, setGender] = useState('all'); 
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const keywordsByCategory = {
        clothes: {
            types: ['tops', 'bottoms', 'shoes'],
            categories: {
                tops: ["블라우스", "가디건", "니트", "셔츠", "후드티"],
                bottoms: ["청바지", "슬랙스", "치마", "레깅스", "반바지"],
                shoes: ["로퍼", "스니커즈", "플랫슈즈", "샌들", "슬리퍼", "앵클 부츠"]
            }
        },
        cosmetics: ["립스틱", "파운데이션", "마스카라", "아이섀도우", "블러셔"],
        accessories: ["스카프", "선글라스", "캡모자", "머플러", "비니"]
    };

    const fetchTrendsData = async () => {
        setError(null);

        let keywords;

        //카테고리가 clothes일 경우 type내 category를 키워드로 넘기도록 함

        if (activeTab === 'clothes') {
            keywords = keywordsByCategory.clothes.categories[type].filter(item => item === category);
        } else {
            keywords = [category];
        }

        let genderedKeyword;

        //성별 카테고리가 전체면 검색어 api로 안넘어가게, 아닐 경우 남성 혹은 여성을 보내게 함

        if (gender === 'all') {
            genderedKeyword = keywords[0];
        } else {
            genderedKeyword = `${gender === 'm' ? '남성' : '여성'} ${keywords[0]}`;
        }

        try {
            const response = await fetch('http://localhost:8080/api/trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ site: 'naver', keywords: [genderedKeyword], year })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonDataList = await response.json();
            const parsedDataList = jsonDataList.map(item => JSON.parse(item));
            setData(parsedDataList);

        } catch (error) {
            console.error('Fetch error:', error);
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    //화면 처음 접속할 때 api로 데이터 요청
    useEffect(() => {
        fetchTrendsData();
    }, []);

    //카테고리나 탭 등이 바뀔 경우 성별과 카테고리값을 넘겨서 새로 데이터 재요청
    useEffect(() => {
        fetchTrendsData();
        onCategoryChange(`${gender === 'm' ? '남성' : gender === 'f' ? '여성' : ''} ${category}`);
    }, [activeTab, type, category, year, gender]);

    // 차트 데이터를 업데이트하는 함수 정의
const updateChart = () => {
    // 데이터가 없거나 빈 배열이면 빈 배열 반환
    if (!data || data.length === 0) return [];

    // 데이터 배열을 평면화하여 차트 데이터 생성
    return data.flatMap(parsedData => {
        // 결과가 없으면 빈 배열 반환
        if (!parsedData.results) return [];

        // 각 결과 항목을 차트 데이터로 변환
        return parsedData.results.map(item => {
            // 유효한 데이터 필터링
            const validData = (item.data || [])
                .filter(entry => 
                    entry && // 항목이 존재하고
                    typeof entry === 'object' && // 객체 타입인지 확인
                    'period' in entry && 'ratio' in entry // 필수 속성 존재 여부 확인
                )
                .filter(entry => 
                    entry.period !== undefined && entry.period !== null && // 기간이 정의되어 있는지 확인
                    entry.ratio !== undefined && entry.ratio !== null // 비율이 정의되어 있는지 확인
                );

            // 필터링된 데이터를 차트 형식으로 반환
            return {
                id: item.title || 'Unknown Title', // 제목이 없으면 기본값 사용
                data: validData.map(entry => ({
                    x: entry.period, // X축: 기간
                    y: entry.ratio  // Y축: 비율
                }))
            };
        }).filter(chart => chart.data.length > 0); // 데이터가 있는 차트만 반환
    });
};


    const chartData = updateChart();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'clothes') {
            setType('tops');
            setCategory('블라우스');
        } else if (tab === 'cosmetics') {
            setCategory('립스틱');
        } else if (tab === 'accessories') {
            setCategory('스카프');
        }
        fetchTrendsData();
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        setCategory(keywordsByCategory.clothes.categories[newType][0]);
    };

    return (
        <div className="trends-container">
            <div style={{ marginBottom: '20px', fontSize: '10px', color: '#aaa' }}>
                *데이터나 표본이 부족할 경우, 현재 보유중인 데이터만을 가지고 그래프가 그려지거나 그래프가 그려지지 않을 수 있습니다.
            </div>
            <div className="tabs">
                <button onClick={() => handleTabChange('clothes')} className={activeTab === 'clothes' ? 'active' : ''}>옷</button>
                <button onClick={() => handleTabChange('cosmetics')} className={activeTab === 'cosmetics' ? 'active' : ''}>화장품</button>
                <button onClick={() => handleTabChange('accessories')} className={activeTab === 'accessories' ? 'active' : ''}>악세사리</button>
            </div>

            {activeTab === 'clothes' && (
                <div className="controls">
                    <label>
                        Choose a Type:
                        <select value={type} onChange={e => handleTypeChange(e.target.value)}>
                            {keywordsByCategory.clothes.types.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Choose a Category:
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            {keywordsByCategory.clothes.categories[type].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            {(activeTab === 'cosmetics' || activeTab === 'accessories') && (
                <div className="controls">
                    <label>
                        Choose a Category:
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            {activeTab === 'cosmetics' && keywordsByCategory.cosmetics.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            {activeTab === 'accessories' && keywordsByCategory.accessories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            <div className="controls">
                <label>
                    Choose Gender:
                    <select value={gender} onChange={e => {
                        setGender(e.target.value);
                        onGenderChange(e.target.value);
                    }}>
                        <option value="all">전체</option>
                        <option value="m">남성</option>
                        <option value="f">여성</option>
                    </select>
                </label>
            </div>

            <div className="controls">
                <label>
                    Choose a Year:
                    <select value={year} onChange={e => setYear(e.target.value)}>
                        {[2016,2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,2025].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </label>
            </div>


            <div style={{ height: '400px', marginTop: '80px', marginBottom: '110px' }}>
                {chartData && chartData.length > 0 ? (
                    <ResponsiveLine
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: 0, max: 'auto' }}
                        axisBottom={{
                            tickRotation: -45,
                            legendOffset: 40,
                            legendPosition: 'middle',
                            tickSize: 5,
                            tickPadding: 5,
                            format: (value) => `${value.substr(0, 7)}`, // 날짜 포맷 간소화
                        }}
                        axisLeft={{
                            tickValues: Array.from({ length: 6 }, (_, i) => i * 20),
                            legendOffset: -50,
                            legendPosition: 'middle',
                            tickSize: 5,
                            tickPadding: 5,
                        }}
                        enablePoints={true}
                        curve="catmullRom"
                        crosshairType="none"
                        pointSize={12}
                        lineWidth={4}
                        useMesh={true}
                        enableArea={true}
                        areaOpacity={0.6}
                        colors={['#3498db']}
                        fill={[
                            {
                                match: '*',
                                id: 'gradient',
                            },
                        ]}
                        theme={{
                            axis: {
                                domain: {
                                    line: {
                                        stroke: '#333',
                                    },
                                },
                                ticks: {
                                    line: {
                                        stroke: '#6a4cfc',
                                    },
                                    text: {
                                        fill: '#333',
                                    },
                                },
                            },
                            grid: {
                                line: {
                                    stroke: 'transparent',
                                },
                            },
                            legends: {
                                text: {
                                    fill: '#6a4cfc',
                                },
                            },
                            tooltip: {
                                container: {
                                    background: '#333',
                                    color: '#fff',
                                    padding: '10px',
                                    borderRadius: '8px',
                                },
                            },
                        }}
                        defs={[
                            {
                                id: 'gradient',
                                type: 'linearGradient',
                                colors: [
                                    { offset: 0, color: '#81CEFA' },
                                    { offset: 100, color: '#f0f4f8' },
                                ],
                            },
                        ]}
                    />
                ) : (
                    <div className="no-data-message">데이터와 표본이 부족합니다.</div>
                )}
            </div>
        </div>
    );
};

export default Trends;
