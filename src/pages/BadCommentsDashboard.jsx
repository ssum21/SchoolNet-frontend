import { useState } from 'react'
import { useBadComments } from '../lib/hooks'
import { maskProfanity, detectProfanity } from '../lib/utils/contentFilter'
import '../styles/dashboard.css'

/**
 * AI 악플 탐지 대시보드
 * 선배/관리자가 의심스러운 댓글을 검토하는 페이지
 */
function BadCommentsDashboard() {
  const { data: badComments, isLoading, error, refetch } = useBadComments()
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved', 'blocked'
  const [selectedComment, setSelectedComment] = useState(null)

  const handleAction = async (commentId, action) => {
    // TODO: API 호출로 댓글 승인/차단 처리
    console.log(`Comment ${commentId} ${action}`)

    // 임시 alert
    const actionText = {
      approve: '승인',
      block: '차단',
      warn: '경고'
    }

    alert(`댓글을 ${actionText[action]}했습니다.`)
    refetch()
  }

  const getSeverityBadge = (comment) => {
    const analysis = detectProfanity(comment.content)

    if (analysis.severity === 'blocked') {
      return <span className="severity-badge severity-high">높음</span>
    } else if (analysis.severity === 'warning') {
      return <span className="severity-badge severity-medium">중간</span>
    }
    return <span className="severity-badge severity-low">낮음</span>
  }

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="page-container">
          <div className="loading-state">
            <span className="spinner"></span>
            <p>악플 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="page-container">
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>데이터를 불러오지 못했습니다.</p>
            <button className="btn btn-primary" onClick={() => refetch()}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  const comments = badComments || []
  const filteredComments = filter === 'all'
    ? comments
    : comments.filter(c => c.status === filter)

  return (
    <div className="dashboard-page">
      <div className="page-container">
        {/* 헤더 */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              <span className="title-icon">🛡️</span>
              AI 악플 탐지 대시보드
            </h1>
            <p className="dashboard-subtitle">
              AI가 감지한 의심스러운 댓글을 검토하고 조치할 수 있습니다
            </p>
          </div>

          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-value">{comments.length}</div>
              <div className="stat-label">총 댓글</div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-value">
                {comments.filter(c => c.status === 'pending').length}
              </div>
              <div className="stat-label">검토 대기</div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-value">
                {comments.filter(c => detectProfanity(c.content).severity === 'blocked').length}
              </div>
              <div className="stat-label">위험도 높음</div>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="dashboard-filters card">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              전체 ({comments.length})
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              검토 대기 ({comments.filter(c => c.status === 'pending').length})
            </button>
            <button
              className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              승인됨 ({comments.filter(c => c.status === 'approved').length})
            </button>
            <button
              className={`filter-tab ${filter === 'blocked' ? 'active' : ''}`}
              onClick={() => setFilter('blocked')}
            >
              차단됨 ({comments.filter(c => c.status === 'blocked').length})
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="comments-list">
          {filteredComments.length === 0 ? (
            <div className="empty-state card">
              <span className="empty-icon">✨</span>
              <p className="empty-text">검토할 댓글이 없습니다!</p>
              <p className="empty-subtext">모두 깨끗한 커뮤니티를 만들어주셔서 감사합니다.</p>
            </div>
          ) : (
            filteredComments.map((comment) => {
              const analysis = detectProfanity(comment.content)

              return (
                <div key={comment.id} className="comment-card card">
                  <div className="comment-header">
                    <div className="comment-meta">
                      <span className="comment-author">{comment.authorName || '익명'}</span>
                      <span className="comment-date">
                        {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                      {getSeverityBadge(comment)}
                    </div>

                    <div className="comment-actions-quick">
                      <button
                        className="action-btn action-approve"
                        onClick={() => handleAction(comment.id, 'approve')}
                        title="승인"
                      >
                        ✓
                      </button>
                      <button
                        className="action-btn action-warn"
                        onClick={() => handleAction(comment.id, 'warn')}
                        title="경고"
                      >
                        ⚠
                      </button>
                      <button
                        className="action-btn action-block"
                        onClick={() => handleAction(comment.id, 'block')}
                        title="차단"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="comment-content">
                    <div className="content-original">
                      <strong>원본:</strong>
                      <p>{comment.content}</p>
                    </div>

                    {analysis.detectedWords.length > 0 && (
                      <div className="content-masked">
                        <strong>마스킹:</strong>
                        <p>{maskProfanity(comment.content)}</p>
                      </div>
                    )}
                  </div>

                  {analysis.detectedWords.length > 0 && (
                    <div className="comment-analysis">
                      <div className="analysis-title">
                        <span className="analysis-icon">🔍</span>
                        <strong>감지된 문제</strong>
                      </div>
                      <div className="detected-words">
                        {analysis.detectedWords.map((word, idx) => (
                          <span key={idx} className="detected-word">
                            {word}
                          </span>
                        ))}
                      </div>
                      {analysis.message && (
                        <p className="analysis-message">{analysis.message}</p>
                      )}
                    </div>
                  )}

                  <div className="comment-footer">
                    <span className="comment-post-link">
                      게시물: {comment.postTitle || `#${comment.postId || 'N/A'}`}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedComment(comment)}
                    >
                      자세히 보기
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* 상세 모달 (선택 시) */}
        {selectedComment && (
          <div className="modal-overlay" onClick={() => setSelectedComment(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">댓글 상세 정보</h3>
                <button
                  className="modal-close"
                  onClick={() => setSelectedComment(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <label>작성자</label>
                  <p>{selectedComment.authorName || '익명'}</p>
                </div>

                <div className="detail-section">
                  <label>작성일시</label>
                  <p>{new Date(selectedComment.createdAt || Date.now()).toLocaleString()}</p>
                </div>

                <div className="detail-section">
                  <label>내용</label>
                  <p className="detail-content">{selectedComment.content}</p>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      handleAction(selectedComment.id, 'approve')
                      setSelectedComment(null)
                    }}
                  >
                    승인
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      handleAction(selectedComment.id, 'warn')
                      setSelectedComment(null)
                    }}
                  >
                    경고
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleAction(selectedComment.id, 'block')
                      setSelectedComment(null)
                    }}
                  >
                    차단
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BadCommentsDashboard
