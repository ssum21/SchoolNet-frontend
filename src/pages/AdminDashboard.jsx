import React, { useState, useEffect } from 'react'
import '../styles/admin-dashboard.css'

/**
 * KPI Dashboard for SchoolNet Admins
 * Displays key metrics for Trust & Safety, Mentor Supply/Quality, and Value Realization.
 */
function AdminDashboard() {
    // Mock Data State
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate API Fetch
        setTimeout(() => {
            setMetrics({
                trust: {
                    autoBlockPrecision: 92.4, // %
                    incidentRate: 1.2, // per 1k views
                    underageSafetyRate: 0.05, // per 1k views
                    appealOverturnRate: 4.5, // %
                    timeToReview: 12, // minutes (avg)
                },
                mentor: {
                    pac: 68, // Peer Answer Coverage %
                    unanswered: 14, // count
                    tfpa: 45, // Time to First Peer Answer (min)
                    slaAdherence: 85, // % within 6h
                    phr: 78, // Peer Helpful Rate %
                },
                value: {
                    rqr: 72, // Resolution Rate % (North Star)
                    aiResolution: 45, // %
                    peerResolution: 88, // % (Peers are better)
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
                    <p className="dashboard-subtitle">고객가치 실현을 위한 핵심 통제 지표 (Control Metrics)</p>
                </header>

                {/* 1. Trust & Safety Section */}
                <section className="dashboard-section section-trust">
                    <h2 className="section-title">
                        🛡️ Trust & Safety (안전 지표)
                        <span className="section-badge">우선순위 높음</span>
                    </h2>
                    <div className="metric-grid">
                        <MetricCard
                            title="자동차단 정확도 (Precision)"
                            value={`${metrics.trust.autoBlockPrecision}%`}
                            trend="up"
                            trendValue="2.1%"
                            status="good"
                            desc="시스템이 차단한 것 중 실제 위반 비율"
                        />
                        <MetricCard
                            title="안전 사건 발생률"
                            value={`${metrics.trust.incidentRate}건`}
                            sub="/ 1,000 조회"
                            trend="down"
                            trendValue="0.3"
                            status="good"
                            desc="신고 접수 건수 (낮을수록 좋음)"
                        />
                        <MetricCard
                            title="이의제기 해제율 (과차단)"
                            value={`${metrics.trust.appealOverturnRate}%`}
                            trend="neutral"
                            trendValue="0.0%"
                            status="warning"
                            desc="잘못된 차단으로 인한 해제 비율"
                        />
                        <MetricCard
                            title="관리자 평균 처리 시간 (TTR)"
                            value={`${metrics.trust.timeToReview}분`}
                            trend="up"
                            trendValue="2분 (지연)"
                            status="bad"
                            desc="신고 접수 후 처리 완료까지 시간"
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
                        <MetricCard
                            title="선배 답변 커버리지 (PAC)"
                            value={`${metrics.mentor.pac}%`}
                            trend="up"
                            trendValue="5%"
                            status="good"
                            desc="질문 중 선배 답변이 달린 비율"
                        />
                        <MetricCard
                            title="미답변 질문 (Backlog)"
                            value={`${metrics.mentor.unanswered}개`}
                            trend="down"
                            trendValue="3개"
                            status="good"
                            desc="24시간 이상 방치된 질문 수"
                        />
                        <MetricCard
                            title="평균 첫 답변 시간 (TFPA)"
                            value={`${metrics.mentor.tfpa}분`}
                            trend="down"
                            trendValue="10분 (개선)"
                            status="good"
                            desc="질문 후 첫 선배 답변까지 시간"
                        />
                        <MetricCard
                            title="답변 도움됨 비율 (PHR)"
                            value={`${metrics.mentor.phr}%`}
                            trend="neutral"
                            status="warning"
                            progressBar={metrics.mentor.phr}
                            desc="선배 답변에 대한 좋아요 비율"
                        />
                    </div>
                </section>

                {/* 3. Value Story Section */}
                <section className="dashboard-section section-value">
                    <h2 className="section-title">
                        🌟 Value Realization (가치 실현)
                    </h2>
                    <div className="metric-grid">
                        <MetricCard
                            title="북극성 지표: 질문 해결률 (RQR)"
                            value={`${metrics.value.rqr}%`}
                            trend="up"
                            trendValue="1.5%"
                            status="good"
                            desc="질문자가 '해결됨'을 느낀 비율"
                            isHighlight={true}
                        />
                        <MetricCard
                            title="AI 답변 해결 기여도"
                            value={`${metrics.value.aiResolution}%`}
                            desc="AI 답변만으로 해결된 비율"
                            progressBar={metrics.value.aiResolution}
                        />
                        <MetricCard
                            title="선배 답변 해결 기여도"
                            value={`${metrics.value.peerResolution}%`}
                            desc="선배 답변이 달렸을 때 해결률 (High Impact)"
                            progressBar={metrics.value.peerResolution}
                            status="good"
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}

// Sub-component for individual cards
const MetricCard = ({ title, value, sub, trend, trendValue, status, desc, progressBar, isHighlight }) => {
    const statusColor = status === 'good' ? '#10b981' : status === 'bad' ? '#ef4444' : '#f59e0b';

    return (
        <div className="metric-card" style={isHighlight ? { border: '2px solid #6366f1', background: '#e0e7ff' } : {}}>
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

                <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>{desc}</p>
            </div>
        </div>
    )
}

export default AdminDashboard
