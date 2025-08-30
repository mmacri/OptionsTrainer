import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Activity } from 'lucide-react';
import type { OptionsData } from './GreeksExplainer';
import { quickPresets, parameterTooltips } from '../lib/presets';

interface OptionsParametersProps {
  optionsData: OptionsData;
  onChange: (data: OptionsData) => void;
  onPreset: (data: OptionsData) => void;
}

export const OptionsParameters = ({
  optionsData,
  onChange,
  onPreset,
}: OptionsParametersProps) => {
  const ParameterSlider = (
    label: keyof OptionsData,
    min: number,
    max: number,
    step: number,
  ) => (
    <div className="mb-4" key={label}>
      <div className="flex justify-between mb-1">
        <span className="text-sm capitalize">
          {label.replace(/([A-Z])/g, ' $1')}
        </span>
        <span className="text-sm">{optionsData[label]}</span>
      </div>
      <Tooltip>
        <TooltipTrigger>
          <Slider
            aria-label={label}
            aria-valuetext={`${optionsData[label]}`}
            min={min}
            max={max}
            step={step}
            value={[optionsData[label]]}
            onValueChange={(v) => onChange({ ...optionsData, [label]: v[0] })}
          />
        </TooltipTrigger>
        <TooltipContent>
          <strong>{parameterTooltips[label].title}</strong>
          <p>{parameterTooltips[label].content}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <TooltipProvider>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Market Parameters & Option Pricing Inputs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ParameterSlider('currentPrice', 50, 200, 1)}
          {ParameterSlider('strikePrice', 50, 200, 5)}
          {ParameterSlider('premium', 0.5, 30, 0.25)}
          {ParameterSlider('daysToExpiry', 1, 365, 1)}
          {ParameterSlider('impliedVolatility', 5, 100, 1)}
          {ParameterSlider('interestRate', 0, 10, 0.1)}
          {ParameterSlider('dividendYield', 0, 5, 0.1)}
          <div className="flex gap-2 mt-4">
            {Object.entries(quickPresets).map(([k, v]) => (
              <Button key={k} onClick={() => onPreset(v)}>
                {k}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

