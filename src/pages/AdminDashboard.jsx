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
        // Simulate API Fetch
        setTimeout(() => {
            setMetrics({
                trust: {
                    autoBlockPrecision: { title: "자동차단 정확도", value: 92.4, trend: "up", trendValue: "2.1%", status: "good", id: "auto_block_precision" },
                    incidentRate: { title: "안전 사건 발생률", value: 1.2, trend: "down", trendValue: "0.3", status: "good", id: "incident_rate" },
                    appealOverturnRate: { title: "이의제기 해제율", value: 4.5, trend: "neutral", trendValue: "0.0%", status: "warning", id: "appeal_overturn_rate" },
                    timeToReview: { title: "관리자 평균 처리 시간", value: 12, trend: "up", trendValue: "2분", status: "bad", id: "time_to_review" },
                },
                mentor: {
                    pac: { title: "선배 답변 커버리지", value: 68, trend: "up", trendValue: "5%", status: "good", id: "mentor_pac" },
                    unanswered: { title: "미답변 질문", value: 14, trend: "down", trendValue: "3", status: "good", id: "mentor_backlog" },
                    tfpa: { title: "평균 첫 답변 시간", value: 45, trend: "down", trendValue: "10분", status: "good", id: "mentor_tfpa" },
                    phr: { title: "답변 도움됨 비율", value: 78, trend: "neutral", status: "warning", id: "mentor_phr" },
                },
                value: {
                    rqr: { title: "질문 해결률 (RQR)", value: 72, trend: "up", trendValue: "1.5%", status: "good", id: "value_rqr", isHighlight: true },
                    aiResolution: { title: "AI 답변 해결 기여도", value: 45, id: "value_ai" },
                    peerResolution: { title: "선배 답변 해결 기여도", value: 88, status: "good", id: "value_peer" },
                }
            })
            setLoading(false)
        }, 1000)
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
