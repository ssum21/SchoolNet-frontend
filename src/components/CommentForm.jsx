import { useState } from 'react'
import axios from '../api/axios'
import EraserAnimation from './EraserAnimation'

/**
 * 댓글(답변) 작성 폼 컴포넌트
 * AI 필터링 기능 포함
 */
function CommentForm({ onSubmit }) {
  const [content, setContent] = useState('')
  const [showEraser, setShowEraser] = useState(false)
  const [filterMessage, setFilterMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 실시간 필터링 (디바운싱)
  const handleContentChange = async (e) => {
    const value = e.target.value
    setContent(value)

    // 간단한 실시간 필터링 (실제로는 디바운싱 필요)
    if (value.length > 5) {
      try {
        const response = await axios.post('/filter/check-realtime', null, {
          params: { text: value }
        })

        if (response.data.isHarmful) {
          setShowEraser(true)
          setFilterMessage(response.data.message)
          setTimeout(() => setShowEraser(false), 2000)
        }
      } catch (error) {
        console.error('필터링 체크 실패:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      // 최종 필터링 체크
      const filterResponse = await axios.post('/filter/check', {
        text: content,
        source: 'ANSWER'
      })

      if (filterResponse.data.isHarmful) {
        setShowEraser(true)
        setFilterMessage(filterResponse.data.message)
        setIsSubmitting(false)
        return
      }

      // 답변 작성
      await onSubmit(content)
      setContent('')
      setIsSubmitting(false)
    } catch (error) {
      console.error('답변 작성 실패:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>답변 작성</label>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="답변을 입력하세요 (친절하고 도움이 되는 답변을 작성해주세요)"
            rows="5"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? '작성 중...' : '답변 작성하기'}
        </button>
      </form>

      {showEraser && (
        <EraserAnimation message={filterMessage} />
      )}
    </div>
  )
}

export default CommentForm
