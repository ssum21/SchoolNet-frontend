import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import SeniorBadge from '../components/SeniorBadge'
import AnswerInput from '../components/AnswerInput' // Helper to use AnswerInput
import AIBotAnswer from '../components/AIBotAnswer'
import PositiveReactions from '../components/PositiveReactions'
import '../styles/questiondetail.css'

/**
 * 질문 상세 페이지 - Reddit 스타일
 * 질문 내용, 답변 목록, 답변 작성
 */
function QuestionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [seniorMode, setSeniorMode] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    // 현재 로그인한 사용자 ID 가져오기
    const userId = localStorage.getItem('userId')
    if (userId) setCurrentUserId(parseInt(userId))

    fetchQuestion()
    fetchAnswers()
  }, [id])

  const fetchQuestion = async () => {
    try {
      // 실제 API 호출
      const response = await axios.get(`/api/posts/${id}`)
      const post = response.data

      // 백엔드 데이터를 프론트엔드 형식으로 변환
      setQuestion({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author?.id,
        authorName: post.author?.username || '익명',
        isAuthorSenior: post.author?.userType === 'SENIOR',
        categoryName: post.questionDetails?.categoryName || '기타',
        viewCount: post.questionDetails?.viewCount || 0,
        answerCount: 0, // TODO: 댓글 수 연동
        isAnonymous: false,
        isForSeniorsOnly: post.questionDetails?.forSeniorsOnly || false,
        createdAt: post.createdAt
      })
      setLoading(false)
    } catch (error) {
      console.error('질문 로딩 실패:', error)
      setLoading(false)
    }
  }

  const fetchAnswers = async () => {
    try {
      // 실제 API 호출
      const response = await axios.get('/api/comments', {
        params: {
          postId: id
        }
      })

      // 백엔드 데이터를 프론트엔드 형식으로 변환 + 좋아요 수 가져오기
      const formattedAnswers = await Promise.all(
        response.data.map(async (comment) => {
          // 각 댓글의 좋아요 수 가져오기
          let likeCount = 0
          try {
            const likeResponse = await axios.get(`/api/comments/${comment.id}/likes`)
            likeCount = likeResponse.data.likes || 0
          } catch (e) {
            // 좋아요 수 조회 실패 시 0으로 설정
          }

          return {
            id: comment.id,
            questionId: comment.postId,
            userId: comment.author?.id,
            authorName: comment.author?.username || '익명',
            isSeniorAnswer: comment.author?.isSeniorVerified || false,
            content: comment.content,
            helpfulCount: likeCount,
            createdAt: comment.createdAt
          }
        })
      )

      setAnswers(formattedAnswers)
    } catch (error) {
      console.error('답변 로딩 실패:', error)
      setAnswers([])
    }
  }

  const handleAnswerSubmit = async (content) => {
    try {
      await axios.post('/api/comments', {
        postId: id,
        content
      })
      fetchAnswers()
    } catch (error) {
      console.error('답변 작성 실패:', error)
      alert('답변 작성에 실패했습니다.')
    }
  }

  const handleHelpful = async (answerId) => {
    try {
      const response = await axios.post(`/api/comments/${answerId}/like`)
      // 즉시 UI 업데이트
      setAnswers(prev => prev.map(answer =>
        answer.id === answerId
          ? { ...answer, helpfulCount: response.data.likes }
          : answer
      ))
    } catch (error) {
      console.error('도움됨 처리 실패:', error)
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.')
      } else {
        alert('좋아요 처리에 실패했습니다.')
      }
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 질문을 삭제하시겠습니까?')) {
      return
    }

    try {
      await axios.delete(`/api/posts/${id}`)
      alert('질문이 삭제되었습니다.')
      navigate('/questions')
    } catch (error) {
      console.error('질문 삭제 실패:', error)
      alert('질문 삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>질문을 불러오는 중...</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="page-container page-narrow">
        <div className="empty-state card">
          <div className="empty-state-icon">😕</div>
          <h3 className="empty-state-title">질문을 찾을 수 없습니다</h3>
          <Link to="/questions" className="btn btn-primary">
            질문 목록으로
          </Link>
        </div>
      </div>
    )
  }

  const filteredAnswers = seniorMode
    ? answers.filter(answer => answer.isSeniorAnswer)
    : answers

  const isAuthor = currentUserId && currentUserId === question?.authorId

  return (
    <div className="questiondetail-page">
      <div className="page-container page-narrow">
        {/* 상단 네비게이션 */}
        <div className="detail-breadcrumb">
          <Link to="/questions" className="breadcrumb-link">
            ← 질문 목록
          </Link>
        </div>

        {/* 질문 카드 */}
        <article className="question-detail-card card">
          <div className="question-detail-header">
            <div className="question-detail-badges">
              <span className="badge badge-gray">{question.categoryName}</span>
              {question.isForSeniorsOnly && (
                <span className="badge badge-primary">선배전용</span>
              )}
            </div>
            <div className="question-detail-meta">
              <span className="meta-item">
                <span className="meta-icon">👁️</span>
                {question.viewCount}
              </span>
              <span className="meta-item">
                <span className="meta-icon">💬</span>
                {answers.length}
              </span>
            </div>
          </div>

          <h1 className="question-detail-title">{question.title}</h1>

          <div className="question-detail-content">
            {question.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="question-detail-footer">
            <div className="question-detail-author">
              <div className="avatar avatar-sm">
                {question.authorName[0]}
              </div>
              <div className="author-info">
                <div className="author-name-wrapper">
                  <span className="author-name">{question.authorName}</span>
                  {question.isAuthorSenior && <SeniorBadge size="small" />}
                </div>
                <span className="author-time">
                  {new Date(question.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
            </div>

            {/* 삭제 버튼 (작성자만 보임) */}
            {isAuthor && (
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                삭제
              </button>
            )}
          </div>
        </article>

        {/* 선배 전용 모드 */}
        {question.isForSeniorsOnly && (
          <div className="senior-mode-toggle">
            <button
              className={`toggle-btn ${seniorMode ? 'active' : ''}`}
              onClick={() => setSeniorMode(!seniorMode)}
            >
              <span className="toggle-icon">🎓</span>
              <span className="toggle-text">
                {seniorMode ? '전체 답변 보기' : '선배 답변만 보기'}
              </span>
            </button>
          </div>
        )}

        {/* AI 봇 답변 */}
        <AIBotAnswer
          questionId={id}
          questionTitle={question.title}
          questionContent={question.content}
        />

        {/* 답변 섹션 */}
        <section className="answers-section">
          <div className="answers-header">
            <h2 className="answers-title">
              답변 <span className="answers-count">{filteredAnswers.length}</span>
            </h2>
          </div>

          {filteredAnswers.length > 0 ? (
            <div className="answers-list">
              {filteredAnswers.map(answer => (
                <article key={answer.id} className="answer-item card">
                  <div className="answer-content">
                    {answer.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>

                  <div className="answer-footer">
                    <div className="answer-author">
                      <div className="avatar avatar-sm">
                        {answer.authorName[0]}
                      </div>
                      <div className="author-info">
                        <div className="author-name-wrapper">
                          <span className="author-name">{answer.authorName}</span>
                          {answer.isSeniorAnswer && <SeniorBadge size="small" />}
                        </div>
                        <span className="author-time">
                          {new Date(answer.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn-helpful"
                      onClick={() => handleHelpful(answer.id)}
                    >
                      <span className="helpful-icon">❤️</span>
                      <span className="helpful-text">도움이 됐어요</span>
                      <span className="helpful-count">{answer.helpfulCount}</span>
                    </button>
                  </div>

                  {/* 6가지 긍정 리액션 */}
                  <PositiveReactions
                    contentType="comment"
                    contentId={answer.id}
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <div className="empty-state-icon">💬</div>
              <p className="empty-state-text">
                {seniorMode ? '아직 선배 답변이 없어요' : '아직 답변이 없어요'}
              </p>
            </div>
          )}
        </section>

        {/* 답변 작성 폼 */}
        <section className="answer-write-section">
          <h3 className="answer-write-title">답변 작성</h3>
          <AnswerInput onSubmit={handleAnswerSubmit} />
        </section>
      </div>
    </div>
  )
}

export default QuestionDetail
