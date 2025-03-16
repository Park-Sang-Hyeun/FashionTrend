import React, { useState, useEffect } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { FaHeart } from 'react-icons/fa'; // 하트 아이콘
import { ToastContainer, toast } from 'react-toastify'; // Toastify 추가
import 'react-toastify/dist/ReactToastify.css'; // Toastify 스타일
import axiosInstance from '../api/axiosConfig'; // axiosInstance 사용
import './TrendShoppingSearch.css'; // CSS 파일 임포트

const TrendShoppingSearch = ({ keyword }) => {
  const [products, setProducts] = useState([]);
  const [hovered, setHovered] = useState(null); // 툴팁 상태 관리

  useEffect(() => {
    if (keyword) {
      fetchProducts(keyword);
    }
  }, [keyword]);

  const fetchProducts = async (searchKeyword) => {
    try {
      const response = await fetch(`http://localhost:8080/api/trends?keyword=${searchKeyword}`);
      if (!response.ok) {
        throw new Error('네이버 API 요청 실패');
      }
      const data = await response.json();
      setProducts(data.items.slice(0, 3)); // 상위 3개 상품만 가져오기
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('데이터를 불러오는 데 실패했습니다.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const saveToWishlist = async (product) => {
    try {
      const productData = {
        title: product.title.replace(/<\/?b>/g, ''), // <b> 태그 제거
        image: product.image,
        link: product.link,
        price: product.lprice,
      };

      await axiosInstance.post('/api/wishlist', productData);

      // 성공 토스트 알림
      toast.success('상품이 찜 목록에 추가되었습니다.', {
       position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info('이미 찜 목록에 있는 상품입니다.', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
      } else {
        toast.error('로그인 후 이용 가능합니다.', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
      }
    }
  };

  const removeBoldTags = (title) => title.replace(/<\/?b>/g, '');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleProductClick = (url) => {
    window.open(url, '_blank');
  };

  if (!keyword) {
    return null;
  }

  return (
    <div className="trend-shopping-container">
      <h2 className="trend-shopping-header">
        <HiOutlineChevronRight />
        {`${keyword} 관련 네이버 랭킹 TOP3 상품`}
      </h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((item) => (
            <div
              key={item.link}
              className="product-item"
              onClick={() => handleProductClick(item.link)} // 칸 전체에 클릭 이벤트 추가
              style={{ cursor: 'pointer' }}
            >
              <div className="product-image-container">
                <img src={item.image} alt="제품 이미지" className="product-image" />
              </div>
              <div className="product-details">
                <h3 className="product-title">{removeBoldTags(item.title)}</h3>
                <p className="product-price">가격: {formatPrice(item.lprice)}원</p>
              </div>
              <div
                className="shopping-icon-container"
                onMouseEnter={() => setHovered(item.link)}
                onMouseLeave={() => setHovered(null)}
              >
                <FaHeart
                  className="card-heart-icon"
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 이벤트 방지 (상품 클릭과 분리)
                    saveToWishlist(item);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                {hovered === item.link && (
                  <div className="shopping-tooltip">상품 찜해놓기</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
      {/* ToastContainer 추가 */}
      <ToastContainer style={{ width: '370px', maxWidth: '80%' }}/>
    </div>
  );
};

export default TrendShoppingSearch;
