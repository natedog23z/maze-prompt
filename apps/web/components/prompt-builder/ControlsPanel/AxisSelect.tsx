"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dice5, CheckCircle2 } from "lucide-react"
import type { Axis, Option } from "../types"

interface AxisSelectProps {
  label: string
  axis: Axis
  value: string
  options: Option[]
  placeholder: string
  onChange: (axis: Axis, value: string) => void
  isSubAxis?: boolean
  parentValue?: string
}

export function AxisSelect({
  label,
  axis,
  value,
  options,
  placeholder,
  onChange,
  isSubAxis = false,
  parentValue,
}: AxisSelectProps) {
  if (isSubAxis && (!parentValue || parentValue === "random")) {
    return null
  }

  const controlDisplay = (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={axis} className="text-sm font-medium text-white">
          {label}
        </Label>
        {value && value !== "random" ? (
          <Badge variant="outline" className="border-status-success text-status-success bg-status-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Set
          </Badge>
        ) : (
          <Badge variant="outline" className="border-accent-primary text-accent-primary bg-accent-primary/20">
            <Dice5 className="h-3 w-3 mr-1" /> Random
          </Badge>
        )}
      </div>
      <div className="relative flex items-center">
        <Select value={value} onValueChange={(val) => onChange(axis, val)}>
          <SelectTrigger id={axis} className="w-full pr-10">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-bg-secondary border-border-color text-text-primary">
            <SelectItem value="random" className="focus:bg-accent-primary/20">
              Random Selection
            </SelectItem>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="focus:bg-accent-primary/20">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-secondary hover:text-text-primary"
          onClick={() => onChange(axis, "")} // "" implies random for parent, or clear for sub-axis
          aria-label={`Randomize ${label}`}
        >
          <Dice5 className="h-5 w-5" />
        </div>
      </div>
    </div>
  )

  if (isSubAxis) {
    return <div className="pl-4 border-l-2 border-muted ml-4">{controlDisplay}</div>
  }

  return controlDisplay
}
