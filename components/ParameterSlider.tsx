import React from 'react';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { HelpCircle } from 'lucide-react';
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
    format: (v) => `${v}d`,
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

const parameterCalculations: Record<keyof OptionsData, (data: OptionsData) => string> = {
  currentPrice: (d) => `Diff to strike: $${(d.currentPrice - d.strikePrice).toFixed(2)}`,
  strikePrice: (d) => `Break-even: $${(d.strikePrice + d.premium).toFixed(2)}`,
  premium: (d) => `Break-even: $${(d.strikePrice + d.premium).toFixed(2)}`,
  daysToExpiry: (d) => `${(d.daysToExpiry / 365).toFixed(2)} yrs`,
  impliedVolatility: (d) => `σ ${d.impliedVolatility}%`,
  interestRate: (d) => `${d.interestRate}% annual`,
  dividendYield: (d) => `${d.dividendYield}% annual`,
};

interface ParameterSliderProps {
  label: keyof OptionsData;
  optionsData: OptionsData;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  optionsData,
  min,
  max,
  step,
  onChange,
}) => {
  const value = optionsData[label];
  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between">
        <span className="flex items-center gap-1">
          {displayConfig[label].label}
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-96 p-4">
              <div className="space-y-2">
                <p className="font-semibold text-base">
                  {parameterTooltips[label].title}
                </p>
                <p className="text-sm">{parameterTooltips[label].content}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </span>
        <Badge variant="outline" className="text-sm font-mono">
          {displayConfig[label].format(value)}
        </Badge>
      </label>
      <Slider
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
        aria-label={displayConfig[label].label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayConfig[label].aria(value)}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{displayConfig[label].format(min)}</span>
        <span>{displayConfig[label].format(max)}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        {parameterCalculations[label](optionsData)}
      </div>
    </div>
  );
};

export default ParameterSlider;
