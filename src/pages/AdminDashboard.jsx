import React, { useState, useEffect } from 'react'
import MetricDetailModal from '../components/MetricDetailModal'
import '../styles/admin-dashboard.css'

/**
 * KPI Dashboard for SchoolNet Admins
 * Displays key metrics for Trust & Safety, Mentor Supply/Quality, and Value Realization.
 */
function AdminDashboard() {
    // Mock Data State
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedMetric, setSelectedMetric] = useState(null)

    useEffect(() => {
        // Initial Mock Data Load
        // Scenario: 11 highly active users (Early Adopters)
        // History: Fluctuating within requested ranges (92~98, 8~12)
        const initialData = {
            trust: {
                autoBlockPrecision: {
                    title: "자동차단 정확도",
                    value: 97.2, // Current: Improvement
                    trend: "up",
                    trendValue: "1.5%",
                    status: "good",
                    id: "auto_block_precision",
                    history: [93.5, 94.2, 92.8, 95.1, 96.0, 95.8, 97.2] // Range 92-98
                },
                incidentRate: {
                    title: "안전 사건 발생률",
                    value: 8.5, // Current: Improvement (Lower is better)
                    trend: "down",
                    trendValue: "2.1",
                    status: "good",
                    id: "incident_rate",
                    history: [11.2, 12.0, 10.5, 9.8, 10.2, 9.4, 8.5] // Range 8-12
                },
                appealOverturnRate: {
                    title: "이의제기 해제율",
                    value: 0,
                    trend: "same",
                    trendValue: "0%",
                    status: "good",
                    id: "appeal_overturn_rate",
                    history: [0, 0, 0, 0, 0, 0, 0]
                },
                timeToReview: {
                    title: "관리자 평균 처리 시간",
                    value: 2,
                    trend: "down",
                    trendValue: "5분",
                    status: "good",
                    id: "time_to_review",
                    history: [15, 10, 5, 2, 2, 1, 2]
                },
            },
            mentor: {
                pac: { title: "선배 답변 커버리지", value: 92, trend: "up", trendValue: "12%", status: "good", id: "mentor_pac", history: [60, 65, 78, 82, 85, 88, 92] },
                unanswered: { title: "미답변 질문", value: 2, trend: "down", trendValue: "1", status: "good", id: "mentor_backlog", history: [5, 4, 6, 4, 3, 2, 2] },
                tfpa: { title: "평균 첫 답변 시간", value: 15, trend: "down", trendValue: "35분", status: "good", id: "mentor_tfpa", history: [120, 90, 60, 45, 30, 20, 15] },
                phr: { title: "답변 도움됨 비율", value: 95, trend: "up", status: "good", id: "mentor_phr", history: [80, 85, 88, 90, 92, 94, 95] },
            },
            value: {
                rqr: { title: "질문 해결률 (RQR)", value: 88, trend: "up", trendValue: "5%", status: "good", id: "value_rqr", isHighlight: true, history: [70, 72, 75, 80, 82, 85, 88] },
                aiResolution: { title: "AI 답변 해결 기여도", value: 40, id: "value_ai", history: [30, 32, 35, 38, 38, 39, 40] },
                peerResolution: { title: "선배 답변 해결 기여도", value: 90, status: "good", id: "value_peer", history: [85, 85, 86, 88, 89, 90, 90] },
            }
        }

        setMetrics(initialData)
        setLoading(false)
    }, [])

    if (loading) {
        return <div className="admin-dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Dashboard...</div>
    }

    return (
        <div className="admin-dashboard-page">
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">🚀 서비스 관리 대시보드</h1>
                    <p className="dashboard-subtitle">지표를 클릭하여 상세 분석 및 백엔드 연동 가이드를 확인하세요.</p>
                </header>

                {/* 1. Trust & Safety Section */}
                <section className="dashboard-section section-trust">
                    <h2 className="section-title">
                        🛡️ Trust & Safety (안전 지표)
                        <span className="section-badge">우선순위 높음</span>
                    </h2>
                    <div className="metric-grid">
                        <MetricCard
                            metric={metrics.trust.autoBlockPrecision}
                            onClick={() => setSelectedMetric(metrics.trust.autoBlockPrecision)}
                        />
                        <MetricCard
                            metric={metrics.trust.incidentRate}
                            sub="/ 1,000 조회"
                            onClick={() => setSelectedMetric(metrics.trust.incidentRate)}
                        />
                        <MetricCard
                            metric={metrics.trust.appealOverturnRate}
                            onClick={() => setSelectedMetric(metrics.trust.appealOverturnRate)}
                        />
                        <MetricCard
                            metric={metrics.trust.timeToReview}
                            onClick={() => setSelectedMetric(metrics.trust.timeToReview)}
                        />
                    </div>
                </section>

                {/* 2. Mentor Quality Section */}
                <section className="dashboard-section section-mentor">
                    <h2 className="section-title">
                        🎓 Mentor Quality (선배 활동)
                        <span className="section-badge">핵심 공급</span>
                    </h2>
                    <div className="metric-grid">
                        <MetricCard metric={metrics.mentor.pac} onClick={() => setSelectedMetric(metrics.mentor.pac)} />
                        <MetricCard metric={metrics.mentor.unanswered} onClick={() => setSelectedMetric(metrics.mentor.unanswered)} />
                        <MetricCard metric={metrics.mentor.tfpa} onClick={() => setSelectedMetric(metrics.mentor.tfpa)} />
                        <MetricCard metric={metrics.mentor.phr} progressBar={metrics.mentor.phr.value} onClick={() => setSelectedMetric(metrics.mentor.phr)} />
                    </div>
                </section>

                {/* 3. Value Story Section */}
                <section className="dashboard-section section-value">
                    <h2 className="section-title">
                        🌟 Value Realization (가치 실현)
                    </h2>
                    <div className="metric-grid">
                        <MetricCard metric={metrics.value.rqr} onClick={() => setSelectedMetric(metrics.value.rqr)} />
                        <MetricCard metric={metrics.value.aiResolution} progressBar={metrics.value.aiResolution.value} onClick={() => setSelectedMetric(metrics.value.aiResolution)} />
                        <MetricCard metric={metrics.value.peerResolution} progressBar={metrics.value.peerResolution.value} onClick={() => setSelectedMetric(metrics.value.peerResolution)} />
                    </div>
                </section>
            </div>

            {/* Detail Modal */}
            <MetricDetailModal isOpen={!!selectedMetric} onClose={() => setSelectedMetric(null)} metric={selectedMetric} />
        </div>
    )
}

// Sub-component for individual cards
const MetricCard = ({ metric, sub, progressBar, onClick }) => {
    const { title, value, trend, trendValue, status, isHighlight } = metric;
    const statusColor = status === 'good' ? '#10b981' : status === 'bad' ? '#ef4444' : '#f59e0b';

    return (
        <div
            className="metric-card"
            style={{
                cursor: 'pointer',
                ...(isHighlight ? { border: '2px solid #6366f1', background: '#e0e7ff' } : {})
            }}
            onClick={onClick}
        >
            <div className="metric-header">
                <span className="metric-title">{title}</span>
                {status && <span className={`status-pill status-${status}`}></span>}
            </div>

            <div className="metric-value-area">
                <div className="current-value">
                    {value}
                    {sub && <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400 }}> {sub}</span>}
                </div>

                {trend && (
                    <div className={`metric-trend trend-${trend === 'up' && status === 'bad' ? 'down' : trend}`}>
                        {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '-'} {trendValue}
                        <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}> vs last week</span>
                    </div>
                )}

                {progressBar && (
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progressBar}%`, backgroundColor: statusColor || '#3b82f6' }}></div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
