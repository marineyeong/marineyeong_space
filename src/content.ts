import articleEntries from 'virtual:articles'
import type { Article, ArticleChapter } from './types/content'
export type { Article, Chapter } from './types/content'

// The starter copy is intentionally labeled as demo content in the interface.
export const observations = [
  { id: 'moments', category: 'PERSONAL / OBSERVATION', title: '천천히 바라볼 때 보이는 것들', text: '익숙한 하루에도 빛과 색은 조금씩 다른 표정을 남깁니다. 잠시 멈춰 바라본 장면을 기록합니다.', tag: '빛 · 일상' },
  { id: 'details', category: 'TASTE / FRONTEND', title: '작은 차이가 만드는 경험', text: '간격과 반응의 작은 차이가 화면을 편안하게 만듭니다. 디테일이 경험에 미치는 영향을 살펴봅니다.', tag: '디테일 · UI' },
  { id: 'questions', category: 'UX / CURIOSITY', title: '왜 다시 누르고 싶을까?', text: '좋은 인터랙션에는 다음 행동을 기대하게 하는 이유가 있습니다. 그 마음이 생기는 순간을 관찰합니다.', tag: '인터랙션 · UX' },
  { id: 'fragments', category: 'READING / THOUGHTS', title: '오래 남아 있는 문장', text: '읽고 지나간 문장 가운데 오래 머무는 조각을 모읍니다. 지금의 생각과 어떻게 이어지는지 적어봅니다.', tag: '읽기 · 생각' },
]

export const articles: Record<ArticleChapter, Article[]> = {
  connect: articleEntries.filter((entry) => entry.published && entry.chapter === 'connect'),
  reflect: articleEntries.filter((entry) => entry.published && entry.chapter === 'reflect'),
}

// Vite supplies unpublished entries only to the local dev server for direct preview URLs.
export const findArticleById = (id: string | null) => articleEntries.find((entry) => entry.id === id) ?? null
