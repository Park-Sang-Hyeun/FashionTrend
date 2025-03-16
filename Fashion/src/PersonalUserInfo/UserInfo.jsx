import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaVenusMars, FaBirthdayCake } from "react-icons/fa";
import Swal from "sweetalert2"; 
import axiosInstance from "../api/axiosConfig";
import "./UserInfo.css";

const UserInfo = ({ token, avatar }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "MALE",
    birthDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 사용자 정보 불러오기
  useEffect(() => {
    if (token) {
      axiosInstance
        .get("/auth/user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data;
          setFormData({
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            gender: data.gender || "MALE",
            birthDate: data.birthDate || "",
            password: "",
          });
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          Swal.fire("오류", "사용자 정보를 불러오는 중 오류가 발생했습니다.", "error");
        });
    }
  }, [token]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 사용자 정보 업데이트
  const handleSave = () => {
    if (formData.password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    axiosInstance
      .put("/auth/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        Swal.fire("성공", "정보가 성공적으로 업데이트되었습니다.", "success").then(() => {
          setIsEditing(false);
          setPasswordError("");
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error("Error updating user info:", error);
        Swal.fire("오류", "정보 업데이트 중 오류가 발생했습니다.", "error");
      });
  };

  // 수정 취소
  const handleCancel = () => {
    setIsEditing(false);
    setPasswordError("");
    setConfirmPassword("");
  };

  // 회원 탈퇴
  const handleDelete = () => {
    axiosInstance
      .delete("/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "회원 탈퇴 성공",
          text: "다음에 더 좋은 인연으로 뵙길 바랍니다.",
          confirmButtonText: "확인",
        }).then(() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        Swal.fire({
          icon: "error",
          title: "회원 탈퇴 실패",
          text: "회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.",
          confirmButtonText: "확인",
        });
      });
  };

  // 모달 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="user-info-card">
      <div className="user-avatar">
        <img src={avatar} alt="User Avatar" className="avatar-img" />
      </div>

      <h2>{isEditing ? "내 정보 수정" : "내 정보"}</h2>

      <p>
        <FaUser className="info-icon" />
        <strong>이름:</strong>{" "}
        {isEditing ? (
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        ) : (
          formData.name
        )}
      </p>

      <p>
        <FaEnvelope className="info-icon" />
        <strong>이메일:</strong> <span>{formData.email}</span>
      </p>

      <p>
        <FaVenusMars className="info-icon" />
        <strong>성별:</strong>{" "}
        {isEditing ? (
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="OTHER">기타</option>
          </select>
        ) : (
          formData.gender
        )}
      </p>

      <p>
        <FaBirthdayCake className="info-icon" />
        <strong>생일:</strong>{" "}
        {isEditing ? (
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        ) : (
          formData.birthDate
        )}
      </p>

      <div className="info-button-group">
        {isEditing ? (
          <>
            <button className="info-btn-save" onClick={handleSave}>
              저장
            </button>
            <button className="info-btn-cancel" onClick={handleCancel}>
              취소
            </button>
          </>
        ) : (
          <>
            <button className="info-btn-edit" onClick={() => setIsEditing(true)}>
              수정
            </button>
            <button className="info-btn-delete" onClick={openModal}>
              탈퇴
            </button>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>정말 탈퇴하시겠습니까?</p>
            <div className="delete-modal-buttons">
              <button onClick={handleDelete}>확인</button>
              <button onClick={closeModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
