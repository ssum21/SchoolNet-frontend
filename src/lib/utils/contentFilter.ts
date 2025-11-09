/**
 * 청소년 안전 커뮤니티를 위한 콘텐츠 필터링 유틸리티
 */

// 금지어 목록 (한국어 욕설 및 비속어)
const PROFANITY_LIST = [
  // 일반 욕설
  '시발', '씨발', '시팔', '씨팔', 'ㅅㅂ', 'ㅆㅂ', '개새', '개세', '병신', 'ㅂㅅ',
  '미친', '또라이', '지랄', 'ㅈㄹ', '개같은', '개소리', '개뻥', '좆', 'ㅈ같',
  '엿먹어', '닥쳐', '꺼져', '죽어', '뒤져', '느금', 'ㄴㄱㅁ',

  // 성적 비하/혐오
  '보지', 'ㅂㅈ', '자지', 'ㅈㅈ', '섹스', '색스', '야동', '성교',

  // 비하/차별 표현
  '장애', '병신', '애자', '왕따', '찐따', '급식', '틀딱', '한남', '한녀',
  '김치녀', '맘충', '틀딱충', '급식충',

  // 폭력적 표현
  '죽여', '패', '때려', '쳐죽', '때려죽'
]

// 변형 패턴 (띄어쓰기, 특수문자 등)
const PATTERN_VARIATIONS = [
  /[시씨][ㅂㅍ빡팔][ㄹㄴ]/g,  // 시발, 씨팔 등
  /ㅅㅂ|ㅆㅂ|ㅅ\s*ㅂ/g,         // ㅅㅂ 변형
  /병\s*신|ㅂ\s*ㅅ/g,           // 병신 변형
  /개\s*새|개\s*세/g,           // 개새 변형
  /[존좆]\s*나/g,               // 존나, 좆나
  /지\s*랄|ㅈ\s*ㄹ/g,           // 지랄 변형
]

// 경고성 단어 (욕설은 아니지만 조심해야 할 표현)
const WARNING_WORDS = [
  '바보', '멍청', '한심', '쓰레기', '재수없', '짜증', '열받', '화나'
]

/**
 * 텍스트에서 욕설 감지
 */
export interface FilterResult {
  isClean: boolean
  detectedWords: string[]
  severity: 'clean' | 'warning' | 'blocked'
  message?: string
}

export const detectProfanity = (text: string): FilterResult => {
  if (!text || text.trim() === '') {
    return { isClean: true, detectedWords: [], severity: 'clean' }
  }

  const lowerText = text.toLowerCase()
  const detectedWords: string[] = []

  // 1. 직접 금지어 검사
  for (const word of PROFANITY_LIST) {
    if (lowerText.includes(word.toLowerCase())) {
      detectedWords.push(word)
    }
  }

  // 2. 패턴 검사
  for (const pattern of PATTERN_VARIATIONS) {
    const matches = text.match(pattern)
    if (matches) {
      detectedWords.push(...matches)
    }
  }

  // 3. 경고성 단어 검사
  const warningDetected: string[] = []
  for (const word of WARNING_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      warningDetected.push(word)
    }
  }

  // 결과 반환
  if (detectedWords.length > 0) {
    return {
      isClean: false,
      detectedWords: Array.from(new Set(detectedWords)),
      severity: 'blocked',
      message: '부적절한 언어가 포함되어 있습니다. 서로 존중하는 표현을 사용해주세요. 🙏'
    }
  }

  if (warningDetected.length > 0) {
    return {
      isClean: true, // 경고지만 허용
      detectedWords: warningDetected,
      severity: 'warning',
      message: '조금 더 부드러운 표현을 사용하면 어떨까요? 😊'
    }
  }

  return {
    isClean: true,
    detectedWords: [],
    severity: 'clean'
  }
}

/**
 * 텍스트에서 욕설 마스킹 (***로 대체)
 */
export const maskProfanity = (text: string): string => {
  let maskedText = text

  // 금지어를 ***로 대체
  for (const word of PROFANITY_LIST) {
    const regex = new RegExp(word, 'gi')
    maskedText = maskedText.replace(regex, '*'.repeat(word.length))
  }

  // 패턴 매칭된 부분도 마스킹
  for (const pattern of PATTERN_VARIATIONS) {
    maskedText = maskedText.replace(pattern, (match) => '*'.repeat(match.length))
  }

  return maskedText
}

/**
 * AI 기반 문맥 분석 (향후 백엔드 API 연동)
 * 현재는 클라이언트 측 휴리스틱 기반
 */
export const analyzeContext = (text: string): {
  isBullying: boolean
  isHarassment: boolean
  toxicityScore: number
} => {
  const lowerText = text.toLowerCase()

  // 괴롭힘 패턴
  const bullyingPatterns = [
    /왕따|따돌|무시|싫어|꺼져|없어져/,
    /못생|뚱뚱|찐따|루저/,
    /네\s*탓|너\s*때문/
  ]

  // 협박/위협 패턴
  const harassmentPatterns = [
    /죽|때리|패|쳐죽|때려죽/,
    /신고|고소|경찰|신상/,
    /가만\s*안\s*둬|두고\s*봐/
  ]

  const isBullying = bullyingPatterns.some(p => p.test(lowerText))
  const isHarassment = harassmentPatterns.some(p => p.test(lowerText))

  // 독성 점수 계산 (0-100)
  let toxicityScore = 0

  // 욕설 감지
  const profanityResult = detectProfanity(text)
  toxicityScore += profanityResult.detectedWords.length * 20

  // 괴롭힘 패턴
  if (isBullying) toxicityScore += 30
  if (isHarassment) toxicityScore += 40

  // 대문자 비율 (소리지르기)
  const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length
  if (upperCaseRatio > 0.5) toxicityScore += 10

  // 느낌표 과다 사용
  const exclamationCount = (text.match(/!/g) || []).length
  if (exclamationCount > 3) toxicityScore += 5

  return {
    isBullying,
    isHarassment,
    toxicityScore: Math.min(100, toxicityScore)
  }
}

/**
 * 긍정적인 표현인지 확인
 */
export const isPositiveContent = (text: string): boolean => {
  const positiveWords = [
    '감사', '고마워', '도움', '친절', '좋아', '최고', '훌륭', '멋져',
    '응원', '파이팅', '화이팅', '축하', '잘했어', '대단해', '존경'
  ]

  const lowerText = text.toLowerCase()
  return positiveWords.some(word => lowerText.includes(word))
}

/**
 * 커뮤니티 가이드라인 메시지
 */
export const COMMUNITY_GUIDELINES = {
  title: '🌟 SchoolNet 커뮤니티 가이드라인',
  rules: [
    '서로 존중하는 표현을 사용해주세요',
    '욕설, 비하, 혐오 표현은 금지됩니다',
    '선배는 후배에게 친절하고 유익한 답변을 해주세요',
    '질문은 구체적이고 명확하게 작성해주세요',
    '개인정보는 절대 공유하지 마세요'
  ]
}
