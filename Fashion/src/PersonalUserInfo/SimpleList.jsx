import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { ToastContainer, toast } from 'react-toastify'; // Toastify 추가
import 'react-toastify/dist/ReactToastify.css'; // Toastify 스타일
import './SimpleList.css';

const SimpleList = () => {
  const [topWishlist, setTopWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopWishlist();
  }, []);

  const fetchTopWishlist = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/wishlist');
      // ID 기준 내림차순 정렬 후 상위 3개만 가져오기
      const sortedData = response.data.sort((a, b) => b.id - a.id).slice(0, 3);
      setTopWishlist(sortedData);
    } catch (error) {
      console.error('찜한 상품 데이터를 가져오는 데 실패했습니다:', error);
      toast.error('찜한 상품 데이터를 불러오는 데 실패했습니다.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-list">
      <h2>찜한 상품 (최신 3개)</h2>
      {loading ? (
        <p>상품을 불러오는 중입니다...</p>
      ) : topWishlist.length > 0 ? (
        <div className="simple-list-container">
          {topWishlist.map((item) => (
            <div
              key={item.id}
              className="simple-list-item"
              onClick={() => window.open(item.link, '_blank')}
            >
              <img src={item.image} alt={item.title} className="simple-list-image" />
              <div className="simple-list-content">
                <h3>{item.title}</h3>
                <p>{item.price.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>찜한 상품이 없습니다.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default SimpleList;
