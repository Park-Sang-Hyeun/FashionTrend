import React, { useRef, useState, useEffect } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { useTrail, animated } from '@react-spring/web';
import './PopularSearchWordCloud.css';

const colors = ['#143059', '#1C466A', '#265A7D', '#2F6B9A', '#3E84B5', '#4F98CC', '#82a6c2'];

type WordData = {
    text: string;
    value: number;
};

type Props = {
    keywords: WordData[];
    onKeywordSelect: (keyword: string) => void;
};

const PopularSearchWordCloud: React.FC<Props> = ({ keywords, onKeywordSelect }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 900, height: 700 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: 500,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const fontScale = scaleLog({
        domain: keywords.length > 0
            ? [Math.max(...keywords.map((w) => w.value)), Math.min(...keywords.map((w) => w.value))]
            : [1, 10],
        range: [8, 80],
    });

    const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

    const trail = useTrail(keywords.length, {
        opacity: 1,
        transform: 'translateY(0px)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        config: { duration: 100 },
    });

    return (
        <div className="wordcloud-wrapper" ref={containerRef}>
            <h2 className="wordcloud-label">
                <HiOutlineChevronRight /> 핫한 실시간 트렌드 키워드
            </h2>
            <div className="wordcloud-container">
                {keywords.length > 0 && (
                    <Wordcloud
                        words={keywords}
                        width={dimensions.width}
                        height={dimensions.height}
                        fontSize={fontSizeSetter}
                        padding={2}
                        spiral="archimedean"
                        rotate={0}
                        random={() => 0.5}
                    >
                        {(cloudWords) =>
                            cloudWords.map((w, index) => (
                                <animated.g
                                    key={`${w.text}-${index}`}
                                    style={trail[index]}
                                    onClick={() => w.text && onKeywordSelect(w.text)}
                                >
                                    <Text
                                        fill={colors[index % colors.length]} // 남색~푸른 계열 색상
                                        textAnchor="middle"
                                        transform={`translate(${w.x}, ${w.y})`}
                                        fontSize={w.size}
                                        fontFamily="Impact"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {w.text}
                                    </Text>
                                </animated.g>
                            ))
                        }
                    </Wordcloud>
                )}
            </div>
        </div>
    );
};

export default PopularSearchWordCloud;
