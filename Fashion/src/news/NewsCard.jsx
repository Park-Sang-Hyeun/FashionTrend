import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig'; // axiosInstance 사용
import { ToastContainer, toast } from 'react-toastify'; // Toastify 추가
import 'react-toastify/dist/ReactToastify.css'; // Toastify 스타일 추가
import './NewsCard.css';

const NewsCard = () => {
  const [newsData, setNewsData] = useState([]);
  const [hovered, setHovered] = useState(null); // 툴팁 상태 관리

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axiosInstance.get('/api/news/crawl');
      setNewsData(response.data);
    } catch (error) {
      console.error('뉴스 데이터를 가져오는 데 실패했습니다:', error);
    }
  };

  const saveToFavorites = async (news) => {
    try {
      const newsData = {
        title: news.split('제목: ')[1]?.split(' | 링크: ')[0],
        link: news.split('링크: ')[1]?.split(' | 이미지: ')[0],
        image: news.split('이미지: ')[1],
      };

      await axiosInstance.post('/api/favorites', newsData);

      // 성공 알림
      toast.success('뉴스가 관심 목록에 추가되었습니다.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      if (error.response?.status === 409) {
        // 중복 뉴스 추가 시 처리
        toast.info('이미 관심 목록에 추가된 뉴스입니다.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error('로그인 후 이용 가능합니다.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <div className="news-container">
      {newsData.length > 0 ? (
        newsData
          .filter(news => {
            const title = news.split('제목: ')[1]?.split(' | 링크: ')[0];
            return title !== '제목 없음';
          })
          .map((news, index) => {
            const title = news.split('제목: ')[1]?.split(' | 링크: ')[0];
            const link = news.split('링크: ')[1]?.split(' | 이미지: ')[0];
            const image = news.split('이미지: ')[1];

            return (
              <div className="news-card" key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  <div className="news-image">
                    <img src={image} alt={title} />
                  </div>
                  <div className="news-title">
                    <h3>{title}</h3>
                  </div>
                </a>
                <div
                  className="favorite-container"
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    className="favorite-btn"
                    onClick={() => saveToFavorites(news)}
                    aria-label="즐겨찾기"
                  >
                    ★
                  </button>
                  {hovered === index && (
                    <div className="news-tooltip">뉴스 즐겨찾기 등록</div>
                  )}
                </div>
              </div>
            );
          })
      ) : (
        <p className="news-loading-message">
          <span className="news-spinner"></span>
          <span className="news-loading-text"> 뉴스를 불러오는 중입니다...</span>
        </p>
      )}
      {/* ToastContainer 추가 */}
      <ToastContainer style={{ width: '370px', maxWidth: '80%' }}/>
    </div>
  );
};

export default NewsCard;
