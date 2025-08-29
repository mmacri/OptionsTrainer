import React from "react";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import type { OptionsData } from "./GreeksExplainer";
import { parameterTooltips } from "./config";

interface ParameterSliderProps {
  label: keyof OptionsData;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm capitalize">{label}</span>
      <span className="text-sm">{value.toFixed(step < 1 ? 2 : 0)}</span>
    </div>
    <Tooltip>
      <TooltipTrigger>
        <Slider
          aria-label={label}
          aria-valuetext={`${value}`}
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={(v) => onChange(Number(v))}
        />
      </TooltipTrigger>
      <TooltipContent>
        <strong>{parameterTooltips[label].title}</strong>
        <p>{parameterTooltips[label].content}</p>
      </TooltipContent>
    </Tooltip>
  </div>
);

export default ParameterSlider;
