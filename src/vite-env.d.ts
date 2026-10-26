/// <reference types="vite/client" />

declare module 'virtual:articles' {
  const articles: import('./types/content').Article[]
  export default articles
}
