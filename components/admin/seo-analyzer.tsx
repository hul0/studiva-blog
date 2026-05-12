"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface SEOAnalyzerProps {
  title: string
  excerpt: string
  content: string
}

export function SEOAnalyzer({ title, excerpt, content }: SEOAnalyzerProps) {
  const [stats, setStats] = React.useState({
    titleLength: 0,
    excerptLength: 0,
    wordCount: 0,
    hasImages: false,
    hasLinks: false,
    hasHeadings: false,
  })

  React.useEffect(() => {
    setStats({
      titleLength: title.length,
      excerptLength: excerpt.length,
      wordCount: content.trim().split(/\s+/).filter(Boolean).length,
      hasImages: /!\[.*?\]\(.*?\)/.test(content),
      hasLinks: /\[.*?\]\(.*?\)/.test(content),
      hasHeadings: /^#{1,6}\s/m.test(content),
    })
  }, [title, excerpt, content])

  const checks = [
    {
      label: "Title Length",
      value: `${stats.titleLength} / 60`,
      status: stats.titleLength >= 30 && stats.titleLength <= 60 ? "success" : stats.titleLength > 60 ? "error" : "warning",
      info: "Ideal length is 30-60 characters.",
    },
    {
      label: "Excerpt Length",
      value: `${stats.excerptLength} / 160`,
      status: stats.excerptLength >= 120 && stats.excerptLength <= 160 ? "success" : stats.excerptLength > 160 ? "error" : "warning",
      info: "Ideal length is 120-160 characters for snippets.",
    },
    {
      label: "Word Count",
      value: stats.wordCount,
      status: stats.wordCount >= 300 ? "success" : "warning",
      info: "Aim for at least 300 words for better ranking.",
    },
    {
      label: "Images",
      value: stats.hasImages ? "Yes" : "No",
      status: stats.hasImages ? "success" : "warning",
      info: "Images improve engagement and SEO.",
    },
    {
      label: "Internal/External Links",
      value: stats.hasLinks ? "Yes" : "No",
      status: stats.hasLinks ? "success" : "warning",
      info: "Linking to related content helps crawlers.",
    },
    {
      label: "Headings (H1-H6)",
      value: stats.hasHeadings ? "Yes" : "No",
      status: stats.hasHeadings ? "success" : "error",
      info: "Use headings to structure your content.",
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        SEO Analyzer
      </h3>
      <div className="space-y-4">
        {checks.map((check) => (
          <div key={check.label} className="group relative space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground/70">{check.label}</span>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "text-[10px] font-bold",
                  check.status === "success" ? "text-green-500" :
                  check.status === "error" ? "text-red-500" : "text-yellow-600"
                )}>
                  {check.value}
                </span>
                {check.status === "success" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : check.status === "error" ? (
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  <Info className="h-3.5 w-3.5 text-yellow-600" />
                )}
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/50">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  check.status === "success" ? "bg-green-500" :
                  check.status === "error" ? "bg-red-500" : "bg-yellow-500"
                )}
                style={{ width: `${Math.min(100, (typeof check.value === 'number' ? check.value / 3 : parseInt(String(check.value).split('/')[0]) / (parseInt(String(check.value).split('/')[1]) || 100) * 100))}%` }}
              />
            </div>
            <p className="hidden text-[10px] text-muted-foreground group-hover:block">
              {check.info}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
