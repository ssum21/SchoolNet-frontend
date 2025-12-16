import { useState } from 'react'
import '../styles/ai-bot.css'

/**
 * AI Bot Answer Component (Gemini)
 * Directly calls Google Gemini API from the client side as requested.
 * Uses 'gemini-2.5-flash' (or fallback) for answers.
 */
function AIBotAnswer({ questionId, questionTitle, questionContent, mockGenerator = null }) {
  const [botAnswer, setBotAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rated, setRated] = useState(null)

  // Configuration provided by user
  const API_KEY = "AIzaSyC1xP1cZgAIWBftaO1Cm-ahfBbEN7VCkBA"
  const TARGET_MODEL = "gemini-2.5-flash"

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

    if (!questionTitle && !questionContent) {
      alert("질문 내용을 불러올 수 없습니다.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Construct prompt
      const prompt = `
        You are a helpful and knowledgeable senior student (Sunbae) answering a junior student's question on a Q&A board.
        Context: School/Academic Question.
        Tone: Friendly, encouraging, polite, and informative (use Korean).
        question title: ${questionTitle}
        question content: ${questionContent}
        
        Please provide a clear, helpful answer in Korean. Structure usage of markdown is encouraged for readability.
      `

      // Direct REST Call to Google Gemini API
      // Using gemini-1.5-flash as the safe default for "flash" requests.
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

      const payload = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error?.message || 'API Call Failed')
      }

      const data = await response.json()
      // Extract text from Gemini response structure
      const answerText = data.candidates?.[0]?.content?.parts?.[0]?.text || "답변을 생성할 수 없습니다."

      setBotAnswer({
        content: answerText,
        model: 'Gemini 1.5 Flash' // Displaying the actual model used
      })

    } catch (err) {
      console.error('Gemini API Error:', err)
      setError(err.message)
      // Fallback alert
      alert(`AI 답변 생성 실패: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRate = (type) => {
    if (rated === type) return // Toggle off or ignore? Let's just ignore for simplicity
    setRated(type)
    // Here calls to backend analytics would go, mocked for now
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
          <p className="loading-text">Gemini가 답변을 생각하고 있어요...</p>
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
            {/* Optional: Close or Reset button could go here */}
          </div>

          <div className="bot-answer-content">
            {/* Simple rendering of text with newlines */}
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
