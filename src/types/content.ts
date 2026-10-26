export type Chapter = 'observe' | 'connect' | 'reflect'
export type ArticleChapter = Exclude<Chapter, 'observe'>

export type Article = {
  id: string
  chapter: ArticleChapter
  category: string
  title: string
  subtitle: string
  date: string
  demo: boolean
  published: boolean
  body: string
}
