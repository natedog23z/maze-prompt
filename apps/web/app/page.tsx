"use client"

import { useState } from "react"
import { History, User, Wand2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ControlsPanel } from "@/components/prompt-builder/ControlsPanel/ControlsPanel"
import { PromptPreview } from "@/components/prompt-builder/PromptPreview/PromptPreview"
import { BreakdownGrid } from "@/components/prompt-builder/BreakdownGrid"
import { PromptSkeleton } from "@/components/prompt-builder/PromptSkeleton"
import { mediumFamilies, mediumTypes } from "@/lib/prompt-data"
import { mediumTechniques, initialGeneratedPromptExample, fetchExploreSuggestions } from "@/lib/prompt-generation-utils"
import type { ControlsState, GeneratedPromptData, ActiveTagInfo, Axis } from "@/components/prompt-builder/types"

const initialControls: ControlsState = {
  mediumFamily: "photography",
  mediumType: "film-photography",
  subject: "animals",
  action: "",
  environment: "city-urban",
  styleFamily: "",
  styleType: "",
}

export default function MazePage() {
  const [controls, setControls] = useState<ControlsState>(initialControls)
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPromptData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [activeTagInfo, setActiveTagInfo] = useState<ActiveTagInfo | null>(null)

  const handleControlChange = (axis: Axis, value: string) => {
    setControls((prev) => {
      const newControls = { ...prev, [axis]: value }
      if (axis === "mediumFamily" && prev.mediumFamily !== value) newControls.mediumType = ""
      if (axis === "styleFamily" && prev.styleFamily !== value) newControls.styleType = ""
      if (value === "random") newControls[axis] = "" // Keep random as a distinct state for UI
      return newControls
    })
  }

  const handleGenerate = () => {
    setIsLoading(true)
    setGeneratedPrompt(null)
    setActiveTagInfo(null) // Close popover on new generation
    setTimeout(() => {
      const newPromptData = JSON.parse(JSON.stringify(initialGeneratedPromptExample)) as GeneratedPromptData

      // Apply medium type specific technique
      const mediumTypeForTechnique =
        controls.mediumType || newPromptData.parts.find((p) => p.tagType === "medium")?.value || "default"
      const availableTechniques =
        mediumTechniques[mediumTypeForTechnique.replace(/ /g, "-")] || mediumTechniques.default
      const randomTechnique = availableTechniques[Math.floor(Math.random() * availableTechniques.length)]

      const techniquePartIndex = newPromptData.parts.findIndex((part) => part.tagType === "technique")
      if (techniquePartIndex !== -1) newPromptData.parts[techniquePartIndex].value = randomTechnique

      const techniqueBreakdownIndex = newPromptData.breakdown.findIndex((item) => item.label === "Medium Technique")
      if (techniqueBreakdownIndex !== -1) newPromptData.breakdown[techniqueBreakdownIndex].value = randomTechnique

      // Apply selected medium type or random if not set
      if (controls.mediumType && controls.mediumType !== "random") {
        const mediumPartIndex = newPromptData.parts.findIndex((part) => part.tagType === "medium")
        if (mediumPartIndex !== -1) newPromptData.parts[mediumPartIndex].value = controls.mediumType.replace(/-/g, " ")

        const mediumBreakdownIndex = newPromptData.breakdown.findIndex((item) => item.label === "Medium")
        if (mediumBreakdownIndex !== -1) {
          const familyLabel = mediumFamilies.find((f) => f.value === controls.mediumFamily)?.label || "Unknown"
          const typeLabel =
            mediumTypes[controls.mediumFamily as keyof typeof mediumTypes]?.find((t) => t.value === controls.mediumType)
              ?.label || controls.mediumType
          newPromptData.breakdown[mediumBreakdownIndex].value = `${familyLabel} → ${typeLabel}`
        }
      } else if (!controls.mediumType || controls.mediumType === "random") {
        const mediumFamilyControl =
          controls.mediumFamily && controls.mediumFamily !== "random" ? controls.mediumFamily : "photography"
        const typesForFamily = mediumTypes[mediumFamilyControl as keyof typeof mediumTypes] || []
        if (typesForFamily.length > 0) {
          const randomMediumType = typesForFamily[Math.floor(Math.random() * typesForFamily.length)].value
          const mediumPartIndex = newPromptData.parts.findIndex((part) => part.tagType === "medium")
          if (mediumPartIndex !== -1) newPromptData.parts[mediumPartIndex].value = randomMediumType.replace(/-/g, " ")

          const mediumBreakdownIndex = newPromptData.breakdown.findIndex((item) => item.label === "Medium")
          if (mediumBreakdownIndex !== -1) {
            const familyLabel = mediumFamilies.find((f) => f.value === mediumFamilyControl)?.label || "Unknown"
            const typeLabel = typesForFamily.find((t) => t.value === randomMediumType)?.label || randomMediumType
            newPromptData.breakdown[mediumBreakdownIndex].value = `${familyLabel} → ${typeLabel}`
          }
        }
      }
      // TODO: Apply other controls (subject, action, environment, style) similarly

      setGeneratedPrompt(newPromptData)
      setIsLoading(false)
    }, 1500)
  }

  const handleCopy = () => {
    if (!generatedPrompt) return
    const promptText = generatedPrompt.parts.map((p) => p.value).join("")
    navigator.clipboard.writeText(promptText)
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-status-success" />
          <span className="font-semibold">Copied to clipboard!</span>
        </div>
      ),
      className: "bg-bg-secondary border-border-color text-text-primary",
    })
  }

  const updatePromptTagValue = (tagIndex: number, newValue: string) => {
    if (!generatedPrompt) return
    const newParts = [...generatedPrompt.parts]
    newParts[tagIndex] = { ...newParts[tagIndex], value: newValue }

    const newBreakdown = [...generatedPrompt.breakdown]
    if (newParts[tagIndex].tagType === "technique") {
      const techniqueBreakdownIndex = newBreakdown.findIndex((item) => item.label === "Medium Technique")
      if (techniqueBreakdownIndex !== -1) newBreakdown[techniqueBreakdownIndex].value = newValue
    }
    // TODO: Update other breakdown items if necessary based on tagType

    setGeneratedPrompt((prev) => (prev ? { ...prev, parts: newParts, breakdown: newBreakdown } : null))
  }

  const handleTagClick = (tagIndex: number, currentValue: string, tagType?: string) => {
    const isSameTag = activeTagInfo?.index === tagIndex
    const isExploreMode = activeTagInfo?.mode === "explore"
    const isConfirmDeleteMode = activeTagInfo?.mode === "confirmDelete"

    if (isSameTag && !isExploreMode && !isConfirmDeleteMode) {
      if (activeTagInfo.mode) {
        setActiveTagInfo((prev) => ({
          ...prev!,
          mode: null,
          suggestions: [],
          isFetchingSuggestions: false,
          suggestionsOffset: 0,
          canFetchMoreSuggestions: false,
        }))
      } else {
        setActiveTagInfo(null)
      }
    } else if (isSameTag && (isExploreMode || isConfirmDeleteMode)) {
      setActiveTagInfo(null)
    } else {
      setActiveTagInfo({
        index: tagIndex,
        mode: null,
        editText: currentValue,
        advancedText: "",
        isAdvancedProcessing: false,
        suggestions: [],
        isFetchingSuggestions: false,
        suggestionsOffset: 0,
        canFetchMoreSuggestions: false,
        currentTagTypeForExplore: tagType,
        currentTagValueForDelete: currentValue,
      })
    }
  }

  const handleClosePopover = () => {
    setActiveTagInfo(null)
  }

  const handleEditTextChange = (text: string) => {
    setActiveTagInfo((prev) => (prev ? { ...prev, editText: text } : null))
  }

  const handleAdvancedTextChange = (text: string) => {
    setActiveTagInfo((prev) => (prev ? { ...prev, advancedText: text } : null))
  }

  const handleEditSave = () => {
    if (activeTagInfo && activeTagInfo.mode === "edit") {
      updatePromptTagValue(activeTagInfo.index, activeTagInfo.editText)
      setActiveTagInfo(null)
      toast({ title: "Tag Updated!", className: "bg-bg-secondary border-border-color text-text-primary" })
    }
  }

  const handleAdvancedSubmit = async () => {
    if (activeTagInfo && activeTagInfo.mode === "advanced" && !activeTagInfo.isAdvancedProcessing) {
      setActiveTagInfo((prev) => (prev ? { ...prev, isAdvancedProcessing: true } : null))
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      if (!activeTagInfo || !generatedPrompt) {
        // Check if still active
        setActiveTagInfo((prev) => (prev ? { ...prev, isAdvancedProcessing: false } : null))
        return
      }
      const currentTagInfo = activeTagInfo // Capture current state
      const originalValue = generatedPrompt.parts[currentTagInfo.index]?.value || "item"
      const constraint = currentTagInfo.advancedText
      const newSuggestion = `${originalValue} (adv: ${constraint} → AI variant)`

      updatePromptTagValue(currentTagInfo.index, newSuggestion)
      toast({
        title: "Advanced Suggestion Applied!",
        description: `Pill updated with AI suggestion for constraint: "${constraint}"`,
        className: "bg-bg-secondary border-border-color text-text-primary",
      })
      setActiveTagInfo(null) // Close popover
    }
  }

  const handleRegenerateTag = (tagIndex: number) => {
    if (!generatedPrompt) return
    const currentPart = generatedPrompt.parts[tagIndex]
    let regeneratedValue = `regenerated ${currentPart.value.substring(0, 10)}...`

    if (currentPart.tagType === "technique") {
      const currentMediumType =
        generatedPrompt.parts.find((p) => p.tagType === "medium")?.value.replace(/ /g, "-") || "default"
      const availableTechniques = mediumTechniques[currentMediumType] || mediumTechniques.default
      regeneratedValue = availableTechniques[Math.floor(Math.random() * availableTechniques.length)]
    }
    // TODO: Add regeneration logic for other tag types
    updatePromptTagValue(tagIndex, regeneratedValue)
    toast({ title: "Tag Regenerated!", className: "bg-bg-secondary border-border-color text-text-primary" })
  }

  const fetchAndSetSuggestions = async (tagType: string | undefined, offset: number, append = false) => {
    if (!tagType) return
    setActiveTagInfo((prev) =>
      prev ? { ...prev, isFetchingSuggestions: true, currentTagTypeForExplore: tagType } : null,
    )
    try {
      const { suggestions: fetchedSuggestions, hasMore } = await fetchExploreSuggestions(tagType, offset)
      setActiveTagInfo((prev) => {
        if (!prev || prev.currentTagTypeForExplore !== tagType) return prev // Stale request
        return {
          ...prev,
          suggestions: append ? [...prev.suggestions, ...fetchedSuggestions] : fetchedSuggestions,
          isFetchingSuggestions: false,
          suggestionsOffset: offset + fetchedSuggestions.length,
          canFetchMoreSuggestions: hasMore,
        }
      })
    } catch (error) {
      console.error("Failed to fetch suggestions:", error)
      toast({
        title: "Error fetching suggestions",
        variant: "destructive",
        className: "bg-bg-secondary border-border-color text-text-primary",
      })
      setActiveTagInfo((prev) => (prev ? { ...prev, isFetchingSuggestions: false } : null))
    }
  }

  const handleTagActionClick = (
    tagIndex: number,
    newMode: "explore" | "edit" | "advanced" | "confirmDelete" | null,
    partValue?: string,
    tagType?: string,
  ) => {
    setActiveTagInfo((prev) => {
      const isCurrentlyActiveTag = prev && prev.index === tagIndex
      const currentTagValue =
        partValue || (isCurrentlyActiveTag ? prev.editText : generatedPrompt?.parts[tagIndex]?.value || "")
      const currentTagType =
        tagType || (isCurrentlyActiveTag ? prev.currentTagTypeForExplore : generatedPrompt?.parts[tagIndex]?.tagType)

      if (newMode === "explore") {
        if (isCurrentlyActiveTag && prev.mode === "explore" && prev.currentTagTypeForExplore === currentTagType) {
          // Re-fetch for same tag type if already in explore mode (e.g. refresh)
          fetchAndSetSuggestions(currentTagType, 0, false)
          return {
            ...prev,
            suggestions: [],
            isFetchingSuggestions: true,
            suggestionsOffset: 0,
            canFetchMoreSuggestions: false,
          }
        }
        fetchAndSetSuggestions(currentTagType, 0, false)
        return {
          index: tagIndex,
          mode: "explore",
          editText: currentTagValue,
          advancedText: "",
          isAdvancedProcessing: false,
          suggestions: [],
          isFetchingSuggestions: true,
          suggestionsOffset: 0,
          canFetchMoreSuggestions: false,
          currentTagTypeForExplore: currentTagType,
          currentTagValueForDelete: currentTagValue,
        }
      }

      if (newMode === "confirmDelete") {
        return {
          ...(prev || {
            index: tagIndex,
            editText: currentTagValue,
            advancedText: "",
            suggestions: [],
            isFetchingSuggestions: false,
            suggestionsOffset: 0,
            canFetchMoreSuggestions: false,
          }), // Ensure base structure if prev is null
          index: tagIndex,
          mode: "confirmDelete",
          editText: currentTagValue, // Value to show in confirm message
          advancedText: isCurrentlyActiveTag ? prev!.advancedText : "",
          isAdvancedProcessing: isCurrentlyActiveTag ? prev!.isAdvancedProcessing : false,
          suggestions: [],
          isFetchingSuggestions: false,
          suggestionsOffset: 0,
          canFetchMoreSuggestions: false,
          currentTagTypeForExplore: currentTagType,
          currentTagValueForDelete: currentTagValue,
        }
      }

      // Toggle off if same mode is clicked again, or switch mode
      if (isCurrentlyActiveTag && prev.mode === newMode) {
        return {
          ...prev,
          mode: null,
          isAdvancedProcessing: false,
          suggestions: [],
          isFetchingSuggestions: false,
          suggestionsOffset: 0,
          canFetchMoreSuggestions: false,
        }
      }

      return {
        index: tagIndex,
        mode: newMode,
        editText: newMode === "edit" ? currentTagValue : isCurrentlyActiveTag ? prev!.editText : currentTagValue,
        advancedText:
          newMode === "advanced" && isCurrentlyActiveTag && prev!.mode === "advanced"
            ? prev!.advancedText
            : isCurrentlyActiveTag
              ? prev!.advancedText
              : "",
        isAdvancedProcessing:
          newMode === "advanced" && isCurrentlyActiveTag && prev!.mode === "advanced"
            ? prev!.isAdvancedProcessing
            : false,
        suggestions: [],
        isFetchingSuggestions: false,
        suggestionsOffset: 0,
        canFetchMoreSuggestions: false,
        currentTagTypeForExplore: currentTagType,
        currentTagValueForDelete: currentTagValue,
      }
    })
  }

  const handleDeleteTagConfirm = () => {
    if (!activeTagInfo || !generatedPrompt) return
    const { index: tagIndex } = activeTagInfo

    const newParts = [...generatedPrompt.parts]
    const partToDelete = newParts[tagIndex]

    // Special handling for technique tag with parentheses
    if (
      partToDelete.tagType === "technique" &&
      tagIndex > 0 &&
      tagIndex < newParts.length - 1 &&
      newParts[tagIndex - 1].type === "text" &&
      newParts[tagIndex - 1].value.trim() === "(" &&
      newParts[tagIndex + 1].type === "text" &&
      newParts[tagIndex + 1].value.trim() === ")"
    ) {
      newParts.splice(tagIndex - 1, 3) // Remove tag and parentheses
    } else {
      newParts.splice(tagIndex, 1) // Remove just the tag
      // TODO: Smartly adjust surrounding text/punctuation if needed
    }

    const newBreakdown = [...generatedPrompt.breakdown]
    // TODO: Update breakdown based on deleted tag type
    if (partToDelete.tagType === "technique") {
      const techniqueBreakdownIndex = newBreakdown.findIndex((item) => item.label === "Medium Technique")
      if (techniqueBreakdownIndex !== -1) newBreakdown[techniqueBreakdownIndex].value = "Not set"
    }

    const newTokens = newParts.reduce((acc, p) => acc + p.value.split(" ").length, 0) // Simplified token count

    setGeneratedPrompt({ ...generatedPrompt, parts: newParts, breakdown: newBreakdown, tokens: newTokens })
    toast({
      title: "Tag Deleted",
      description: `Tag '${partToDelete.value}' removed.`,
      className: "bg-bg-secondary border-border-color text-text-primary",
    })
    setActiveTagInfo(null)
  }

  const handleMoreSuggestions = () => {
    if (
      activeTagInfo &&
      activeTagInfo.mode === "explore" &&
      !activeTagInfo.isFetchingSuggestions &&
      activeTagInfo.canFetchMoreSuggestions &&
      activeTagInfo.currentTagTypeForExplore
    ) {
      fetchAndSetSuggestions(activeTagInfo.currentTagTypeForExplore, activeTagInfo.suggestionsOffset, true)
    }
  }

  const handleSuggestionClick = (tagIndex: number, suggestion: string) => {
    updatePromptTagValue(tagIndex, suggestion)
    setActiveTagInfo(null) // Close popover after selection
  }

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary font-sans">
      <header className="flex items-center justify-between px-6 py-3 border-b shrink-0 border-border-color bg-bg-secondary">
        <div className="flex items-center gap-2">
          <Wand2 className="h-7 w-7 text-purple-500" />
          <h1 className="text-xl font-bold tracking-tighter">Maze</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" /> History
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" /> Account
          </Button>
        </div>
      </header>
      <main className="grid md:grid-cols-[400px_1fr] flex-1 overflow-hidden">
        <ControlsPanel
          controls={controls}
          onControlChange={handleControlChange}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        <main className="p-6 lg:p-8 bg-bg-primary flex items-center justify-center overflow-y-auto">
          {!generatedPrompt && <PromptSkeleton isLoading={isLoading} />}
          {generatedPrompt && !isLoading && (
            <div className="w-full max-w-4xl space-y-6">
              <PromptPreview
                generatedPrompt={generatedPrompt}
                activeTagInfo={activeTagInfo}
                onTagClick={handleTagClick}
                onCopy={handleCopy}
                onClosePopover={handleClosePopover}
                onEditTextChange={handleEditTextChange}
                onAdvancedTextChange={handleAdvancedTextChange}
                onEditSave={handleEditSave}
                onAdvancedSubmit={handleAdvancedSubmit}
                onRegenerateTag={handleRegenerateTag}
                onTagActionClick={handleTagActionClick}
                onDeleteTagConfirm={handleDeleteTagConfirm}
                onMoreSuggestions={handleMoreSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />
              <BreakdownGrid breakdown={generatedPrompt.breakdown} />
            </div>
          )}
        </main>
      </main>
    </div>
  )
}
