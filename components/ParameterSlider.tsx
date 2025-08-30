import React from 'react';
import { Slider } from './ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import type { OptionsData } from './GreeksExplainer';
import { parameterTooltips } from '../lib/presets';

const displayConfig: Record<
  keyof OptionsData,
  { label: string; format: (v: number) => string; aria: (v: number) => string }
> = {
  currentPrice: {
    label: 'Current Stock Price',
    format: (v) => `$${v.toFixed(0)}`,
    aria: (v) => `Current stock price ${v} dollars`,
  },
  strikePrice: {
    label: 'Strike Price',
    format: (v) => `$${v.toFixed(0)}`,
    aria: (v) => `Strike price ${v} dollars`,
  },
  premium: {
    label: 'Premium',
    format: (v) => `$${v.toFixed(2)}`,
    aria: (v) => `Option premium ${v.toFixed(2)} dollars`,
  },
  daysToExpiry: {
    label: 'Days to Expiry',
    format: (v) => `${v} days`,
    aria: (v) => `${v} days to expiry`,
  },
  impliedVolatility: {
    label: 'Implied Volatility',
    format: (v) => `${v}%`,
    aria: (v) => `Implied volatility ${v} percent`,
  },
  interestRate: {
    label: 'Interest Rate',
    format: (v) => `${v}%`,
    aria: (v) => `Interest rate ${v} percent`,
  },
  dividendYield: {
    label: 'Dividend Yield',
    format: (v) => `${v}%`,
    aria: (v) => `Dividend yield ${v} percent`,
  },
};

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
      <span className="text-sm">{displayConfig[label].label}</span>
      <span className="text-sm">{displayConfig[label].format(value)}</span>
    </div>
    <Tooltip>
      <TooltipTrigger>
        <Slider
          aria-label={displayConfig[label].label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayConfig[label].aria(value)}
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
