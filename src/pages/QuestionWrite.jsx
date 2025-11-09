import { useState, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCreatePost } from '../lib/hooks'
import { detectProfanity, analyzeContext, COMMUNITY_GUIDELINES } from '../lib/utils/contentFilter'
import EraserAnimation from '../components/EraserAnimation'
import '../styles/questionwrite.css'

/**
 * 질문 작성 페이지 - Reddit/Everytime 스타일
 * 실시간 필터링 및 질문 작성 기능
 */
function QuestionWrite() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    content: '',
    isAnonymous: false,
    isForSeniorsOnly: false
  })
  const [showEraser, setShowEraser] = useState(false)
  const [filterMessage, setFilterMessage] = useState('')
  const [filterStatus, setFilterStatus] = useState(null) // 'checking', 'safe', 'harmful', 'warning'
  const [showGuidelines, setShowGuidelines] = useState(true)
  const debounceTimer = useRef(null)

  const createPostMutation = useCreatePost()

  // 실시간 필터링 (디바운스 적용)
  const handleContentChange = useCallback((e) => {
    const content = e.target.value
    setFormData(prev => ({ ...prev, content }))

    // 디바운스로 500ms 후에 검사
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (content.length > 5) {
      setFilterStatus('checking')

      debounceTimer.current = setTimeout(() => {
        // 클라이언트 측 필터링
        const profanityResult = detectProfanity(content)
        const contextResult = analyzeContext(content)

        if (profanityResult.severity === 'blocked' || contextResult.toxicityScore > 50) {
          setFilterStatus('harmful')
          setShowEraser(true)
          setFilterMessage(profanityResult.message || '부적절한 내용이 감지되었습니다.')
          setTimeout(() => {
            setShowEraser(false)
            setFilterStatus(null)
          }, 3000)
        } else if (profanityResult.severity === 'warning') {
          setFilterStatus('warning')
          setFilterMessage(profanityResult.message)
          setTimeout(() => setFilterStatus(null), 2000)
        } else {
          setFilterStatus('safe')
          setTimeout(() => setFilterStatus(null), 1500)
        }
      }, 500)
    } else {
      setFilterStatus(null)
    }
  }, [])

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({ ...prev, title }))

    // 제목도 간단히 체크
    if (title.length > 3) {
      const result = detectProfanity(title)
      if (result.severity === 'blocked') {
        setShowEraser(true)
        setFilterMessage('제목에 부적절한 내용이 포함되어 있습니다.')
        setTimeout(() => setShowEraser(false), 2000)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 최종 필터링 체크
    const titleCheck = detectProfanity(formData.title)
    const contentCheck = detectProfanity(formData.content)
    const contextCheck = analyzeContext(formData.title + ' ' + formData.content)

    if (titleCheck.severity === 'blocked' || contentCheck.severity === 'blocked') {
      setShowEraser(true)
      setFilterMessage('부적절한 언어가 포함되어 있습니다. 수정 후 다시 시도해주세요.')
      return
    }

    if (contextCheck.toxicityScore > 60) {
      setShowEraser(true)
      setFilterMessage('내용이 다소 부정적이거나 공격적일 수 있습니다. 다시 한 번 확인해주세요.')
      return
    }

    // API 호출
    createPostMutation.mutate({
      title: formData.title,
      content: formData.content,
      categoryId: parseInt(formData.categoryId),
      isAnonymous: formData.isAnonymous
    })
  }

  return (
    <div className="questionwrite-page">
      <div className="page-container page-narrow">
        {/* 브레드크럼 */}
        <div className="write-breadcrumb">
          <Link to="/questions" className="breadcrumb-link">
            ← 질문 목록
          </Link>
        </div>

        {/* 헤더 */}
        <div className="write-header">
          <h1 className="write-title">
            <span className="write-icon">✍️</span>
            질문하기
          </h1>
          <p className="write-subtitle">
            궁금한 것을 자유롭게 질문해보세요. 선배님들이 답변해드려요!
          </p>
        </div>

        {/* 작성 폼 */}
        <form onSubmit={handleSubmit} className="write-form card">
          <div className="form-section">
            <label className="form-label">
              카테고리 <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">카테고리를 선택하세요</option>
              <option value="1">📐 수학</option>
              <option value="2">🔤 영어</option>
              <option value="3">👥 친구관계</option>
              <option value="4">📚 국어</option>
              <option value="5">🧪 과학</option>
              <option value="6">💭 기타</option>
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">
              제목 <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="질문 제목을 입력하세요"
              maxLength={100}
              required
            />
            <div className="form-hint">
              {formData.title.length}/100
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              내용 <span className="required">*</span>
              {filterStatus && (
                <span className={`filter-indicator filter-${filterStatus}`}>
                  {filterStatus === 'checking' && '🔍 검사 중...'}
                  {filterStatus === 'safe' && '✅ 안전'}
                  {filterStatus === 'harmful' && '⚠️ 부적절한 내용'}
                </span>
              )}
            </label>
            <textarea
              className="form-textarea"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="질문 내용을 자세히 작성해주세요.&#10;&#10;• 어떤 부분이 궁금한가요?&#10;• 어떤 시도를 해보셨나요?&#10;• 구체적으로 설명해주시면 더 좋은 답변을 받을 수 있어요!"
              rows="12"
              required
            />
            <div className="form-hint">
              최소 10자 이상 작성해주세요
            </div>
          </div>

          <div className="form-section form-options">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              <span className="checkbox-label">
                <span className="checkbox-icon">🎭</span>
                <span className="checkbox-text">
                  <strong>익명으로 작성</strong>
                  <small>작성자 이름이 표시되지 않습니다</small>
                </span>
              </span>
            </label>

            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={formData.isForSeniorsOnly}
                onChange={(e) => setFormData({ ...formData, isForSeniorsOnly: e.target.checked })}
              />
              <span className="checkbox-label">
                <span className="checkbox-icon">🎓</span>
                <span className="checkbox-text">
                  <strong>선배 전용 질문</strong>
                  <small>선배만 답변할 수 있습니다</small>
                </span>
              </span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/questions')}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? (
                <>
                  <span className="spinner-small"></span>
                  작성 중...
                </>
              ) : (
                '질문 작성하기'
              )}
            </button>
          </div>
        </form>

        {/* AI 필터링 안내 */}
        <div className="filter-info card">
          <div className="filter-info-icon">🛡️</div>
          <div className="filter-info-content">
            <h3 className="filter-info-title">AI 내용 필터링</h3>
            <p className="filter-info-text">
              SchoolNet은 AI를 활용하여 부적절한 내용을 자동으로 필터링합니다.
              욕설, 비방, 폭력적인 내용은 작성할 수 없습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 지우개 애니메이션 */}
      {showEraser && (
        <EraserAnimation message={filterMessage} />
      )}
    </div>
  )
}

export default QuestionWrite
