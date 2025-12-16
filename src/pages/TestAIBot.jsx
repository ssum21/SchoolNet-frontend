import React, { useState } from 'react'
import AIBotAnswer from '../components/AIBotAnswer'
import '../styles/ai-bot.css'

/**
 * Test Page for AIBotAnswer Component
 * Route: /test/ai-bot
 */
function TestAIBot() {
    // Mock Generator to simulate Gemini API
    const mockGeminiGenerator = async ({ questionTitle, questionContent }) => {
        // Simulate network delay (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            answer: `[TEST MODE] Gemini 2.5 Flash Mock Response\n\n대한민국 학교넷(SchoolNet)의 AI 선배입니다! 🤖\n\n질문하신 내용 "${questionTitle}"에 대해 답변해드릴게요.\n\n이것은 테스트용 더미 데이터입니다. 실제 API 호출 없이 UI와 로딩 상태를 확인하기 위한 응답입니다.\n\n**주요 포인트:**\n1. ✨ 반짝이는 애니메이션 버튼\n2. 🚀 빠른 응답 속도 (시뮬레이션)\n3. 🎨 깔끔한 글래스모피즘 UI\n\n도움이 되셨나요?`
        }
    }

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', minHeight: '100vh', background: '#f8fafc' }}>
            <h1 style={{ marginBottom: '10px', color: '#1e293b' }}>🤖 AI Bot UI Test</h1>
            <p style={{ marginBottom: '30px', color: '#64748b' }}>
                Test the AI Bot interaction without using real API tokens.
            </p>

            <div className="card" style={{ padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Example Question</h2>
                <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>수학 질문있어요 (이차방정식)</h3>
                    <p style={{ margin: 0, color: '#475569' }}>이차방정식 근의 공식을 유도하는 과정이 이해가 잘 안됩니다. 자세히 알려주실 수 있나요?</p>
                </div>

                {/* AI Bot Component with Mock Generator */}
                <AIBotAnswer
                    questionId={999}
                    questionTitle="수학 질문있어요 (이차방정식)"
                    questionContent="이차방정식 근의 공식을 유도하는 과정이 이해가 잘 안됩니다."
                    mockGenerator={mockGeminiGenerator}
                />
            </div>
        </div>
    )
}

export default TestAIBot
