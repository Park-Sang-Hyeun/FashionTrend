import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa'; // 하트 아이콘 임포트
import { ToastContainer, toast } from 'react-toastify'; // Toastify 추가
import 'react-toastify/dist/ReactToastify.css'; // Toastify 스타일 추가
import axiosInstance from '../api/axiosConfig'; // axiosInstance 사용
import './ShoppingSearch.css'; // 스타일 임포트

const ShoppingSearch = ({ keyword }) => {
  const [products, setProducts] = useState([]);
  const [hovered, setHovered] = useState(null); // 툴팁 상태 관리


  //keyword가 변할 때마다 업데이트
  useEffect(() => {
    if (keyword) {
      fetchProducts(keyword);
    }
  }, [keyword]);

  const fetchProducts = async (searchKeyword) => {
    try {
      const response = await axiosInstance.get(`/api/trends?keyword=${searchKeyword}`);
      setProducts(response.data.items.slice(0, 5)); // 상위 5개 제품만 가져옴
    } catch (error) {
      console.error('상품 데이터를 가져오는 데 실패했습니다:', error);
      toast.error('상품 데이터를 불러오는 데 실패했습니다.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
        // 중복 토스트 알림
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

  const removeBoldTags = (title) => title.replace(/<\/?b>/g, ''); // <b> 태그 제거

  const formatPrice = (price) => new Intl.NumberFormat('ko-KR').format(price); // 가격 포맷팅

  const handleProductClick = (url) => {
    window.open(url, '_blank'); // 링크를 새 탭에서 열기
  };

  return (
    <div className="shopping-search-container">
      <div className="product-list">
        {products.map((item) => (
          <div
            key={item.link}
            className="product-item"
            onClick={() => handleProductClick(item.link)}
            style={{ cursor: 'pointer' }}
          >
            <div className="product-image-wrapper">
              <img src={item.image} alt="제품 이미지" className="product-image" />
            </div>
            <div className="product-details">
              <h3>{removeBoldTags(item.title)}</h3>
              <p>가격: {formatPrice(item.lprice)}원</p>
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
        ))}
      </div>
      {/* ToastContainer 추가 */}
      <ToastContainer style={{ width: '370px', maxWidth: '80%' }}/>
    </div>
  );
};

export default ShoppingSearch;
