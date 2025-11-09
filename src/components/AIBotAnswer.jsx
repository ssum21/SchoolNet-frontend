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
        params: { questionId }
      })
      setBotAnswer(response.data)
      setShowAnswer(true)
      setLoading(false)
    } catch (error) {
      console.error('AI 답변 생성 실패:', error)
      setLoading(false)
    }
  }

  const handleRate = async (isHelpful) => {
    try {
      await axios.post('/bot/rate', null, {
        params: {
          botAnswerId: botAnswer.id,
          isHelpful
        }
      })
      alert(isHelpful ? '피드백 감사합니다!' : '피드백이 전달되었습니다.')
    } catch (error) {
      console.error('평가 실패:', error)
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
                className="btn-helpful"
                onClick={() => handleRate(true)}
              >
                👍 도움됨 ({botAnswer.helpfulCount})
              </button>
              <button
                className="btn-not-helpful"
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
