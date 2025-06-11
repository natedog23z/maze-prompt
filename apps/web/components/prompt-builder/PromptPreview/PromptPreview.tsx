"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Copy, Save } from "lucide-react"
import { TagChip } from "./TagChip"
import { TagActionsPopover } from "./TagActionsPopover"
import { cn } from "@/lib/utils"
import type { GeneratedPromptData, ActiveTagInfo } from "../types"

interface PromptPreviewProps {
  generatedPrompt: GeneratedPromptData
  activeTagInfo: ActiveTagInfo | null
  onTagClick: (index: number, currentValue: string, tagType?: string) => void
  onCopy: () => void
  // Props for TagActionsPopover
  onClosePopover: () => void
  onEditTextChange: (text: string) => void
  onAdvancedTextChange: (text: string) => void
  onEditSave: () => void
  onAdvancedSubmit: () => void
  onRegenerateTag: (tagIndex: number) => void
  onTagActionClick: (
    tagIndex: number,
    newMode: "explore" | "edit" | "advanced" | "confirmDelete" | null,
    partValue?: string,
    tagType?: string,
  ) => void
  onDeleteTagConfirm: () => void
  onMoreSuggestions: () => void
  onSuggestionClick: (tagIndex: number, suggestion: string) => void
}

export function PromptPreview({
  generatedPrompt,
  activeTagInfo,
  onTagClick,
  onCopy,
  onClosePopover,
  onEditTextChange,
  onAdvancedTextChange,
  onEditSave,
  onAdvancedSubmit,
  onRegenerateTag,
  onTagActionClick,
  onDeleteTagConfirm,
  onMoreSuggestions,
  onSuggestionClick,
}: PromptPreviewProps) {
  return (
    <Card className="w-full max-w-4xl animate-in fade-in-50 duration-500 bg-bg-secondary border-border-color">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-border-color bg-bg-tertiary text-text-primary">
              <FileText className="h-4 w-4 mr-2" />
              {generatedPrompt.tokens} tokens
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onCopy}>
              <Copy className="h-4 w-4" /> Copy
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-lg leading-relaxed p-4 bg-bg-tertiary rounded-md mb-6">
          {generatedPrompt.parts.map((part, index) =>
            part.type === "tag" ? (
              <div key={index} className="relative inline-block">
                {" "}
                {/* Ensure this div is relative for popover positioning */}
                <TagChip part={part} index={index} isActive={activeTagInfo?.index === index} onClick={onTagClick} />
                {activeTagInfo?.index === index && (
                  <TagActionsPopover
                    activeTagInfo={activeTagInfo}
                    onClose={onClosePopover}
                    onEditTextChange={onEditTextChange}
                    onAdvancedTextChange={onAdvancedTextChange}
                    onEditSave={onEditSave}
                    onAdvancedSubmit={onAdvancedSubmit}
                    onRegenerate={onRegenerateTag}
                    onActionClick={onTagActionClick}
                    onDeleteConfirm={onDeleteTagConfirm}
                    onMoreSuggestions={onMoreSuggestions}
                    onSuggestionClick={onSuggestionClick}
                  />
                )}
              </div>
            ) : (
              <span key={index} className={cn((part.value === " (" || part.value === ") ") && "mx-0")}>
                {part.value}
              </span>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}
