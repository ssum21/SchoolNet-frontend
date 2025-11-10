import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiClient, getErrorMessage } from '../lib/api'
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

  const formatRelativeTime = useMemo(
    () => (timestamp) => {
      if (!timestamp) return ''

      const created = new Date(timestamp)
      if (Number.isNaN(created.getTime())) return timestamp

      const now = new Date()
      const diffSeconds = Math.floor((now.getTime() - created.getTime()) / 1000)

      if (diffSeconds < 60) return `${diffSeconds}초 전`
      if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}분 전`
      if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}시간 전`
      if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)}일 전`

      return created.toLocaleDateString('ko-KR')
    },
    []
  )

  useEffect(() => {
    fetchQuestions()
  }, [schoolId, categoryId, page, sortBy])

  const mapSortParam = (value) => {
    switch (value) {
      case 'popular':
        return 'popular'
      case 'mostAnswered':
        return 'mostAnswered'
      default:
        return 'latest'
    }
  }

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/api/posts', {
        params: {
          boardType: 'QUESTION',
          sort: mapSortParam(sortBy),
          page,
          categoryId,
          schoolId
        }
      })

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? []

      const normalized = data
        .filter((item) => !(item.isBad ?? item.bad ?? false))
        .map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          authorName:
            item.authorName ||
            item.author?.username ||
            item.author?.name ||
            '익명',
          isAuthorSenior: item.author?.isSeniorVerified ?? false,
          categoryName: item.questionDetails?.categoryName || '질문',
          viewCount: item.questionDetails?.viewCount ?? item.viewCount ?? 0,
          answerCount: item.commentCount ?? 0,
          isForSeniorsOnly: item.questionDetails?.forSeniorsOnly ?? false,
          createdAt: item.createdAt
        }))

      setQuestions(normalized)
    } catch (error) {
      console.error('질문 목록 로딩 실패:', error)
      alert(getErrorMessage(error))
    } finally {
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
            {questions.map((question) => (
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
                      {formatRelativeTime(question.createdAt)}
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
            <p className="empty-state-text">첫 질문을 작성해보세요!</p>
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
