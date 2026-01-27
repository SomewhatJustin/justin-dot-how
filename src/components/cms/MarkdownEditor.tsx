"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { useEffect } from "react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

// Simple markdown conversion for TipTap
function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i>(.*?)<\/i>/gi, "*$1*")
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    .replace(/<a href="(.*?)">(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<ul>/gi, "")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<ol>/gi, "")
    .replace(/<\/ol>/gi, "\n")
    .replace(/<li><p>(.*?)<\/p><\/li>/gi, "- $1\n")
    .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<blockquote><p>(.*?)<\/p><\/blockquote>/gi, "> $1\n\n")
    .replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n")
    .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim()
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`(.*?)`/gim, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(new RegExp("(<li>.*</li>)", "s"), "<ul>$1</ul>")
    .replace(/^> (.*$)/gim, "<blockquote><p>$1</p></blockquote>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(.+)$/gm, (match) => {
      if (
        match.startsWith("<h") ||
        match.startsWith("<ul") ||
        match.startsWith("<li") ||
        match.startsWith("<blockquote") ||
        match.startsWith("<p") ||
        match.startsWith("</")
      ) {
        return match
      }
      return `<p>${match}</p>`
    })
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: markdownToHtml(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(htmlToMarkdown(html))
    },
    editorProps: {
      attributes: {
        class: "admin-editor-content",
      },
    },
  })

  useEffect(() => {
    if (editor && !editor.isFocused) {
      const currentHtml = editor.getHTML()
      const newHtml = markdownToHtml(value)
      if (htmlToMarkdown(currentHtml) !== value) {
        editor.commands.setContent(newHtml)
      }
    }
  }, [value, editor])

  if (!editor) {
    return (
      <div className="admin-editor">
        <div className="admin-editor-content" style={{ color: "#333" }}>
          loading...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`admin-editor-btn ${editor.isActive("bold") ? "active" : ""}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`admin-editor-btn ${editor.isActive("italic") ? "active" : ""}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`admin-editor-btn ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`admin-editor-btn ${editor.isActive("heading", { level: 3 }) ? "active" : ""}`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`admin-editor-btn ${editor.isActive("bulletList") ? "active" : ""}`}
        >
          list
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`admin-editor-btn ${editor.isActive("blockquote") ? "active" : ""}`}
        >
          quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`admin-editor-btn ${editor.isActive("codeBlock") ? "active" : ""}`}
        >
          code
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("url:")
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`admin-editor-btn ${editor.isActive("link") ? "active" : ""}`}
        >
          link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
