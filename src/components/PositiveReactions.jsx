import { useState } from 'react'
import '../styles/positive-reactions.css'

/**
 * 긍정적 리액션 버튼 컴포넌트
 * 좋아요 외에 "도움됐어요", "친절해요", "명쾌해요" 등 긍정적 피드백
 */
function PositiveReactions({ contentType, contentId, initialReactions = {} }) {
  const [reactions, setReactions] = useState({
    helpful: initialReactions.helpful || 0,
    kind: initialReactions.kind || 0,
    clear: initialReactions.clear || 0,
    creative: initialReactions.creative || 0,
    ...initialReactions
  })

  const [myReactions, setMyReactions] = useState([]) // 내가 누른 리액션들
  const [showAll, setShowAll] = useState(false)

  const reactionTypes = {
    helpful: {
      emoji: '💡',
      label: '도움됐어요',
      description: '정말 유익한 정보예요!',
      points: 10
    },
    kind: {
      emoji: '💖',
      label: '친절해요',
      description: '따뜻한 답변 감사해요',
      points: 5
    },
    clear: {
      emoji: '✨',
      label: '명쾌해요',
      description: '이해하기 쉽게 설명해주셨어요',
      points: 8
    },
    creative: {
      emoji: '🎨',
      label: '창의적이에요',
      description: '새로운 관점이네요!',
      points: 7
    },
    funny: {
      emoji: '😄',
      label: '재미있어요',
      description: '웃으면서 배웠어요',
      points: 5
    },
    detailed: {
      emoji: '📚',
      label: '자세해요',
      description: '상세한 설명 감사합니다',
      points: 8
    }
  }

  const handleReaction = async (type) => {
    // 이미 눌렀다면 취소
    if (myReactions.includes(type)) {
      setReactions(prev => ({
        ...prev,
        [type]: Math.max(0, (prev[type] || 0) - 1)
      }))
      setMyReactions(prev => prev.filter(r => r !== type))
    } else {
      // 새로 추가
      setReactions(prev => ({
        ...prev,
        [type]: (prev[type] || 0) + 1
      }))
      setMyReactions(prev => [...prev, type])

      // 포인트 추가 알림
      const points = reactionTypes[type].points
      showPointsAnimation(points)

      // TODO: API 호출
      // await reactionsApi.addReaction({ contentType, contentId, type })
    }
  }

  const showPointsAnimation = (points) => {
    // 임시 알림 - 나중에 더 나은 애니메이션으로 교체
    console.log(`+${points} 포인트 획득!`)
  }

  // 가장 많은 리액션 3개만 표시
  const topReactions = Object.entries(reactions)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, showAll ? 6 : 3)

  const hasMoreReactions = Object.values(reactions).filter(count => count > 0).length > 3

  return (
    <div className="positive-reactions">
      <div className="reactions-header">
        <h4 className="reactions-title">
          <span className="reactions-icon">⭐</span>
          이 답변이 도움이 되었나요?
        </h4>
      </div>

      <div className="reactions-grid">
        {Object.entries(reactionTypes).slice(0, showAll ? 6 : 4).map(([type, config]) => {
          const count = reactions[type] || 0
          const isActive = myReactions.includes(type)

          return (
            <button
              key={type}
              className={`reaction-btn ${isActive ? 'active' : ''} ${count > 0 ? 'has-count' : ''}`}
              onClick={() => handleReaction(type)}
              title={config.description}
            >
              <span className="reaction-emoji">{config.emoji}</span>
              <span className="reaction-label">{config.label}</span>
              {count > 0 && (
                <span className="reaction-count">{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {!showAll && hasMoreReactions && (
        <button
          className="show-more-btn"
          onClick={() => setShowAll(true)}
        >
          더보기 ▼
        </button>
      )}

      {showAll && (
        <button
          className="show-more-btn"
          onClick={() => setShowAll(false)}
        >
          접기 ▲
        </button>
      )}

      {/* 리액션 요약 */}
      {topReactions.length > 0 && (
        <div className="reactions-summary">
          <div className="summary-items">
            {topReactions.map(([type, count]) => (
              <div key={type} className="summary-item">
                <span className="summary-emoji">{reactionTypes[type].emoji}</span>
                <span className="summary-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PositiveReactions
