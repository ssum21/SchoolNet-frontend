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
                        <p>To connect this metric to your real backend:</p>
                        <code className="code-block">
                            GET /api/admin/metrics/{metric.id || 'metric_key'}
                        </code>
                        <ul className="advice-list">
                            <li><strong>Database:</strong> Ensure your DB logs `{metric.title.split(' ')[0]}` events with timestamps.</li>
                            <li><strong>Aggregation:</strong> Use a cron job/scheduled task to aggregate daily values into a `metrics_daily` table to speed up this chart query.</li>
                            <li><strong>Real-time:</strong> For live updates, consider using WebSocket or SSE (Server-Sent Events) for the dashboard.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MetricDetailModal
