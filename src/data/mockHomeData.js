/**
 * 홈 페이지용 더미 데이터 생성기
 * - 실제 한국 중학생 스타일 닉네임 14명
 * - 최근 3주간의 풍부한 데이터
 */

// 14명의 회원 닉네임 (중학생 감성)
const MEMBERS = [
    '급식대장', '수학포기자', '아이돌지망생', '롤다이아',
    '민초단장', '시험기간', '잠만보', '떡볶이러버',
    '축구부에이스', '공부의신', '새벽감성', '마라탕중독',
    '편의점알바', '방구석코난'
];

// 카테고리 목록
const CATEGORIES = ['수학', '영어', '과학', '국어', '친구관계', '학교생활', '공부법', '취미', '연애상담'];

// 무작위 정수 생성
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 무작위 요소 선택
const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

// 날짜 포맷팅 (예: "3시간 전", "2일 전")
const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
};

// 더미 게시글 제목/내용 생성 템플릿
const POST_TEMPLATES = [
    { title: '중학교 수학 문제 도와주세요 🔥', content: '이차방정식 푸는 방법을 모르겠어요. 근의 공식은 어떻게 사용하나요?' },
    { title: '친구관계 고민이 있어요', content: '요즘 친구들과 잘 지내는 방법이 궁금해요. 조언 부탁드려요!' },
    { title: '영어 단어 암기 꿀팁 공유합니다', content: '제가 쓰던 영어 단어 암기법을 공유해요. 정말 효과적이에요!' },
    { title: '과학 수행평가 주제 추천좀요', content: '물리 관련해서 실험하기 좋은 주제 있을까요? 급합니다 ㅠㅠ' },
    { title: '오늘 급식 메뉴 대박임', content: '오늘 스파게티랑 치킨 나온대요!! 다들 급식실로 뛰어~~' },
    { title: '체육대회 반티 추천해주세요', content: '우리 반 무슨 옷 입을지 고민중인데 추천 좀 해주세요. 튀는 걸로!' },
    { title: '시험 3주 남았는데 공부 안 함', content: '저 어떡하죠? 지금부터 하면 평균 80 가능할까요?' },
    { title: '요즘 유행하는 게임 뭐임?', content: '할만한 모바일 게임 추천 좀 해주세요. 심심해요.' },
    { title: '학원 숙제 너무 많아 ㅠㅠ', content: '진짜 학원 끊고 싶다.. 다들 학원 몇 개 다녀요?' },
    { title: '선배님들 고등학교 어디가 좋아요?', content: '인문계랑 특성화고 중에 고민중입니다. 조언 부탁드려요.' },
    { title: '짝남한테 고백하는 법', content: '같은 반 남자애인데 어떻게 다가가는 게 좋을까요? 떨려요..' },
    { title: '나만 수행평가 망한 거 아니지?', content: '국어 수행평가 진짜 역대급으로 어려웠음... 다들 잘 봄?' },
    { title: '편의점 꿀조합 추천', content: '불닭이랑 뭐랑 먹어야 제일 맛있나요? 추천 ㄱㄱ' },
    { title: '다음 주 수련회 간다!!', content: '장기자랑 뭐 할지 정해야 되는데 아이디어 좀 주세요 ㅋㅋ' },
    { title: '부모님이랑 싸웠어요..', content: '성적 때문에 혼났는데 너무 서러워요. 위로 좀 해주세요.' }
];

// 게시글 생성 함수
const generatePosts = (count, type = 'general') => {
    const posts = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const template = getRandomItem(POST_TEMPLATES);
        const author = getRandomItem(MEMBERS);
        const category = getRandomItem(CATEGORIES);

        // 3주 (21일) 이내의 랜덤 날짜
        // 최신(new) 탭일 경우 3시간 이내로 제한
        const maxTimeAgo = type === 'new' ? 3 * 60 * 60 * 1000 : 21 * 24 * 60 * 60 * 1000;
        const randomTimeAgo = Math.floor(Math.random() * maxTimeAgo);
        const createdAtDate = new Date(now.getTime() - randomTimeAgo);

        // 뷰, 답변, 추천 수 랜덤 생성
        // 인기(hot/trending) 탭일 경우 더 높은 수치
        const multiplier = (type === 'hot' || type === 'trending') ? 5 : 1;
        const viewCount = getRandomInt(10, 100) * multiplier;
        const answerCount = getRandomInt(0, 20) * multiplier;
        const upvotes = getRandomInt(0, 30) * multiplier;

        posts.push({
            id: i + 1 + (Math.random() * 10000), // 유니크 ID 시뮬레이션
            title: template.title,
            content: template.content,
            authorName: author,
            categoryName: category,
            viewCount: viewCount,
            answerCount: answerCount,
            upvotes: upvotes,
            createdAt: formatTimeAgo(createdAtDate),
            isHot: type === 'hot' || (type === 'general' && upvotes > 50),
            isNew: type === 'new' || (randomTimeAgo < 3 * 60 * 60 * 1000), // 3시간 이내면 New
            isTrending: type === 'trending',
            isSenior: author === '공부의신' || author === '이선배' // 특정 유저는 선배로 표시
        });
    }

    return posts.sort((a, b) => {
        // 최신순 정렬 시뮬레이션 (날짜 파싱이 어려우므로 단순화된 로직 사용 혹은 생성 순서 유지)
        // 여기서는 간단히 랜덤 셔플된 상태로 둠, 실제로는 날짜 포맷팅 전 원본 Date로 정렬해야 함
        // 하지만 formatTimeAgo가 문자열을 반환하므로, 대략적으로 '분 전'이 '시간 전'보다 위로 오게 할 수 있음
        return 0;
    });
};

export const getMockData = () => {
    return {
        hot: generatePosts(15, 'hot'),
        new: generatePosts(15, 'new'),
        trending: generatePosts(15, 'trending')
    };
};

export const getTrendingTopics = () => {
    return [
        { id: 1, name: '기말고사', count: 128, trend: 'up' },
        { id: 2, name: '겨울방학', count: 95, trend: 'up' },
        { id: 3, name: '수학수행', count: 64, trend: 'same' },
        { id: 4, name: '크리스마스', count: 58, trend: 'up' },
        { id: 5, name: '급식메뉴', count: 42, trend: 'down' },
        { id: 6, name: '붕어빵', count: 35, trend: 'up' }
    ];
};

export const MEMBER_COUNT = 14;
