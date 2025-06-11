export type Axis = "mediumFamily" | "mediumType" | "subject" | "action" | "environment" | "styleFamily" | "styleType"

export interface ControlsState {
  [key: string]: string // Allow for other string keys if necessary, but primarily Axis
  mediumFamily: string
  mediumType: string
  subject: string
  action: string
  environment: string
  styleFamily: string
  styleType: string
}

export interface PromptPart {
  type: "text" | "tag"
  value: string
  tagType?: string
}

export interface PromptBreakdownItem {
  label: string
  value: string
}

export interface GeneratedPromptData {
  tokens: number
  parts: PromptPart[]
  breakdown: PromptBreakdownItem[]
}

export interface ActiveTagInfo {
  index: number
  mode: "explore" | "edit" | "advanced" | "confirmDelete" | null
  editText: string
  advancedText: string
  isAdvancedProcessing?: boolean
  suggestions: string[]
  isFetchingSuggestions: boolean
  suggestionsOffset: number
  canFetchMoreSuggestions: boolean
  currentTagTypeForExplore?: string
  currentTagValueForDelete?: string
}

export interface Option {
  value: string
  label: string
}

export interface OptionsMap {
  [key: string]: Option[]
}
