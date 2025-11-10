import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../styles/board-write.css'
import { apiClient, getErrorMessage } from '../lib/api'
import EraserAnimation from '../components/EraserAnimation'
import { detectProfanity, analyzeContext } from '../lib/utils/contentFilter'

const boardInfo = {
  exam: {
    name: '족보게시판',
    icon: '📝',
    desc: '시험 자료를 공유하고 함께 준비해요',
    color: '#3b82f6',
    helperText: '시험 과목, 학년 등의 정보를 함께 작성하면 더 많은 도움이 돼요.'
  },
  talk: {
    name: '잡담게시판',
    icon: '💭',
    desc: '자유롭게 이야기를 나눠요',
    color: '#10b981',
    helperText: '자유로운 주제로 소통하되, 예의를 지켜주세요.'
  },
  meeting: {
    name: '모임게시판',
    icon: '🤝',
    desc: '스터디, 동아리 등 모임을 만들어요',
    color: '#f59e0b',
    helperText: '모임 일정과 장소, 인원을 자세히 적으면 참여율이 높아져요.'
  }
}

function BoardWrite() {
  const { type = 'exam' } = useParams()
  const navigate = useNavigate()

  const currentBoard = useMemo(() => boardInfo[type] || boardInfo.exam, [type])

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSenior, setIsSenior] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingLocation, setMeetingLocation] = useState('')
  const [meetingCapacity, setMeetingCapacity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filterMessage, setFilterMessage] = useState('')
  const [showEraser, setShowEraser] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const seniorStatus = localStorage.getItem('isSeniorVerified') === 'true'

    setIsLoggedIn(!!token)
    setIsSenior(seniorStatus)

    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login', { replace: true })
      return
    }

    if (seniorStatus) {
      alert('선배님은 게시글 작성을 할 수 없습니다.')
      navigate(`/board/${type}`, { replace: true })
      return
    }

  }, [navigate, type])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setAttachment(null)
      return
    }

    alert('현재 첨부파일 업로드 기능은 준비 중입니다. 파일 없이 등록해주세요.')
    event.target.value = ''
    setAttachment(null)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    if (type === 'meeting' && (!meetingDate || !meetingLocation.trim())) {
      alert('모임 일정과 장소를 입력해주세요.')
      return
    }

    if (attachment) {
      alert('첨부파일은 아직 업로드할 수 없습니다. 파일을 제거해주세요.')
      return
    }

    const titleCheck = detectProfanity(title)
    const contentCheck = detectProfanity(content)
    const contextCheck = analyzeContext(`${title} ${content}`)

    if (titleCheck.severity === 'blocked' || contentCheck.severity === 'blocked') {
      setFilterMessage('부적절한 언어가 포함되어 있습니다. 선배가 정리했어요.')
      setShowEraser(true)
      setTimeout(() => {
        setShowEraser(false)
      }, 2500)
      return
    }

    if (contextCheck.toxicityScore > 60) {
      setFilterMessage('내용이 조금 과격해 보입니다. 다시 한 번 확인해주세요.')
      setShowEraser(true)
      setTimeout(() => setShowEraser(false), 2000)
      return
    }

    const boardTypeMap = {
      exam: 'EXAM',
      talk: 'TALK',
      meeting: 'MEETING'
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      boardType: boardTypeMap[type] || 'TALK'
    }

    if (type === 'meeting') {
      payload.meetingInfo = {
        schedule: meetingDate,
        location: meetingLocation.trim(),
        capacity: meetingCapacity ? Number(meetingCapacity) : undefined
      }
    }

    try {
      setSubmitting(true)

      const response = await apiClient.post('/api/posts', payload)
      const createdPost = response.data

      if (createdPost?.isBad) {
        setTitle('')
        setContent('')
        setFilterMessage('부적절한 언어가 포함되어 있습니다. 선배가 정리했어요.')
        setShowEraser(true)
        setTimeout(() => {
          setShowEraser(false)
          navigate(`/board/${type}/write`, { replace: true })
        }, 2500)
        return
      }

      alert('게시글이 등록되었습니다.')
      navigate(`/board/${type}`)
    } catch (error) {
      console.error('게시글 등록 실패:', error)
      alert(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용을 취소하시겠어요?')) {
      navigate(-1)
    }
  }

  if (!isLoggedIn || isSenior) {
    return null
  }

  return (
    <>
      <div className="board-write-page">
        <div className="page-container page-narrow">
        <div className="board-write-header">
          <Link to={`/board/${type}`} className="back-link">
            ← {currentBoard.name}으로 돌아가기
          </Link>

          <div className="header-content">
            <div className="board-icon-large" style={{ background: currentBoard.color }}>
              {currentBoard.icon}
            </div>
            <div>
              <h1 className="board-write-title">{currentBoard.name} 글쓰기</h1>
              <p className="board-write-description">{currentBoard.desc}</p>
            </div>
          </div>
        </div>

        <div className="board-write-tip">
          <span className="tip-icon">💡</span>
          <p className="tip-text">{currentBoard.helperText}</p>
        </div>

        <form className="board-write-form card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="제목을 입력해주세요"
              maxLength={100}
              required
            />
            <div className="form-helper">최대 100자까지 입력할 수 있어요.</div>
          </div>

          {type === 'meeting' && (
            <div className="meeting-extra">
              <div className="form-group">
                <label htmlFor="meetingDate">모임 일정</label>
                <input
                  id="meetingDate"
                  type="datetime-local"
                  value={meetingDate}
                  onChange={(event) => setMeetingDate(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="meetingLocation">모임 장소</label>
                <input
                  id="meetingLocation"
                  type="text"
                  value={meetingLocation}
                  onChange={(event) => setMeetingLocation(event.target.value)}
                  placeholder="예: 본관 3층 스터디룸"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="meetingCapacity">모집 인원 (선택)</label>
                <input
                  id="meetingCapacity"
                  type="number"
                  min="1"
                  value={meetingCapacity}
                  onChange={(event) => setMeetingCapacity(event.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="숫자만 입력해주세요"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder="게시글 내용을 입력해주세요."
              rows={12}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="attachment">
              첨부파일 (선택)
              <span className="label-helper"> · 최대 20MB</span>
            </label>
            <input
              id="attachment"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.hwp,.hwpx,.jpg,.jpeg,.png,.zip"
              onChange={handleFileChange}
            />
            {attachment && (
              <div className="selected-file">
                <span className="file-name">{attachment.name}</span>
                <button type="button" className="remove-file" onClick={() => setAttachment(null)}>
                  삭제
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>
              취소
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
        </div>
      </div>
      {showEraser && <EraserAnimation message={filterMessage} />}
    </>
  )
}

export default BoardWrite

