import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return result.toString()
}

export function extractExcerpt(content: string, maxLength = 160): string {
  // Remove markdown syntax for excerpt
  const plainText = content
    .replace(/#{1,6}\s/g, "") // headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/\*(.+?)\*/g, "$1") // italic
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
    .replace(/!\[.+?\]\(.+?\)/g, "") // images
    .replace(/`(.+?)`/g, "$1") // inline code
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/\n+/g, " ") // newlines
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  return plainText.slice(0, maxLength).replace(/\s+\S*$/, "") + "..."
}
