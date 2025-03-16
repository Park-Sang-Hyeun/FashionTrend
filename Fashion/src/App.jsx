import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import TrendsAndSearchContainer from './TrendsAndSearchContainer/TrendsAndSearchContainer';
import TrendAnalysis from './TrendAnalysis/TrendAnalysis';
import LiveRanking from './LiveRanking/LiveRanking';
import TrendRanking from './LiveRanking/TrendRanking';
import TrendCloud from './LiveRanking/TrendCloud';
import NewsCard from './news/NewsCard';
import Register from './Login/Register';
import Home from './home/Home';
import UserInfo from './PersonalUserInfo/UserInfo';
import WishlistPage from './WishlistPage/WishlistPage';
import FavoriteNewsPage from './FavoriteNewsPage/FavoriteNewsPage';
import Brand from './Brand/Brand';
import './App.css';

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [gender, setGender] = useState('m');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const avatarImages = ["/character.png", "/character2.png", "/character3.png", "/character4.png"];
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setAvatar(avatarImages[Math.floor(Math.random() * avatarImages.length)]);
  }, [avatarImages]);

  const handleCategoryChange = (newKeyword) => {
    setKeyword(newKeyword);
  };

  const handleGenderChange = (newGender) => {
    setGender(newGender);
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <AppContent
        keyword={keyword}
        gender={gender}
        handleCategoryChange={handleCategoryChange}
        handleGenderChange={handleGenderChange}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        token={token}
        avatar={avatar}
      />
    </Router>
  );
};

const AppContent = ({
  keyword,
  gender,
  handleCategoryChange,
  handleGenderChange,
  handleLogin,
  handleLogout,
  token,
  avatar,
}) => {
  const location = useLocation();
  const isUserInfoPage = location.pathname === '/user-info';

  return (
    <div className={`app ${isUserInfoPage ? 'user-info-bg' : ''}`}>
      <Sidebar />
      <Header avatar={avatar}/>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/trends"
            element={
              <TrendsAndSearchContainer
                keyword={keyword}
                gender={gender}
                handleCategoryChange={handleCategoryChange}
                handleGenderChange={handleGenderChange}
              />
            }
          />
          <Route path="/trend-analysis" element={<TrendAnalysis />} />
          <Route path="/live-ranking" element={<LiveRanking />} />
          <Route path="/trend-ranking" element={<TrendRanking />} />
          <Route path="/trend-cloud" element={<TrendCloud />} />
          <Route path="/news" element={<NewsCard token={token} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-info" element={<UserInfo token={token} avatar={avatar} />} />
          <Route path="/wishlist" element={<WishlistPage token={token} />} />
          <Route path="/favorite-news" element={<FavoriteNewsPage token={token} />} />
          <Route path="/brand" element={<Brand />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
