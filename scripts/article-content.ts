import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative, sep } from 'node:path'
import { parse } from 'yaml'
import type { Plugin } from 'vite'
import type { Article, ArticleChapter } from '../src/types/content.ts'

const moduleName = 'virtual:articles'
const moduleId = `\0${moduleName}`
const contentRoot = fileURLToPath(new URL('../content/articles/', import.meta.url))
const chapterNames: ArticleChapter[] = ['connect', 'reflect']

function readArticle(path: string, chapter: ArticleChapter, id: string, includeDrafts: boolean): Article | null {
  const fail = (message: string): never => { throw new Error(`[articles] ${relative(contentRoot, path)}: ${message}`) }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail('파일 이름은 영문 소문자·숫자·하이픈으로 작성하세요.')
  const source = readFileSync(path, 'utf8').replace(/^\uFEFF/, '')
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(source)
  if (!match) fail('파일 맨 위에 ---로 둘러싼 메타데이터가 필요합니다.')
  let metadata: unknown
  try { metadata = parse(match![1]) } catch (error) { fail(`메타데이터 형식 오류: ${String(error)}`) }
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) fail('메타데이터는 이름: 값 형태여야 합니다.')
  const fields = metadata as Record<string, unknown>
  if (typeof fields.published !== 'boolean') fail('published는 true 또는 false여야 합니다.')
  if (!fields.published && !includeDrafts) return null
  const text = (key: string): string => {
    const value = fields[key]
    if (typeof value !== 'string' || !value.trim()) return fail(`${key}에 빈 문자열이 아닌 텍스트가 필요합니다.`)
    return value.trim()
  }
  const date = text('date')
  const parsedDate = new Date(`${date}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) fail('date는 실제 날짜를 YYYY-MM-DD 형식으로 작성하세요.')
  if (fields.demo !== undefined && typeof fields.demo !== 'boolean') fail('demo는 true 또는 false여야 합니다.')
  const body = match![2].trim()
  if (!body) fail('공개할 글의 본문이 비어 있습니다.')
  return { id, chapter, title: text('title'), subtitle: text('subtitle'), category: text('category'), date, published: fields.published === true, demo: fields.demo === true, body }
}

/** Parse at build time: browser bundles contain published articles, not draft text or YAML parsing code. */
export function articleContent(): Plugin {
  let includeDrafts = false
  return {
    name: 'world-markdown-articles',
    configResolved(config) { includeDrafts = config.command === 'serve' },
    resolveId(id) { if (id === moduleName) return moduleId },
    load(id) {
      if (id !== moduleId) return
      const articles: Article[] = []
      const ids = new Set<string>()
      for (const chapter of chapterNames) {
        const directory = join(contentRoot, chapter)
        for (const file of readdirSync(directory, { withFileTypes: true })) {
          if (!file.isFile() || !file.name.endsWith('.md')) continue
          const path = join(directory, file.name)
          this.addWatchFile(path)
          const article = readArticle(path, chapter, file.name.slice(0, -3), includeDrafts)
          if (!article) continue
          if (ids.has(article.id)) throw new Error(`[articles] 중복된 글 파일 이름: ${article.id}`)
          ids.add(article.id)
          articles.push(article)
        }
      }
      articles.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
      return `export default ${JSON.stringify(articles)}`
    },
    configureServer(server) {
      server.watcher.add(contentRoot)
      const reload = (path: string) => {
        if (!path.startsWith(contentRoot.endsWith(sep) ? contentRoot : contentRoot + sep) || !path.endsWith('.md')) return
        const module = server.moduleGraph.getModuleById(moduleId)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', reload).on('change', reload).on('unlink', reload)
      server.httpServer?.once('close', () => {
        server.watcher.off('add', reload).off('change', reload).off('unlink', reload)
      })
    },
  }
}
