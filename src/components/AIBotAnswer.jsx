import { useState } from 'react'
import axios from '../api/axios'
import '../styles/ai-bot.css'

/**
 * AI Bot Answer Component
 * Calls backend API which handles Gemini API securely
 */
function AIBotAnswer({ questionId, questionTitle, questionContent, mockGenerator = null }) {
  const [botAnswer, setBotAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rated, setRated] = useState(null)

  const generateBotAnswer = async () => {
    // If mock generator is provided, use it (for testing)
    if (mockGenerator) {
      setLoading(true)
      try {
        const response = await mockGenerator({ questionTitle, questionContent });
        setBotAnswer({
          content: response.answer,
          model: 'Test Mock AI'
        })
      } catch (e) {
        alert("Mock Error: " + e.message)
      } finally {
        setLoading(false)
      }
      return;
    }

    if (!questionId) {
      alert("질문 ID를 불러올 수 없습니다.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call backend API (which handles Gemini securely)
      const response = await axios.post(`/bot/answer?questionId=${questionId}`)

      const answerText = response.data?.answer || "답변을 생성할 수 없습니다."

      setBotAnswer({
        content: answerText,
        model: 'Gemini AI'
      })

    } catch (err) {
      console.error('AI API Error:', err)
      setError(err.message)
      alert(`AI 답변 생성 실패: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRate = async (type) => {
    if (rated === type) return
    setRated(type)

    // Send rating to backend
    try {
      await axios.post(`/bot/rate?botAnswerId=${questionId}&isHelpful=${type === 'like'}`)
    } catch (err) {
      console.error('Rating failed:', err)
    }
  }

  return (
    <div className="ai-bot-section">
      {/* 1. Initial State: Generate Button */}
      {!botAnswer && !loading && (
        <div className="ai-trigger-wrapper">
          <button className="btn-generate-ai" onClick={generateBotAnswer}>
            <span className="sparkle" style={{ top: '10%', left: '20%' }}></span>
            <span className="btn-icon">✨</span>
            <span className="btn-text">AI 쌤한테 물어보기</span>
            <span className="sparkle" style={{ bottom: '20%', right: '15%' }}></span>
          </button>
        </div>
      )}

      {/* 2. Loading State */}
      {loading && (
        <div className="ai-loading-container fade-in-up">
          <div className="gemini-loader"></div>
          <p className="loading-text">AI가 답변을 생각하고 있어요...</p>
        </div>
      )}

      {/* 3. Result State */}
      {botAnswer && (
        <div className="bot-answer-card fade-in-up">
          <div className="bot-answer-header">
            <div className="bot-info">
              <div className="bot-avatar">🤖</div>
              <div className="bot-name-wrap">
                <span className="bot-name">AI 선생님</span>
                <span className="bot-model">Powered by {botAnswer.model}</span>
              </div>
            </div>
          </div>

          <div className="bot-answer-content">
            {botAnswer.content.split('\n').map((line, i) => (
              <p key={i} style={{ minHeight: line.trim() === '' ? '10px' : 'auto' }}>
                {line}
              </p>
            ))}
          </div>

          <div className="bot-answer-footer">
            <span className="disclaimer">
              ℹ️ 정확하지 않을 수 있으니 참고만 해주세요.
            </span>
            <div className="bot-actions">
              <button
                className={`emoji-btn ${rated === 'like' ? 'active like' : ''}`}
                onClick={() => handleRate('like')}
                title="도움돼요"
              >
                👍
              </button>
              <button
                className={`emoji-btn ${rated === 'dislike' ? 'active dislike' : ''}`}
                onClick={() => handleRate('dislike')}
                title="별로예요"
              >
                👎
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIBotAnswer
