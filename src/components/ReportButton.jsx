import { useState } from 'react'
import '../styles/report.css'

/**
 * 신고 버튼 컴포넌트
 * 게시글/댓글에 대한 신고 기능
 */
function ReportButton({ contentType, contentId, onReport }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reportReasons = {
    PROFANITY: { label: '욕설/비속어', emoji: '🤬' },
    BULLYING: { label: '괴롭힘/비하', emoji: '😢' },
    SPAM: { label: '스팸/광고', emoji: '📢' },
    SEXUAL: { label: '성적인 내용', emoji: '🔞' },
    VIOLENCE: { label: '폭력적 내용', emoji: '⚠️' },
    PERSONAL_INFO: { label: '개인정보 노출', emoji: '🔒' },
    FALSE_INFO: { label: '허위 정보', emoji: '❌' },
    OTHER: { label: '기타', emoji: '💭' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedReason) {
      alert('신고 사유를 선택해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: API 호출
      // await reportsApi.createReport({
      //   contentType,
      //   contentId,
      //   reason: selectedReason,
      //   details
      // })

      // 임시로 콘솔 로그
      console.log('신고 제출:', {
        contentType,
        contentId,
        reason: selectedReason,
        details
      })

      alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.')
      setShowModal(false)
      setSelectedReason('')
      setDetails('')

      if (onReport) {
        onReport()
      }
    } catch (error) {
      console.error('신고 실패:', error)
      alert('신고 접수에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        className="report-button"
        onClick={() => setShowModal(true)}
        title="신고하기"
      >
        <span className="report-icon">🚨</span>
        <span className="report-text">신고</span>
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <span className="modal-icon">🚨</span>
                신고하기
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="report-description">
                부적절한 콘텐츠를 발견하셨나요? 신고해주시면 검토 후 조치하겠습니다.
              </p>

              <form onSubmit={handleSubmit} className="report-form">
                <div className="form-section">
                  <label className="form-label">
                    신고 사유 <span className="required">*</span>
                  </label>
                  <div className="report-reasons">
                    {Object.entries(reportReasons).map(([key, { label, emoji }]) => (
                      <label
                        key={key}
                        className={`report-reason-item ${selectedReason === key ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={key}
                          checked={selectedReason === key}
                          onChange={(e) => setSelectedReason(e.target.value)}
                        />
                        <span className="reason-emoji">{emoji}</span>
                        <span className="reason-label">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    상세 설명 (선택)
                  </label>
                  <textarea
                    className="form-textarea"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="신고 사유에 대해 자세히 설명해주세요 (선택사항)"
                    rows="4"
                    maxLength={500}
                  />
                  <div className="form-hint">
                    {details.length}/500
                  </div>
                </div>

                <div className="report-notice">
                  <p>
                    <strong>⚠️ 허위 신고 주의</strong>
                  </p>
                  <p>
                    허위 신고가 반복될 경우 신고 기능 이용이 제한될 수 있습니다.
                  </p>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={isSubmitting || !selectedReason}
                  >
                    {isSubmitting ? '신고 중...' : '신고하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReportButton
