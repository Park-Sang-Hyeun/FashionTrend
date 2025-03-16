import React from "react";
import UserInfo from "./UserInfo";
import SimpleNews from "./SimpleNews";
import SimpleList from "./SimpleList";
import "./PersonalUserInfo.css";

const PersonalUserInfo = () => {
  return (
    <div className="personal-user-info-container">
      {/* 왼쪽 섹션: UserInfo */}
      <div className="personal-user-info-left">
        <UserInfo />
      </div>
      
      {/* 오른쪽 섹션: SimpleNews와 SimpleList */}
      <div className="personal-user-info-right">
        <SimpleNews />
        <SimpleList />
      </div>
    </div>
  );
};

export default PersonalUserInfo;
