"use client"
import { Dice5, Loader2 } from "lucide-react"

interface PromptSkeletonProps {
  isLoading: boolean
}

export function PromptSkeleton({ isLoading }: PromptSkeletonProps) {
  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground">
        <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-purple-500" />
        <h3 className="text-xl font-semibold text-foreground">Generating...</h3>
        <p>Crafting the perfect prompt for you.</p>
      </div>
    )
  }

  return (
    <div className="text-center text-muted-foreground">
      <Dice5 className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-semibold text-foreground">Ready to Create</h3>
      <p>Choose your creative direction or let Maze surprise you!</p>
    </div>
  )
}
