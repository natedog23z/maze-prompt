"use client"

import { useMemo } from "react"
import type { ControlsState, Option, OptionsMap, Axis } from "../types"

export function useAxisOptions(controls: ControlsState, parentAxis: Axis, optionsMap: OptionsMap): Option[] {
  return useMemo(() => {
    const parentValue = controls[parentAxis]
    if (parentValue && parentValue !== "random") {
      return optionsMap[parentValue] || []
    }
    return []
  }, [controls, parentAxis, optionsMap])
}
