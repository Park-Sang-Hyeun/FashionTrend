import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FavoriteNewsPage.css';

const FavoriteNewsPage = () => {
  const [favoriteNews, setFavoriteNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // 단일 삭제 모달 상태
  const [selectedNewsId, setSelectedNewsId] = useState(null); // 삭제할 뉴스 ID
  const [checkedItems, setCheckedItems] = useState([]); // 체크된 뉴스 ID
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태
  const [deleteMultipleModalVisible, setDeleteMultipleModalVisible] =
    useState(false); // 선택 삭제 모달 상태

  useEffect(() => {
    fetchFavoriteNews();
  }, []);

  const fetchFavoriteNews = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/favorites');
      // ID 기준 내림차순 정렬
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setFavoriteNews(sortedData);
    } catch (error) {
      console.error('Error fetching favorite news:', error);
      toast.error('관심 뉴스를 불러오는 데 실패했습니다.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/favorites/${selectedNewsId}`);
      setFavoriteNews(favoriteNews.filter((news) => news.id !== selectedNewsId));
      toast.success('뉴스가 삭제되었습니다.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      closeModal();
    } catch (error) {
      console.error('Error deleting favorite news:', error);
      toast.error('뉴스 삭제에 실패했습니다.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        checkedItems.map((id) => axiosInstance.delete(`/api/favorites/${id}`))
      );
      setFavoriteNews(favoriteNews.filter((news) => !checkedItems.includes(news.id)));
      toast.success('선택된 뉴스가 삭제되었습니다.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      setCheckedItems([]);
      setSelectAll(false);
      closeDeleteMultipleModal();
    } catch (error) {
      console.error('Error deleting selected news:', error);
      toast.error('선택된 뉴스 삭제에 실패했습니다.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const openModal = (id) => {
    setSelectedNewsId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNewsId(null);
  };

  const openDeleteMultipleModal = () => {
    setDeleteMultipleModalVisible(true);
  };

  const closeDeleteMultipleModal = () => {
    setDeleteMultipleModalVisible(false);
  };

  const handleCheck = (id) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = prev.includes(id)
        ? prev.filter((item) => item !== id) // 체크 해제
        : [...prev, id]; // 체크 추가
  
      // 전체 선택 체크박스 상태 업데이트
      setSelectAll(updatedCheckedItems.length === favoriteNews.length);
  
      return updatedCheckedItems;
    });
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]); // 전체 선택 해제
    } else {
      setCheckedItems(favoriteNews.map((news) => news.id)); // 전체 선택
    }
    setSelectAll(!selectAll);
  };
  
  return (
    <div className="favorite-news-page">
  <div className="news-sticky-header">
    <h2>내 관심 뉴스</h2>
    <div className="news-select-all-container">
      <label>
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
        />
        전체 선택
      </label>
      <button
        onClick={openDeleteMultipleModal}
        disabled={checkedItems.length === 0}
      >
        선택 삭제
      </button>
    </div>
    <hr className="news-divider" />
  </div>
  {loading ? (
    <p>뉴스를 불러오는 중입니다...</p>
  ) : favoriteNews.length > 0 ? (
    <div className="favorite-news-container">
      {favoriteNews.map((news) => (
        <div
          key={news.id}
          className="favorite-news-item"
          onClick={(e) => {
            if (e.target.type !== 'checkbox') {
              window.open(news.link, '_blank');
            }
          }}
        >
          <input
            type="checkbox"
            checked={checkedItems.includes(news.id)}
            onChange={() => handleCheck(news.id)}
            className="news-checkbox"
          />
          <img src={news.image} alt={news.title} />
          <div className="favorite-news-content">
            <h3>{news.title}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal(news.id);
              }}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>관심 뉴스가 없습니다.</p>
  )}
  <ToastContainer />
  {modalVisible && (
    <div className="news-modal-overlay">
      <div className="news-modal-content">
        <h3>삭제 확인</h3>
        <p>정말로 이 뉴스를 삭제하시겠습니까?</p>
        <div className="news-modal-buttons">
          <button onClick={handleDelete} className="news-confirm-button">
            예
          </button>
          <button onClick={closeModal} className="news-cancel-button">
            아니오
          </button>
        </div>
      </div>
    </div>
  )}
  {deleteMultipleModalVisible && (
    <div className="news-modal-overlay">
      <div className="news-modal-content">
        <h3>삭제 확인</h3>
        <p>선택한 뉴스들을 삭제하시겠습니까?</p>
        <div className="news-modal-buttons">
          <button
            onClick={handleDeleteSelected}
            className="news-confirm-button"
          >
            예
          </button>
          <button
            onClick={closeDeleteMultipleModal}
            className="news-cancel-button"
          > 
            아니오
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default FavoriteNewsPage;
