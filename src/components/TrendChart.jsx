import React, { useState } from 'react'

/**
 * Custom SVG Trend Chart
 * Draws a smooth bezier curve for the given data points.
 * @param {number[]} data - Array of numerical values (e.g., [10, 20, 15...])
 * @param {string} color - Hex color for the line (default: #3b82f6)
 */
const TrendChart = ({ data, color = '#3b82f6', height = 200 }) => {
    const [hoverIndex, setHoverIndex] = useState(null)

    if (!data || data.length < 2) return null;

    const width = 600; // viewBox width
    const padding = 20;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Helper to map data point to SVG coordinate
    const getCoord = (value, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        // Invert Y because SVG 0 is top
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return [x, y];
    }

    // Generate Path Data (smooth bezier)
    const pathData = data.map((val, i) => {
        const [x, y] = getCoord(val, i);
        if (i === 0) return `M ${x},${y}`;

        // Control points for smoothing
        const [prevX, prevY] = getCoord(data[i - 1], i - 1);
        const midX = (prevX + x) / 2;
        return `C ${midX},${prevY} ${midX},${y} ${x},${y}`;
    }).join(' ');

    // Gradient Area Path
    const areaPathData = `${pathData} L ${width - padding},${height} L ${padding},${height} Z`;

    return (
        <div className="trend-chart-container" style={{ position: 'relative', width: '100%', height: `${height}px` }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid lines (simplified) */}
                {[0, 0.5, 1].map(p => {
                    const y = padding + (height - padding * 2) * p;
                    return <line key={p} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeDasharray="4" />
                })}

                {/* Area Fill */}
                <path d={areaPathData} fill="url(#chartGradient)" stroke="none" />

                {/* Line Stroke */}
                <path d={pathData} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />

                {/* Interactive Points */}
                {data.map((val, i) => {
                    const [x, y] = getCoord(val, i);
                    const isHover = hoverIndex === i;

                    return (
                        <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
                            {/* Invisible Hit Area */}
                            <circle cx={x} cy={y} r="15" fill="transparent" style={{ cursor: 'pointer' }} />

                            {/* Visible Dot */}
                            <circle
                                cx={x} cy={y} r={isHover ? 6 : 4}
                                fill="white" stroke={color} strokeWidth="2"
                                style={{ transition: 'all 0.2s' }}
                            />

                            {/* Tooltip */}
                            {isHover && (
                                <g>
                                    <rect x={x - 30} y={y - 45} width="60" height="30" rx="6" fill="#1e293b" />
                                    <text x={x} y={y - 25} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                                        {val}
                                    </text>
                                    {/* Triangle */}
                                    <path d={`M ${x},${y - 15} L ${x - 5},${y - 15} L ${x},${y - 10} L ${x + 5},${y - 15} Z`} fill="#1e293b" />
                                </g>
                            )}
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

export default TrendChart
