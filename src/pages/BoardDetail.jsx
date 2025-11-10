import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiClient, getErrorMessage } from '../lib/api'
import { useAuthStore } from '../lib/store/auth'
import '../styles/board-detail.css'

const boardInfo = {
  exam: {
    name: '족보게시판',
    icon: '📝',
    color: '#3b82f6'
  },
  talk: {
    name: '잡담게시판',
    icon: '💭',
    color: '#10b981'
  },
  meeting: {
    name: '모임게시판',
    icon: '🤝',
    color: '#f59e0b'
  }
}

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''

  const created = new Date(timestamp)
  if (Number.isNaN(created.getTime())) return timestamp

  const now = new Date()
  const diffSeconds = Math.floor((now.getTime() - created.getTime()) / 1000)

  if (diffSeconds < 60) return `${diffSeconds}초 전`
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}분 전`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}시간 전`
  if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)}일 전`

  return created.toLocaleDateString('ko-KR')
}

function BoardDetail() {
  const { type = 'exam', id } = useParams()
  const navigate = useNavigate()

  const currentBoard = useMemo(() => boardInfo[type] || boardInfo.exam, [type])

  const userId = useAuthStore((state) => state.userId) || localStorage.getItem('userId')
  const isSenior = localStorage.getItem('isSeniorVerified') === 'true'
  const token = localStorage.getItem('token')

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loadingPost, setLoadingPost] = useState(true)
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      setLoadingPost(true)
      try {
        const response = await apiClient.get(`/api/posts/${id}`)
        const data = response.data

        const boardTypeValue = data.boardType || data.board_type
        if (boardTypeValue && boardTypeValue !== (type || '').toUpperCase()) {
          navigate(`/board/${type}`, { replace: true })
          return
        }

        const meetingDetails = data.meetingDetails
        const questionDetails = data.questionDetails

        setPost({
          id: data.id,
          title: data.title,
          content: data.content,
          createdAt: formatRelativeTime(data.createdAt),
          authorName:
            data.authorName ||
            data.author?.username ||
            data.author?.name ||
            '익명',
          isBad: data.isBad ?? data.bad ?? false,
          categoryName: questionDetails?.categoryName,
          isForSeniorsOnly: questionDetails?.forSeniorsOnly ?? false,
          viewCount: questionDetails?.viewCount ?? data.viewCount ?? 0,
          meetingInfo: meetingDetails
            ? {
                schedule: meetingDetails.schedule,
                scheduleDisplay: meetingDetails.schedule
                  ? new Date(meetingDetails.schedule).toLocaleString('ko-KR')
                  : '-',
                location: meetingDetails.location,
                capacity: meetingDetails.capacity,
                currentParticipants: meetingDetails.currentParticipants ?? 0
              }
            : null,
          questionInfo: questionDetails
            ? {
                categoryName: questionDetails.categoryName || '질문',
                isForSeniorsOnly: questionDetails.forSeniorsOnly ?? false
              }
            : null
        })
      } catch (error) {
        console.error('게시글 조회 실패:', error)
        alert(getErrorMessage(error))
        navigate(`/board/${type}`, { replace: true })
      } finally {
        setLoadingPost(false)
      }
    }

    fetchPost()
  }, [id, navigate, type])

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true)
      try {
        const response = await apiClient.get('/api/comments')

        const data = Array.isArray(response.data) ? response.data : []
        const filtered = data
          .filter((item) => String(item.post?.id || item.postId) === String(id))
          .filter((item) => !(item.isBad ?? item.bad ?? false))
          .map((item) => ({
            id: item.id,
            content: item.content,
            authorName:
              item.authorName ||
              item.author?.username ||
              item.author?.name ||
              '익명',
            createdAt: formatRelativeTime(item.createdAt)
          }))

        setComments(filtered)
      } catch (error) {
        console.error('댓글 조회 실패:', error)
        alert(getErrorMessage(error))
      } finally {
        setLoadingComments(false)
      }
    }

    fetchComments()
  }, [id])

  const handleCommentSubmit = async (event) => {
    event.preventDefault()

    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    if (isSenior) {
      alert('선배님은 댓글 작성이 제한됩니다.')
      return
    }

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    if (!userId) {
      alert('사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.')
      navigate('/login')
      return
    }

    try {
      setSubmittingComment(true)
      await apiClient.post('/api/comments', {
        content: commentContent.trim(),
        postId: Number(id)
      })

      setCommentContent('')
      alert('댓글이 등록되었습니다.')
      // refresh comments
      const response = await apiClient.get('/api/comments')
      const data = Array.isArray(response.data) ? response.data : []
      const filtered = data
        .filter((item) => String(item.post?.id || item.postId) === String(id))
        .filter((item) => !(item.isBad ?? item.bad ?? false))
        .map((item) => ({
          id: item.id,
          content: item.content,
          authorName:
            item.authorName ||
            item.author?.username ||
            item.author?.name ||
            '익명',
          createdAt: formatRelativeTime(item.createdAt)
        }))
      setComments(filtered)
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      alert(getErrorMessage(error))
    } finally {
      setSubmittingComment(false)
    }
  }

  const canComment = token && !isSenior

  if (loadingPost) {
    return (
      <div className="board-detail-page">
        <div className="page-container page-narrow">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>게시글을 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="board-detail-page">
        <div className="page-container page-narrow">
          <div className="empty-state card">
            <h3 className="empty-title">게시글을 찾을 수 없습니다.</h3>
            <Link to={`/board/${type}`} className="btn btn-primary">
              게시판으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="board-detail-page">
      <div className="page-container page-narrow">
        <div className="board-detail-header">
          <Link to={`/board/${type}`} className="back-link">
            ← {currentBoard.name} 목록으로
          </Link>
          <div className="header-meta">
            <div className="board-icon-large" style={{ background: currentBoard.color }}>
              {currentBoard.icon}
            </div>
            <div>
              <h1 className="detail-title">{post.title}</h1>
              <div className="detail-meta">
                <span className="detail-author">{post.authorName}</span>
                <span className="meta-divider">•</span>
                <span className="detail-date">{post.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {type === 'meeting' && post.meetingInfo && (
          <div className="card meeting-summary-card">
            <h2 className="section-title">모임 정보</h2>
            <ul className="meeting-summary-list">
              <li>
                <strong>일정</strong>
                <span>{post.meetingInfo.scheduleDisplay}</span>
              </li>
              <li>
                <strong>장소</strong>
                <span>{post.meetingInfo.location || '미정'}</span>
              </li>
              {post.meetingInfo.capacity && (
                <li>
                  <strong>모집 인원</strong>
                  <span>
                    {post.meetingInfo.currentParticipants ?? 0} / {post.meetingInfo.capacity} 명
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}

        <article className="detail-body card">
          <p className="detail-content">{post.content}</p>
        </article>

        <section className="comments-section">
          <h2 className="section-title">댓글</h2>

          {loadingComments ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>댓글을 불러오는 중입니다...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="empty-state card">
              <h3 className="empty-title">아직 댓글이 없어요</h3>
              <p className="empty-text">첫 번째 댓글을 작성해보세요!</p>
            </div>
          ) : (
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item card">
                  <div className="comment-header">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-date">{comment.createdAt}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="comment-form-section card">
          <h3 className="section-title">댓글 작성</h3>

          {!token && (
            <div className="notice">
              댓글을 작성하려면{' '}
              <button className="link-button" onClick={() => navigate('/login')}>
                로그인
              </button>
              이 필요합니다.
            </div>
          )}

          {isSenior && (
            <div className="notice warning">
              선배님은 댓글 작성이 제한됩니다.
            </div>
          )}

          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              placeholder="댓글을 입력해주세요."
              rows={4}
              disabled={!canComment || submittingComment}
            />
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canComment || submittingComment}
              >
                {submittingComment ? '등록 중...' : '댓글 등록'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default BoardDetail

