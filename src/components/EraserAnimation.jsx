import { useState, useEffect } from 'react'
import '../styles/eraser.css'

/**
 * 지우개 애니메이션 컴포넌트
 * 악플 차단 시 지우개가 텍스트를 지우는 애니메이션
 */
function EraserAnimation({ message }) {
  const [displayText, setDisplayText] = useState(message)
  const [isErasing, setIsErasing] = useState(true)

  useEffect(() => {
    if (!message) return

    // 텍스트 지우기 애니메이션 (50ms마다 한 글자씩)
    let currentLength = message.length
    const interval = setInterval(() => {
      currentLength--
      if (currentLength <= 0) {
        clearInterval(interval)
        setIsErasing(false)
        setDisplayText('')
      } else {
        setDisplayText(message.substring(0, currentLength))
      }
    }, 50)

    return () => clearInterval(interval)
  }, [message])

  return (
    <div className="eraser-animation-overlay">
      <div className="eraser-container">
        {isErasing && (
          <>
            <div className="eraser">
              <div className="eraser-icon">🧹</div>
            </div>
            <div className="text-being-erased">{displayText}</div>
          </>
        )}

        {!isErasing && (
          <div className="eraser-message">
            <div className="heart-icon">❤️</div>
            <p className="message-text">선배님이 지워주었어요</p>
            <p className="sub-message">부적절한 표현은 사용하지 말아주세요</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EraserAnimation
