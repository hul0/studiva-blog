"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Eye, Edit3, Maximize2, Minimize2 } from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview" | "split">("split")
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-border bg-card ${
        fullscreen ? "fixed inset-0 z-50" : "h-[600px]"
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode("write")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "write"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Write
          </button>
          <button
            onClick={() => setMode("preview")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "preview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => setMode("split")}
            className={`hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors md:inline-flex ${
              mode === "split"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            Split
          </button>
        </div>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground"
          aria-label="Toggle fullscreen"
        >
          {fullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Write pane */}
        {(mode === "write" || mode === "split") && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 resize-none bg-background p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
              mode === "split" ? "border-r border-border" : ""
            }`}
            placeholder="Write your blog content in Markdown...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item
- Another item

```javascript
const hello = 'world';
```

> Blockquote for callouts

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
"
            spellCheck={false}
          />
        )}

        {/* Preview pane */}
        {(mode === "preview" || mode === "split") && (
          <div
            className={`flex-1 overflow-y-auto p-6 ${
              mode === "split" ? "hidden md:block" : ""
            }`}
          >
            {value ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Start writing to see the preview...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-1.5">
        <span className="text-xs text-muted-foreground">Markdown</span>
        <span className="text-xs text-muted-foreground">
          {value.length} chars · {value.split(/\s+/).filter(Boolean).length}{" "}
          words
        </span>
      </div>
    </div>
  )
}
