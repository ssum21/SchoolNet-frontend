import { useState, useRef, useEffect } from 'react'
import axios from '../api/axios'
import EraserAnimation from './EraserAnimation'
import '../styles/answer-input.css'

/**
 * Modern Answer Input Component
 * Replaces the legacy CommentForm with a trendy, dynamic UI
 * Features: Auto-resizing, Character count, AI Safety Filtering
 */
const AnswerInput = ({
    onSubmit,
    placeholder = "지식을 나누어주세요. 당신의 답변이 누군가에게 큰 힘이 됩니다.",
    // Allow injecting custom filter logic for testing
    filterRealtimeFn = null,
    filterFinalFn = null
}) => {
    const [content, setContent] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showEraser, setShowEraser] = useState(false)
    const [filterMessage, setFilterMessage] = useState('')

    const textareaRef = useRef(null)
    const maxLength = 2000

    // Auto-resize logic: Adjust height based on scrollHeight
    useEffect(() => {
        if (textareaRef.current) {
            // Reset height to auto first to get the correct scrollHeight for shrinking
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [content])

    // Real-time filtering logic
    const handleContentChange = async (e) => {
        const value = e.target.value
        if (value.length > maxLength) return // Prevent exceeding max length

        setContent(value)

        // Check periodically
        if (value.length > 5 && value.length % 10 === 0) {
            try {
                let isHarmful = false;
                let message = '';

                if (filterRealtimeFn) {
                    // Use injected mock function
                    const result = await filterRealtimeFn(value);
                    isHarmful = result.isHarmful;
                    message = result.message;
                } else {
                    // Default Axios call
                    const response = await axios.get('/api/filter/check-realtime', {
                        params: { text: value }
                    })
                    isHarmful = response.data.isHarmful;
                    message = response.data.message;
                }

                if (isHarmful) {
                    triggerEraser(message)
                }
            } catch (error) {
                console.warn('Realtime filter check failed:', error)
            }
        }
    }

    const triggerEraser = (message) => {
        setShowEraser(true)
        setFilterMessage(message)
        setTimeout(() => setShowEraser(false), 2500)
    }

    const handleSubmit = async () => {
        if (!content.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            // Final Safety Check
            let isHarmful = false;
            let message = '';

            if (filterFinalFn) {
                const result = await filterFinalFn(content);
                isHarmful = result.isHarmful;
                message = result.message;
            } else {
                const filterResponse = await axios.post('/api/filter/check', {
                    text: content,
                    source: 'ANSWER'
                })
                isHarmful = filterResponse.data.isHarmful;
                message = filterResponse.data.message;
            }

            if (isHarmful) {
                triggerEraser(message)
                setIsSubmitting(false)
                return
            }

            // Proceed with submission
            await onSubmit(content)
            setContent('') // Reset content on success

        } catch (error) {
            console.error('Answer submission failed:', error)
            alert('답변 등록 중 문제가 발생했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={`answer-input-wrapper ${isFocused ? 'focused' : ''} ${showEraser ? 'shaking' : ''}`}>
            <div className="input-header">
                <label className="input-label">답변 작성</label>
                {isSubmitting && <span className="status-text">등록 중...</span>}
            </div>

            <div className="textarea-container">
                <textarea
                    ref={textareaRef}
                    className="modern-textarea"
                    placeholder={placeholder}
                    value={content}
                    onChange={handleContentChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isSubmitting}
                    rows={1}
                />
            </div>

            <div className="input-footer">
                <span className={`char-counter ${content.length > maxLength * 0.9 ? 'warning' : ''}`}>
                    {content.length} / {maxLength}자
                </span>
                <button
                    className="modern-submit-btn"
                    onClick={handleSubmit}
                    disabled={!content.trim() || isSubmitting}
                >
                    {isSubmitting ? '등록 중' : '답변 등록'}
                </button>
            </div>

            {/* Safety Eraser Animation Overlay */}
            {showEraser && <EraserAnimation message={filterMessage} />}
        </div>
    )
}

export default AnswerInput
