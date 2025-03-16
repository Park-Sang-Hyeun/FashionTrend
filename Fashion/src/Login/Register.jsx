import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // SweetAlert2 사용
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthDate: "",
    gender: "MALE",
  });
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setEmailMessage(""); // 이메일 변경 시 메시지 초기화
    }
  };

  useEffect(() => {
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }

    const isAllFieldsFilled = Object.values(formData).every(
      (field) => field.trim() !== ""
    );
    setIsFormValid(
      isAllFieldsFilled &&
        !passwordError &&
        emailMessage === "사용 가능한 이메일입니다."
    );
  }, [formData, passwordError, emailMessage]);

  const checkEmailDuplicate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/auth/check-email?email=${formData.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setEmailMessage(errorData.message || "중복 확인 실패");
        return;
      }

      const result = await response.json();
      setEmailMessage(result.isDuplicate ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다.");
    } catch (error) {
      console.error("Error:", error.message);
      setEmailMessage("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      Swal.fire({
        icon: "error",
        title: "폼이 유효하지 않습니다",
        text: "모든 조건을 만족해야 합니다.",
        confirmButtonText: "확인",
      });
      return;
    }

    fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "가입에 실패했습니다.");
          });
        }
        return response.json();
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "회원가입 성공!",
          text: "회원가입이 완료되었습니다.",
          confirmButtonText: "확인",
        }).then(() => {
          navigate("/"); // 메인 페이지로 이동
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "오류 발생",
          text: error.message || "가입 중 오류가 발생했습니다.",
          confirmButtonText: "확인",
        });
      });
  };

  return (
    <div className="register-container">
      <h2 className="register-title">회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="register-label">
          이메일:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="register-input"
          required
        />
        <button
          type="button"
          onClick={checkEmailDuplicate}
          className="check-email-button"
        >
          중복확인
        </button>
        <br />
        {emailMessage && (
          <span
            style={{
              color:
                emailMessage === "사용 가능한 이메일입니다." ? "green" : "red",
            }}
          >
            {emailMessage}
          </span>
        )}
        <br />
        <label htmlFor="password" className="register-label">
          비밀번호:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
          required
        />
        <br />
        <label htmlFor="confirmPassword" className="register-label">
          비밀번호 확인:
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="register-input"
          required
        />
        <span className="register-error-message">{passwordError}</span>
        <br />
        <label htmlFor="name" className="register-label">
          이름:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="register-input"
          required
        />
        <br />
        <label htmlFor="birthDate" className="register-label">
          생년월일:
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className="register-input"
        />
        <br />
        <label htmlFor="gender" className="register-label">
          성별:
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="register-select"
          required
        >
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
          <option value="OTHER">기타</option>
        </select>
        <br />
        <button
          type="submit"
          className="register-submit-button"
          disabled={!isFormValid}
        >
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Register;
