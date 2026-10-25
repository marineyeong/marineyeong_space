export type Chapter = 'observe' | 'connect' | 'reflect'
export type Article = { id: string; category: string; title: string; subtitle: string; date: string; body: string[]; quote?: string }

// The starter copy is intentionally labeled as demo content in the interface.
export const observations = [
  { id: 'moments', category: 'PERSONAL / OBSERVATION', title: '천천히 바라볼 때 보이는 것들', text: '익숙한 하루에도 빛과 색은 조금씩 다른 표정을 남깁니다. 잠시 멈춰 바라본 장면을 기록합니다.', tag: '빛 · 일상' },
  { id: 'details', category: 'TASTE / FRONTEND', title: '작은 차이가 만드는 경험', text: '간격과 반응의 작은 차이가 화면을 편안하게 만듭니다. 디테일이 경험에 미치는 영향을 살펴봅니다.', tag: '디테일 · UI' },
  { id: 'questions', category: 'UX / CURIOSITY', title: '왜 다시 누르고 싶을까?', text: '좋은 인터랙션에는 다음 행동을 기대하게 하는 이유가 있습니다. 그 마음이 생기는 순간을 관찰합니다.', tag: '인터랙션 · UX' },
  { id: 'fragments', category: 'READING / THOUGHTS', title: '오래 남아 있는 문장', text: '읽고 지나간 문장 가운데 오래 머무는 조각을 모읍니다. 지금의 생각과 어떻게 이어지는지 적어봅니다.', tag: '읽기 · 생각' },
]

export const articles: Record<Exclude<Chapter, 'observe'>, Article[]> = {
  connect: [
    { id: 'small-universe', category: 'MAKING / INTERACTION', title: '이 작은 우주를 설계한 과정', subtitle: '하나의 화면을 천천히 탐험하는 인터페이스', date: 'DEMO ARTICLE · 2026', body: ['이 글은 화면의 구조와 상호작용을 설명하기 위한 데모 원고입니다. 실제 프로젝트 경험이나 경력을 나타내지 않습니다.', '처음에는 세 가지 주제를 어떻게 한 화면에 담을지 고민했습니다. 독립된 페이지로 나누기보다 하나의 우주를 오가며 서로 다른 기록을 만나는 구조를 선택했습니다.', '중앙의 궤도는 이동을 위한 지도이고, 오른쪽의 챕터는 선택한 기록을 보여주는 자리입니다. 행성, 탭, 키보드 입력이 같은 상태를 바꾸도록 연결해 어디서 시작해도 탐색 흐름이 이어지도록 했습니다.'], quote: '좋은 인터페이스는 다음에 어디를 볼지 조용히 알려줍니다.' },
    { id: 'tiny-experiments', category: 'FRONTEND / EXPERIMENT', title: '인터랙션을 다듬는 작은 실험', subtitle: '움직임을 줄이고도 피드백을 남기는 방법', date: 'DEMO ARTICLE · 2026', body: ['이 글은 콘텐츠 구조를 확인하기 위한 데모 원고입니다.', '작은 움직임은 상태 변화가 일어났음을 알려주지만, 모든 동작이 애니메이션일 필요는 없습니다. 선택 상태의 색과 궤도의 각도가 함께 바뀌면 사용자는 현재 위치를 이해할 수 있습니다.', '키보드, 터치, 포인터가 같은 결과를 내도록 상태를 한 곳에서 관리했습니다. 움직임을 줄이도록 설정한 환경에서는 전환을 즉시 보여줍니다.'] },
  ],
  reflect: [
    { id: 'less-showing', category: 'DESIGN / NOTES', title: '덜 보여주기 위해 더 고민하기', subtitle: '화면에 남길 것과 여백으로 둘 것', date: 'DEMO ARTICLE · 2026', body: ['이 글은 개인의 실제 회고가 아닌 데모 원고입니다.', '무언가를 더하는 일은 쉽지만, 무엇을 남길지 정하는 일에는 맥락을 살펴보는 시간이 필요합니다. 장식이 시선을 빼앗는다면 그 장식은 이 세계에 꼭 필요한지 다시 묻게 됩니다.', '여백은 비어 있는 공간이 아니라 다음 발견을 기다리는 공간일 수 있습니다.'] },
    { id: 'lingering-thought', category: 'PERSONAL / READING', title: '최근 오래 남아 있는 생각', subtitle: '하루의 조각을 기록으로 옮기는 일', date: 'DEMO ARTICLE · 2026', body: ['이 글은 실제 개인 경험을 대신하지 않는 데모 원고입니다.', '짧은 기록은 생각의 끝이라기보다 시작에 가깝습니다. 시간이 지난 뒤 다시 읽으면 그때는 보이지 않던 연결이 생기기도 합니다.', '완성된 결론보다 질문을 보관해 두는 방식으로 기록을 이어가 봅니다.'] },
  ],
}
