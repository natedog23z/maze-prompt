"use client"
import type { PromptBreakdownItem } from "./types"

interface BreakdownGridProps {
  breakdown: PromptBreakdownItem[]
}

export function BreakdownGrid({ breakdown }: BreakdownGridProps) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-4">Component Breakdown</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {breakdown.map((item) => (
          <div key={item.label} className="p-3 bg-bg-tertiary rounded-md border-border-color">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
            <p className="text-sm font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
