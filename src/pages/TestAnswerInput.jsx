import React, { useState } from 'react'
import AnswerInput from '../components/AnswerInput'
import '../styles/board.css' // Reusing basic layout styles

/**
 * Test Page for AnswerInput Component
 * Route: /test/answer-input
 */
function TestAnswerInput() {
    const [submittedAnswers, setSubmittedAnswers] = useState([])

    // Mock Submit Handler
    const handleAnswerSubmit = async (content) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const newAnswer = {
            id: Date.now(),
            content,
            createdAt: new Date()
        }
        setSubmittedAnswers([newAnswer, ...submittedAnswers])
        alert(`답변이 등록되었습니다!\n\n내용: ${content}`)
    }

    // Mock Realtime Filter
    // Returns 'harmful' if text contains 'dummy' or 'test'
    const mockRealtimeFilter = async (text) => {
        // console.log("Realtime Check:", text)
        if (text.includes('바보')) {
            return { isHarmful: true, message: '비속어가 감지되었습니다 (Realtime)' }
        }
        return { isHarmful: false, message: '' }
    }

    // Mock Final Filter (Stricter)
    const mockFinalFilter = async (text) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        if (text.includes('멍청이')) {
            return { isHarmful: true, message: '부적절한 표현이 포함되어 있습니다. (Final Check)' }
        }
        return { isHarmful: false, message: '' }
    }

    return (
        <div className="page-container page-narrow" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h1>Answer Input Component Test</h1>
            <p style={{ marginBottom: '20px', color: '#666' }}>
                Try typing "바보" (fool) to test realtime filter, or "멍청이" (idiot) to test final submission filter.
            </p>

            <div className="card" style={{ padding: '20px', backgroundColor: '#f9fafb' }}>
                <AnswerInput
                    onSubmit={handleAnswerSubmit}
                    filterRealtimeFn={mockRealtimeFilter}
                    filterFinalFn={mockFinalFilter}
                    placeholder="테스트용 입력창입니다. 자유롭게 입력해보세요..."
                />
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3>Submitted Answers (Dummy Data)</h3>
                {submittedAnswers.length === 0 ? (
                    <p style={{ color: '#999' }}>No answers submitted yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {submittedAnswers.map(answer => (
                            <div key={answer.id} className="card" style={{ padding: '15px' }}>
                                <p style={{ margin: '0 0 10px 0', whiteSpace: 'pre-wrap' }}>{answer.content}</p>
                                <small style={{ color: '#888' }}>
                                    {answer.createdAt.toLocaleString()}
                                </small>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TestAnswerInput
