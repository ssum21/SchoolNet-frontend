import React, { useEffect } from 'react'
import TrendChart from './TrendChart'
import '../styles/admin-dashboard.css'

/**
 * Metric Detail Modal
 * Opens when a user clicks a metric card.
 * Displays a trend chart and backend integration advice.
 */
const MetricDetailModal = ({ isOpen, onClose, metric }) => {
    if (!isOpen || !metric) return null;

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose])

    // Mock Trend Data (randomized based on current value for demo)
    const generateHistory = (value) => {
        const history = [];
        let current = parseFloat(value);
        for (let i = 0; i < 7; i++) {
            const change = (Math.random() - 0.5) * (current * 0.2);
            history.push(Math.round((current - change) * 10) / 10);
        }
        history.push(current); // Last point is current
        return history;
    }

    const historyData = metric.history || generateHistory(metric.value);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>

                <header className="modal-header">
                    <h2 className="modal-title">{metric.title}</h2>
                    <span className={`status-pill status-${metric.status}`}></span>
                </header>

                <div className="modal-body">
                    <div className="chart-section">
                        <h3 className="chart-title">최근 7일 트렌드</h3>
                        <TrendChart data={historyData} color={metric.status === 'bad' ? '#ef4444' : '#3b82f6'} />
                    </div>

                    <div className="metric-breakdown">
                        <div className="breakdown-item">
                            <span className="label">현재 값</span>
                            <span className="value">{metric.value}</span>
                        </div>
                        <div className="breakdown-item">
                            <span className="label">지난주 대비</span>
                            <span className={`value trend-${metric.trend === 'up' && metric.status === 'bad' ? 'down' : metric.trend}`}>
                                {metric.trend === 'up' ? '+' : '-'}{metric.trendValue}
                            </span>
                        </div>
                    </div>

                    {/* Backend Integration Advice Section */}
                    <div className="backend-advice-box">
                        <h4>🛠️ Backend Integration Guide</h4>
                        <p>
                            To connect this to your Spring Boot backend, please refer to the
                            <strong> <code>backend_integration_guide.md</code></strong> artifact.
                        </p>
                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
                            This guide includes:
                            <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                                <li><code>AdminMetricController</code> code</li>
                                <li><code>DashboardMetricsDTO</code> structure</li>
                                <li><code>MetricDTO</code> builder pattern</li>
                            </ul>
                        </div>
                        <code className="code-block">
                            GET /api/admin/metrics
                        </code>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MetricDetailModal
