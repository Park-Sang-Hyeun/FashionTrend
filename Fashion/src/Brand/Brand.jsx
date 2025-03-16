import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaChevronDown, FaChevronUp,FaHeart } from 'react-icons/fa';
import axiosInstance from '../api/axiosConfig'; // axios 설정
import { toast, ToastContainer } from 'react-toastify'; // Toastify
import 'react-toastify/dist/ReactToastify.css'; // Toastify 스타일
import './Brand.css';

function Brand() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBrand, setActiveBrand] = useState(0 ); 
  const [productPage, setProductPage] = useState({}); 
  const [hovered, setHovered] = useState(null);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const trimDiscountPrice = (price, discountRate) => {
    if (!price || !discountRate) return price;

    const discountLength = discountRate.replace(/[^0-9]/g, '').length;
    return price.substring(discountLength);
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/brands')
      .then((response) => {
        if (!response.ok) {
          throw new Error('데이터 로드 실패');
        }
        return response.json();
      })
      .then((data) => {
        setBrands(data);
        const initialPages = {};
        data.forEach((_, index) => {
          initialPages[index] = 0;
        });
        setProductPage(initialPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleBrand = (index) => {
    setActiveBrand(activeBrand === index ? null : index);
  };

  const changePage = (brandIndex, direction) => {
    setProductPage((prev) => {
      const currentPage = prev[brandIndex];
      const newPage = currentPage + direction;
      return { ...prev, [brandIndex]: newPage };
    });
  };

  
  const saveToWishlist = async (product) => {
    try {
      let priceToSave;
  
      // 원가와 할인가 모두 있는 경우
      if (product.originalPrice && product.discountPrice && product.discountRate && product.discountRate !== '없음') {
        const discountRate = parseInt(product.discountRate.replace(/[^0-9]/g, '')) || 0;
  
        // 할인율 자릿수에 따라 앞부분 자르기
        if (discountRate >= 10) {
          priceToSave = product.discountPrice.slice(2); // 두 자리 수 할인율
        } else {
          priceToSave = product.discountPrice.slice(1); // 한 자리 수 할인율
        }
      } else {
        // 할인 정보가 없는 경우 둘 중 있는 걸로 저장
        priceToSave = product.discountPrice || product.originalPrice;
      }
  
      // 가격 변환
      const formattedPrice = parseInt(priceToSave.replace(/,/g, ''));
  
      const productData = {
        title: product.name.replace(/<\/?b>/g, ''), // <b> 태그 제거
        image: product.image,
        link: product.link,
        price: isNaN(formattedPrice) ? 0 : formattedPrice, // 유효하지 않은 숫자 예외 처리
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
        console.error("에러 상세:", error.response);
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
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // 저장된 토큰 가져오기
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('토큰 정상 ');
    } else {
        console.warn("🚨 토큰 없음: 인증이 필요합니다.");
    }
    return config;
});
  
  const handleProductClick = (link) => {
    window.open(link, '_blank');
  };

  if (loading) {
    return <p className="loading">로딩 중...</p>;
  }

  if (error) {
    return <p className="error">오류 발생: {error}</p>;
  }

  return (
    <div className="brand-container">
      <h1 className="brand-title">브랜드 랭킹</h1>
      {brands.length === 0 ? (
        <p className="brand-no-data">데이터가 없습니다.</p>
      ) : (
        <div className="brand-card-grid">
          {brands.map((brand, index) => (
            <div key={index} className="brand-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="brand-header" onClick={() => toggleBrand(index)}>
                <div>
                  <div className="brand-rank">{brand.rank}위</div>
                  <h2 className="brand-name">{brand.brand}</h2>
                  <p className="brand-tags">{brand.tags || '태그 없음'}</p>
                </div>
                <div className="brand-toggle-arrow">
                  {activeBrand === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {activeBrand === index && (
                <div className="brand-product-list-container">
                  <button
                    className="brand-pagination-arrow brand-pagination-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      changePage(index, -1);
                    }}
                    disabled={productPage[index] === 0}
                  >
                    <FaArrowLeft />
                  </button>

                  <div className="brand-product-list">
                    {brand.products && brand.products.length > 0 ? (
                      brand.products
                        .slice(
                          productPage[index] * 5,
                          productPage[index] * 5 + 5
                        )
                        .map((product, pIndex) => {
                          const originalPrice =
                            product.originalPrice !== '없음'
                              ? product.originalPrice
                              : product.discountPrice;

                          let discountPrice =
                            product.originalPrice !== '없음'
                              ? product.discountPrice
                              : '';

                          const isOriginalPriceMissing =
                            product.originalPrice === '없음';

                          if (originalPrice && discountPrice && product.discountRate !== '없음') {
                            discountPrice = trimDiscountPrice(discountPrice, product.discountRate);
                          }

                          return (
                            <div key={pIndex} className="brand-product-card" onClick={() => handleProductClick(product.link)}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="brand-product-image"
                              />
                              <h3 className="brand-product-name">
                                {product.name}
                              </h3>

                              {originalPrice && (
                                <p
                                  className={`brand-product-price ${
                                    isOriginalPriceMissing
                                      ? 'highlight-price'
                                      : 'strike-through'
                                  }`}
                                >
                                  원가: {formatPrice(originalPrice)}원
                                </p>
                              )}

                              {product.discountRate &&
                                product.discountRate !== '없음' && (
                                  <p className="brand-product-discount">
                                    ▼ 할인율: {product.discountRate}
                                  </p>
                                )}

                              {discountPrice && !isOriginalPriceMissing && (
                                <p className="brand-product-sale-price">
                                  할인가: {formatPrice(discountPrice)}원
                                </p>
                              )}
                              <div
                            className="shopping-icon-container"
                            onMouseEnter={() => setHovered(product.link)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <FaHeart
                              className="brand-heart-icon"
                              onClick={(e) => {
                                e.stopPropagation(); 
                                saveToWishlist(product);
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            {hovered === product.link && (
                              <div className="shopping-tooltip">상품 찜해놓기</div>
                            )}
                          </div>
                            </div>
                          );
                        })
                    ) : (
                      <p className="brand-no-products">등록된 상품이 없습니다.</p>
                    )}
                  </div>

                  <button
                    className="brand-pagination-arrow brand-pagination-right"
                    onClick={(e) => {
                      e.stopPropagation();
                      changePage(index, 1);
                    }}
                    disabled={
                      (productPage[index] + 1) * 5 >=
                      brand.products.length
                    }
                  >
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ToastContainer style={{ width: '370px', maxWidth: '80%' }}/> 
    </div>
  );
}

export default Brand;
