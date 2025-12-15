import { useState, useEffect } from 'react'
import axios from '../api/axios'

/**
 * AI 봇 답변 컴포넌트
 * Gemini AI의 자동 답변 표시
 */
function AIBotAnswer({ questionId }) {
  const [botAnswer, setBotAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const generateBotAnswer = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/bot/answer', null, {
        params: { questionId },
        timeout: 20000 // 20초 timeout
      })
      // 백엔드 응답 형식: {answer: "..."}
      setBotAnswer({
        id: `ai-${questionId}`,
        content: response.data.answer,
        botType: 'Gemini AI',
        helpfulCount: 0,
        notHelpfulCount: 0
      })
      setShowAnswer(true)
      setLoading(false)
    } catch (error) {
      console.error('AI 답변 생성 실패:', error)
      alert('AI 답변 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
      setLoading(false)
    }
  }

  const [rated, setRated] = useState(null) // 'helpful' | 'notHelpful' | null

  const handleRate = async (isHelpful) => {
    // 이미 같은 평가를 했으면 무시
    if ((isHelpful && rated === 'helpful') || (!isHelpful && rated === 'notHelpful')) {
      return
    }

    try {
      await axios.post('/bot/rate', null, {
        params: {
          botAnswerId: botAnswer.id,
          isHelpful
        }
      })

      // 이전 평가가 있었으면 그 카운트 감소
      setBotAnswer(prev => {
        const newAnswer = { ...prev }

        if (rated === 'helpful') {
          newAnswer.helpfulCount = Math.max(0, prev.helpfulCount - 1)
        } else if (rated === 'notHelpful') {
          newAnswer.notHelpfulCount = Math.max(0, prev.notHelpfulCount - 1)
        }

        // 새 평가 카운트 증가
        if (isHelpful) {
          newAnswer.helpfulCount = (newAnswer.helpfulCount || 0) + 1
        } else {
          newAnswer.notHelpfulCount = (newAnswer.notHelpfulCount || 0) + 1
        }

        return newAnswer
      })

      setRated(isHelpful ? 'helpful' : 'notHelpful')
    } catch (error) {
      console.error('평가 실패:', error)
      alert('평가 처리에 실패했습니다.')
    }
  }

  return (
    <div className="ai-bot-answer">
      {!showAnswer && !loading && (
        <button className="btn-generate-ai" onClick={generateBotAnswer}>
          🤖 AI 답변 생성하기
        </button>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>AI가 답변을 생성하고 있어요...</p>
        </div>
      )}

      {showAnswer && botAnswer && (
        <div className="bot-answer-card">
          <div className="bot-answer-header">
            <div className="bot-info">
              <span className="bot-icon">🤖</span>
              <span className="bot-name">AI 선배</span>
              <span className="bot-type">{botAnswer.botType}</span>
            </div>
          </div>

          <div className="bot-answer-content">
            <p>{botAnswer.content}</p>
          </div>

          <div className="bot-answer-footer">
            <p className="bot-disclaimer">
              ⚠️ AI가 생성한 답변입니다. 참고용으로만 활용해주세요.
            </p>
            <div className="bot-rating">
              <button
                className={`btn-helpful ${rated === 'helpful' ? 'active' : ''}`}
                onClick={() => handleRate(true)}
              >
                👍 도움됨 ({botAnswer.helpfulCount})
              </button>
              <button
                className={`btn-not-helpful ${rated === 'notHelpful' ? 'active' : ''}`}
                onClick={() => handleRate(false)}
              >
                👎 도움안됨 ({botAnswer.notHelpfulCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIBotAnswer
