import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ArticleBody({ source }: { source: string }) {
  return <div className="article-prose">
    <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
      h1: ({ children }) => <h2>{children}</h2>,
      img: ({ src, alt }) => <img src={src?.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src} alt={alt ?? ''} loading="lazy" decoding="async" />,
      table: ({ children }) => <div className="article-table"><table>{children}</table></div>,
    }}>{source}</Markdown>
  </div>
}
