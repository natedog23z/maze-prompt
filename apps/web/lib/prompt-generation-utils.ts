import type { GeneratedPromptData } from "@/components/prompt-builder/types"

export const mediumTechniques = {
  "3d": ["modeling", "texturing", "lighting"],
  "2d": ["painting", "drawing", "composition"],
  vector: ["shapes", "paths", "typography"],
  painting: ["brushwork", "color", "texture"],
  drawing: ["line", "shading", "perspective"],
  sculpture: ["form", "material", "space"],
  collage: ["layering", "composition", "texture"],
  assemblage: ["found objects", "composition", "meaning"],
  installation: ["space", "interaction", "concept"],
}

export const initialGeneratedPromptExample: GeneratedPromptData = {
  tokens: 0,
  parts: [],
  breakdown: [],
}

export async function fetchExploreSuggestions(tagType: string, offset: number = 0): Promise<string[]> {
  // This is a placeholder - in a real app, this would call your backend API
  return []
} 