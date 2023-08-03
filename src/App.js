import React from "react";
import "./styles/reset.css";
import { Routes, Route } from "react-router-dom";
import MainBTNav from "./components/MainBTNav";
import Main from "./pages/Main";
import Check from "./pages/Check";
import Favorite from "./pages/Favorite";
import Chat from "./pages/Chat";
import Mypage from "./pages/Mypage";
import Alarm from "./pages/Alarm";
import About from "./pages/banner/About";
import Hospital from "./pages/banner/Hospital";
import Register from "./pages/banner/Register";
import MypageMenu from "./pages/MypageMenu";
import PSprofile from "./pages/petsitter/PSprofile";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainBTNav />}>
          <Route index element={<Main />} />
          <Route path="check" element={<Check />} />
          <Route path="favorite" element={<Favorite />} />
          <Route path="chat" element={<Chat />} />
          <Route path="mypage" element={<Mypage />} />
          {/* 로그인 완료했을 때 보이는 마이페이지 */}
          <Route path="mypage2" element={<MypageMenu />} />
        </Route>
        {/* 계정 */}
        <Route path="/auth" element={<MainBTNav />}></Route>
        {/* 알림페이지 */}
        <Route path="/alarm" element={<Alarm />}></Route>
        {/* 소개페이지 */}
        <Route path="/about" element={<About />}></Route>
        {/* 펫돌봄 자격 등록 페이지 */}
        <Route path="/register" element={<Register />}></Route>
        {/* 병원페이지 */}
        <Route path="/hospital" element={<Hospital />}></Route>
        {/* 마이페이지 - 펫시터 프로필 관리 */}
        <Route path="/petsitterprfile" element={<MainBTNav />}>
          <Route path=":userID" element={<PSprofile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
