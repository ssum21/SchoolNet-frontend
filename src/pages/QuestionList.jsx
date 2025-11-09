import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from '../api/axios'
import SeniorBadge from '../components/SeniorBadge'
import '../styles/questionlist.css'

/**
 * 질문 목록 페이지 - Everytime/Reddit 스타일
 * 카테고리별, 학교별 질문 목록 표시
 */
function QuestionList() {
  const [searchParams] = useSearchParams()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('latest') // latest, popular, mostAnswered

  const schoolId = searchParams.get('schoolId') || 1
  const categoryId = searchParams.get('categoryId')

  useEffect(() => {
    fetchQuestions()
  }, [schoolId, categoryId, page, sortBy])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      // 임시 데이터
      const mockQuestions = [
        {
          id: 1,
          title: '중학교 수학 문제 도와주세요',
          content: '이차방정식 푸는 방법을 모르겠어요. 근의 공식은 어떻게 사용하나요?',
          authorName: '김학생',
          isAuthorSenior: false,
          categoryName: '수학',
          viewCount: 234,
          answerCount: 12,
          isForSeniorsOnly: false,
          createdAt: '2024-01-15T10:30:00'
        },
        {
          id: 2,
          title: '친구관계 고민이 있어요',
          content: '요즘 친구들과 잘 지내는 방법이 궁금해요',
          authorName: '익명',
          isAuthorSenior: false,
          categoryName: '친구관계',
          viewCount: 189,
          answerCount: 8,
          isForSeniorsOnly: true,
          createdAt: '2024-01-14T15:20:00'
        },
        {
          id: 3,
          title: '영어 단어 암기 팁',
          content: '영어 단어를 효과적으로 암기하는 방법이 있을까요?',
          authorName: '이학생',
          isAuthorSenior: false,
          categoryName: '영어',
          viewCount: 156,
          answerCount: 15,
          isForSeniorsOnly: false,
          createdAt: '2024-01-14T09:00:00'
        }
      ]

      setQuestions(mockQuestions)
      setLoading(false)
    } catch (error) {
      console.error('질문 목록 로딩 실패:', error)
      setLoading(false)
    }
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setPage(0)
  }

  return (
    <div className="questionlist-page">
      <div className="page-container page-narrow">
        {/* 헤더 */}
        <div className="questionlist-header">
          <div>
            <h1 className="page-title">질문게시판</h1>
            <p className="page-subtitle">
              궁금한 것을 자유롭게 질문하고 답변을 받아보세요
            </p>
          </div>
          <Link to="/questions/write" className="btn btn-primary">
            <span>✍️</span>
            질문하기
          </Link>
        </div>

        {/* 필터 및 정렬 */}
        <div className="questionlist-filters">
          <div className="sort-tabs">
            <button
              className={`sort-tab ${sortBy === 'latest' ? 'active' : ''}`}
              onClick={() => handleSortChange('latest')}
            >
              최신순
            </button>
            <button
              className={`sort-tab ${sortBy === 'popular' ? 'active' : ''}`}
              onClick={() => handleSortChange('popular')}
            >
              인기순
            </button>
            <button
              className={`sort-tab ${sortBy === 'mostAnswered' ? 'active' : ''}`}
              onClick={() => handleSortChange('mostAnswered')}
            >
              답변많은순
            </button>
          </div>

          <div className="filter-info">
            전체 <strong>{questions.length}</strong>개의 질문
          </div>
        </div>

        {/* 질문 목록 */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>질문을 불러오는 중...</p>
          </div>
        ) : questions.length > 0 ? (
          <div className="questionlist-items">
            {questions.map(question => (
              <Link
                key={question.id}
                to={`/questions/${question.id}`}
                className="questionlist-item card card-interactive"
              >
                <div className="questionlist-item-header">
                  <div className="questionlist-item-badges">
                    <span className="badge badge-gray">{question.categoryName}</span>
                    {question.isForSeniorsOnly && (
                      <span className="badge badge-primary">선배전용</span>
                    )}
                  </div>
                  {question.isAuthorSenior && <SeniorBadge size="small" />}
                </div>

                <h3 className="questionlist-item-title">{question.title}</h3>
                <p className="questionlist-item-preview">{question.content}</p>

                <div className="questionlist-item-footer">
                  <div className="questionlist-item-author">
                    <span className="author-name">{question.authorName}</span>
                    <span className="author-time">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="questionlist-item-stats">
                    <span className="stat-item">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-value">{question.viewCount}</span>
                    </span>
                    <span className="stat-item stat-answer">
                      <span className="stat-icon">💬</span>
                      <span className="stat-value">{question.answerCount}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">아직 질문이 없어요</h3>
            <p className="empty-state-text">
              첫 질문을 작성해보세요!
            </p>
            <Link to="/questions/write" className="btn btn-primary">
              질문 작성하기
            </Link>
          </div>
        )}

        {/* 페이지네이션 */}
        {questions.length > 0 && (
          <div className="pagination">
            {page > 0 && (
              <button onClick={() => setPage(page - 1)} className="btn btn-secondary">
                ← 이전
              </button>
            )}
            <span className="pagination-info">페이지 {page + 1}</span>
            <button onClick={() => setPage(page + 1)} className="btn btn-secondary">
              다음 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionList
