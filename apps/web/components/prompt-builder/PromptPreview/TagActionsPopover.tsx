"use client"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  Edit3,
  PlusCircle,
  Trash2,
  ChevronDown,
  X,
  Check,
  ArrowRight,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ActiveTagInfo } from "../types"

interface TagActionsPopoverProps {
  activeTagInfo: ActiveTagInfo
  onClose: () => void
  onEditTextChange: (text: string) => void
  onAdvancedTextChange: (text: string) => void
  onEditSave: () => void
  onAdvancedSubmit: () => void
  onRegenerate: (tagIndex: number) => void
  onActionClick: (
    tagIndex: number,
    newMode: "explore" | "edit" | "advanced" | "confirmDelete" | null,
    partValue?: string,
    tagType?: string,
  ) => void
  onDeleteConfirm: () => void
  onMoreSuggestions: () => void
  onSuggestionClick: (tagIndex: number, suggestion: string) => void
}

export function TagActionsPopover({
  activeTagInfo,
  onClose,
  onEditTextChange,
  onAdvancedTextChange,
  onEditSave,
  onAdvancedSubmit,
  onRegenerate,
  onActionClick,
  onDeleteConfirm,
  onMoreSuggestions,
  onSuggestionClick,
}: TagActionsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        if (!(event.target as HTMLElement).closest(".prompt-tag-interactive-area")) {
          onClose()
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const {
    index,
    mode,
    editText,
    advancedText,
    isAdvancedProcessing,
    suggestions,
    isFetchingSuggestions,
    canFetchMoreSuggestions,
    currentTagTypeForExplore,
    currentTagValueForDelete,
  } = activeTagInfo

  return (
    <div
      ref={popoverRef}
      className="absolute top-full left-0 mt-1.5 w-max max-w-sm z-20 p-2 bg-[#D4D4D4] text-bg-primary rounded-md shadow-lg border border-black/10 space-y-2"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popover
    >
      {mode === "edit" ? (
        <div className="flex items-center gap-1">
          <Input
            type="text"
            placeholder="Type your custom value..."
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            className="h-8 text-xs bg-white border-gray-300 text-black placeholder:text-gray-500"
          />
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-black/10" onClick={onEditSave}>
            <Check className="h-4 w-4 text-status-success" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-black/10"
            onClick={() => onActionClick(index, null)}
          >
            <X className="h-4 w-4 text-status-error" />
          </Button>
        </div>
      ) : mode === "advanced" ? (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Input
              type="text"
              placeholder="Regenerate with constraints..."
              value={advancedText}
              onChange={(e) => onAdvancedTextChange(e.target.value)}
              className="h-8 text-xs bg-white border-gray-300 text-black placeholder:text-gray-500"
              disabled={isAdvancedProcessing}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-black/10"
              onClick={onAdvancedSubmit}
              disabled={isAdvancedProcessing}
            >
              {isAdvancedProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 text-accent-primary" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-600 px-1">💡 Try: "more vibrant" or "add vintage feel"</p>
        </div>
      ) : mode === "explore" ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 px-1">
            Explore suggestions for '{currentTagTypeForExplore}':
          </p>
          {isFetchingSuggestions && suggestions.length === 0 ? (
            <div className="flex items-center justify-center p-2 text-xs text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading suggestions...
            </div>
          ) : suggestions.length === 0 && !isFetchingSuggestions ? (
            <p className="text-xs text-gray-600 px-1">No suggestions available.</p>
          ) : (
            <ul className="space-y-1 max-h-40 overflow-y-auto px-1">
              {suggestions.map((sugg, suggIndex) => (
                <li
                  key={suggIndex}
                  onClick={() => onSuggestionClick(index, sugg)}
                  className="text-xs p-1.5 hover:bg-accent-primary/20 rounded cursor-pointer text-gray-800 hover:text-black"
                >
                  {sugg}
                </li>
              ))}
            </ul>
          )}
          {canFetchMoreSuggestions && !isFetchingSuggestions && (
            <Button
              size="sm"
              variant="ghost"
              className="w-full h-auto px-2 py-1.5 text-xs gap-1 hover:bg-black/10 text-gray-700"
              onClick={onMoreSuggestions}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Load More Suggestions
            </Button>
          )}
          {isFetchingSuggestions && suggestions.length > 0 && (
            <div className="flex items-center justify-center p-1 text-xs text-gray-600">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Loading more...
            </div>
          )}
          {!canFetchMoreSuggestions && !isFetchingSuggestions && suggestions.length > 0 && (
            <p className="text-xs text-center text-gray-500 pt-1">No more suggestions.</p>
          )}
        </div>
      ) : mode === "confirmDelete" ? (
        <div className="space-y-2 p-1">
          <p className="text-xs font-medium text-gray-800 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1.5 text-status-warning" />
            Delete tag "{currentTagValueForDelete}"?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-auto px-2 py-1 text-xs hover:bg-black/10 text-gray-700"
              onClick={() => onActionClick(index, null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-auto px-2 py-1 text-xs bg-status-error hover:bg-red-700 text-white"
              onClick={onDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        // Default view: Action buttons
        <div className="flex items-center justify-start gap-1 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            className="h-auto px-2 py-1 text-xs gap-1 hover:bg-black/10"
            onClick={() => onRegenerate(index)}
          >
            <Sparkles className="h-3 w-3" /> Regenerate
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-auto px-2 py-1 text-xs gap-1 hover:bg-black/10"
            onClick={() => onActionClick(index, "explore", editText, currentTagTypeForExplore)}
          >
            <Sparkles className="h-3 w-3" /> Explore
            <ChevronDown className={cn("h-3 w-3 transition-transform ml-0.5", mode === "explore" && "rotate-180")} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-auto px-2 py-1 text-xs gap-1 hover:bg-black/10"
            onClick={() => onActionClick(index, "edit", editText, currentTagTypeForExplore)}
          >
            <Edit3 className="h-3 w-3" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-auto px-2 py-1 text-xs gap-1 hover:bg-black/10"
            onClick={() => onActionClick(index, "advanced", editText, currentTagTypeForExplore)}
          >
            <PlusCircle className="h-3 w-3" /> Advanced
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-auto px-2 py-1 text-xs gap-1 hover:bg-red-500/20 text-status-error hover:text-red-700"
            onClick={() => onActionClick(index, "confirmDelete", editText, currentTagTypeForExplore)}
          >
            <Trash2 className="h-3 w-3" /> Delete
          </Button>
        </div>
      )}
    </div>
  )
}
