"use client"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { AxisSelect } from "./AxisSelect"
import { useAxisOptions } from "./useAxisOptions"
import {
  mediumFamilies,
  mediumTypes as mediumTypesMap,
  subjectOptions,
  actionOptions,
  environmentOptions,
  styleFamilies,
  styleTypes as styleTypesMap,
} from "@/lib/prompt-data"
import type { ControlsState, Axis, OptionsMap } from "../types"

interface ControlsPanelProps {
  controls: ControlsState
  onControlChange: (axis: Axis, value: string) => void
  onGenerate: () => void
  isLoading: boolean
}

export function ControlsPanel({ controls, onControlChange, onGenerate, isLoading }: ControlsPanelProps) {
  const mediumTypeOptions = useAxisOptions(controls, "mediumFamily", mediumTypesMap as OptionsMap)
  const styleTypeOptions = useAxisOptions(controls, "styleFamily", styleTypesMap as OptionsMap)

  return (
    <aside className="p-6 border-r border-border-color overflow-y-auto bg-bg-secondary">
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold">Creative Direction</h2>
          <p className="text-sm text-white">Set your preferences or embrace randomness.</p>
        </div>
        <div className="space-y-4">
          <AxisSelect
            label="Medium Family"
            axis="mediumFamily"
            value={controls.mediumFamily}
            options={mediumFamilies}
            placeholder="Select a medium family"
            onChange={onControlChange}
          />
          <AxisSelect
            label="Medium Type"
            axis="mediumType"
            value={controls.mediumType}
            options={mediumTypeOptions}
            placeholder="Random from family"
            onChange={onControlChange}
            isSubAxis
            parentValue={controls.mediumFamily}
          />
          <AxisSelect
            label="Subject"
            axis="subject"
            value={controls.subject}
            options={subjectOptions}
            placeholder="Select a subject"
            onChange={onControlChange}
          />
          <AxisSelect
            label="Action"
            axis="action"
            value={controls.action}
            options={actionOptions}
            placeholder="Select an action"
            onChange={onControlChange}
          />
          <AxisSelect
            label="Environment"
            axis="environment"
            value={controls.environment}
            options={environmentOptions}
            placeholder="Select an environment"
            onChange={onControlChange}
          />
          <AxisSelect
            label="Style Family"
            axis="styleFamily"
            value={controls.styleFamily}
            options={styleFamilies}
            placeholder="Select a style family"
            onChange={onControlChange}
          />
          <AxisSelect
            label="Style Type"
            axis="styleType"
            value={controls.styleType}
            options={styleTypeOptions}
            placeholder="Random from family"
            onChange={onControlChange}
            isSubAxis
            parentValue={controls.styleFamily}
          />
        </div>
        <div className="pt-4">
          <Button
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-accent-primary to-accent-gradient-end text-text-primary hover:shadow-[0_10px_20px_rgba(124,58,237,0.3)] hover:from-accent-hover hover:to-purple-600"
            onClick={onGenerate}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />} Generate
            Prompt
          </Button>
          <p className="text-xs text-center mt-3 text-white">
            Details, lighting, and camera settings will be auto-generated.
          </p>
        </div>
      </div>
    </aside>
  )
}
