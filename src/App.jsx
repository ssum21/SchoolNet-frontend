import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import QuestionList from './pages/QuestionList'
import QuestionDetail from './pages/QuestionDetail'
import QuestionWrite from './pages/QuestionWrite'
import Board from './pages/Board'
import BoardDetail from './pages/BoardDetail'
import BoardWrite from './pages/BoardWrite'
import Login from './pages/Login'
import Register from './pages/Register'
import SeniorVerify from './pages/SeniorVerify'
import BadCommentsDashboard from './pages/BadCommentsDashboard'
import TestAnswerInput from './pages/TestAnswerInput' // Import Test Page
import TestAIBot from './pages/TestAIBot' // Import AI Bot Test Page
import AdminDashboard from './pages/AdminDashboard' // Import Admin Dashboard
import Footer from './components/Footer' // Import Footer

/**
 * 메인 앱 컴포넌트
 * 라우팅 설정 및 네비게이션 바 포함
 */
function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/questions/write" element={<QuestionWrite />} />

        {/* 게시판 라우트 */}
        <Route path="/board/:type" element={<Board />} />
        <Route path="/board/:type/:id" element={<BoardDetail />} />
        <Route path="/board/:type/write" element={<BoardWrite />} />

        {/* 안전 관리 */}
        <Route path="/dashboard/bad-comments" element={<BadCommentsDashboard />} />

        {/* 관리자 대시보드 */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/senior-verify" element={<SeniorVerify />} />

        {/* 컴포넌트 테스트 페이지 */}
        <Route path="/test/answer-input" element={<TestAnswerInput />} />
        <Route path="/test/ai-bot" element={<TestAIBot />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
