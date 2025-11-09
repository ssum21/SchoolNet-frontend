import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'

/**
 * 카테고리 목록 컴포넌트
 * 학교별 카테고리 표시
 */
function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // TODO: 실제 schoolId 가져오기
      const schoolId = 1
      const response = await axios.get('/categories', {
        params: { schoolId }
      })
      setCategories(response.data)
      setLoading(false)
    } catch (error) {
      console.error('카테고리 로딩 실패:', error)
      // 에러 시 기본 카테고리 표시
      setCategories([
        { id: 1, name: '수학', icon: '📐', hasBot: true },
        { id: 2, name: '영어', icon: '🔤', hasBot: true },
        { id: 3, name: '과학', icon: '🔬', hasBot: false },
        { id: 4, name: '친구관계', icon: '👫', hasBot: false },
        { id: 5, name: '진로', icon: '🎯', hasBot: true }
      ])
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">카테고리 로딩 중...</div>
  }

  return (
    <div className="category-list">
      {categories.map(category => (
        <Link
          key={category.id}
          to={`/questions?categoryId=${category.id}`}
          className="category-card"
        >
          <div className="category-icon">{category.icon}</div>
          <div className="category-name">{category.name}</div>
          {category.hasBot && (
            <div className="bot-badge">🤖 AI</div>
          )}
        </Link>
      ))}
    </div>
  )
}

export default CategoryList
