import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SimpleNews.css';

const SimpleNews = () => {
  const [topNews, setTopNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopNews();
  }, []);

  const fetchTopNews = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/favorites');
      // ID 기준 내림차순 정렬 후 상위 3개만 가져오기
      const sortedData = response.data.sort((a, b) => b.id - a.id).slice(0, 3);
      setTopNews(sortedData);
    } catch (error) {
      console.error('Error fetching top news:', error);
      toast.error('뉴스를 불러오는 데 실패했습니다.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-news">
      <h2>상위 관심 뉴스</h2>
      {loading ? (
        <p>뉴스를 불러오는 중입니다...</p>
      ) : topNews.length > 0 ? (
        <div className="simple-news-container">
          {topNews.map((news) => (
            <div
              key={news.id}
              className="simple-news-item"
              onClick={() => window.open(news.link, '_blank')}
            >
              <img src={news.image} alt={news.title} className="simple-news-image" />
              <div className="simple-news-content">
                <h3>{news.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>관심 뉴스가 없습니다.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default SimpleNews;
