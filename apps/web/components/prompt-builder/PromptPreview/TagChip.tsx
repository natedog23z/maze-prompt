"use client"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PromptPart } from "../types"

interface TagChipProps {
  part: PromptPart
  index: number
  isActive: boolean
  onClick: (index: number, currentValue: string, tagType?: string) => void
}

export function TagChip({ part, index, isActive, onClick }: TagChipProps) {
  if (part.type !== "tag") return null

  return (
    <div className="relative inline-block mx-0.5 my-1 prompt-tag-interactive-area align-middle">
      <Badge
        onClick={() => onClick(index, part.value, part.tagType)}
        variant="secondary"
        className={cn(
          "cursor-pointer transition-all bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] border-border-color hover:border-accent-primary text-text-primary group-hover:text-text-primary",
          "py-1.5 px-3 text-sm",
          isActive && "bg-accent-primary/30 border-accent-primary",
        )}
      >
        <span className="text-text-secondary mr-1.5 text-xs">{part.tagType}:</span>
        <span className="font-medium text-sm">{part.value}</span>
        {!isActive && (
          <Sparkles className="h-3.5 w-3.5 ml-2 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </Badge>
    </div>
  )
}
