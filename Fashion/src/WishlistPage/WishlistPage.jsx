import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { ToastContainer, toast } from 'react-toastify'; // Toastify 추가
import 'react-toastify/dist/ReactToastify.css'; // Toastify 스타일
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태
  const [selectedItemId, setSelectedItemId] = useState(null); // 삭제할 상품 ID
  const [checkedItems, setCheckedItems] = useState([]); // 체크된 아이템 ID
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태
  const [deleteMultipleModalVisible, setDeleteMultipleModalVisible] =
    useState(false); // 선택 삭제 모달 상태

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axiosInstance.get('/api/wishlist');
      const sortedData = response.data.sort((a, b) => b.id - a.id); // ID 기준 내림차순 정렬
      setWishlist(sortedData);
    } catch (error) {
      console.error('찜한 상품 데이터를 가져오는 데 실패했습니다:', error);
      toast.error('찜한 상품 데이터를 불러오는 데 실패했습니다.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };
  

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/wishlist/${selectedItemId}`);
      setWishlist(wishlist.filter((item) => item.id !== selectedItemId));
      toast.success('상품이 삭제되었습니다.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      closeModal();
    } catch (error) {
      toast.error('상품을 삭제하는 데 실패했습니다.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      console.error('상품을 삭제하는 데 실패했습니다:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        checkedItems.map((id) => axiosInstance.delete(`/api/wishlist/${id}`))
      );
      setWishlist(wishlist.filter((item) => !checkedItems.includes(item.id)));
      toast.success('선택된 상품이 삭제되었습니다.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      setCheckedItems([]);
      setSelectAll(false);
      closeDeleteMultipleModal();
    } catch (error) {
      console.error('선택된 상품 삭제에 실패했습니다:', error);
      toast.error('선택된 상품 삭제에 실패했습니다.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const openModal = (id) => {
    setSelectedItemId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItemId(null);
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
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      setSelectAll(updatedCheckedItems.length === wishlist.length); // 전체 선택 상태 업데이트
      return updatedCheckedItems;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]); // 전체 선택 해제
    } else {
      setCheckedItems(wishlist.map((item) => item.id)); // 전체 선택
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="wishlist-page">
  <div className="sticky-header">
    <h2>찜한 상품</h2>
    <div className="wishlist-select-all-container">
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
    <hr className="wishlist-divider" />
  </div>
  {wishlist.length > 0 ? (
    <div className="wishlist-container">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="wishlist-item"
          onClick={(e) => {
            if (e.target.type !== 'checkbox') {
              // 체크박스가 아닌 경우에만 링크 열기
              window.open(item.link, '_blank');
            }
          }}
        >
          <input
            type="checkbox"
            checked={checkedItems.includes(item.id)}
            onChange={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않도록 방지
              handleCheck(item.id);
            }}
            className="wishlist-checkbox"
          />
          <img src={item.image} alt={item.title} />
          <h3>{item.title}</h3>
          <p>{item.price.toLocaleString()}원</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않도록 방지
              openModal(item.id);
            }}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p>찜한 상품이 없습니다.</p>
  )}
  <ToastContainer />
  {modalVisible && (
    <div className="wishlist-modal-overlay">
      <div className="wishlist-modal-content">
        <h3>삭제 확인</h3>
        <p>정말로 이 상품을 삭제하시겠습니까?</p>
        <div className="wishlist-modal-buttons">
          <button onClick={handleDelete} className="wishlist-confirm-button">
            예
          </button>
          <button onClick={closeModal} className="wishlist-cancel-button">
            아니오
          </button>
        </div>
      </div>
    </div>
  )}
  {deleteMultipleModalVisible && (
    <div className="wishlist-modal-overlay">
      <div className="wishlist-modal-content">
        <h3>삭제 확인</h3>
        <p>선택한 상품을 삭제하시겠습니까?</p>
        <div className="wishlist-modal-buttons">
          <button
            onClick={handleDeleteSelected}
            className="wishlist-confirm-button"
          >
            예
          </button>
          <button
            onClick={closeDeleteMultipleModal}
            className="wishlist-cancel-button"
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

export default WishlistPage;
