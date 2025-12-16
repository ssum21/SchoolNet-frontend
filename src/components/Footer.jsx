import { Link } from 'react-router-dom'
import '../styles/index.css' // Ensure basic styles are available

function Footer() {
    return (
        <footer className="site-footer" style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            borderTop: '1px solid #e2e8f0',
            marginTop: 'auto',
            color: '#64748b',
            fontSize: '0.875rem'
        }}>
            <div className="footer-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <p>&copy; {new Date().getFullYear()} SchoolNet. All rights reserved.</p>
                <div className="footer-links" style={{ marginTop: '0.5rem' }}>
                    <Link to="/admin/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.75rem' }}>
                        Admin
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
