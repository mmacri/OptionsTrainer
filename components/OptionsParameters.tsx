import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { TooltipProvider } from './ui/tooltip';
import { Activity, Target, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { ParameterSlider } from './ParameterSlider';
import type { OptionsData } from './GreeksExplainer';
import { quickPresets } from '../lib/presets';

interface OptionsParametersProps {
  optionsData: OptionsData;
  onChange: (key: keyof OptionsData, value: number) => void;
  onPreset: (data: OptionsData, label: string) => void;
}

export const OptionsParameters: React.FC<OptionsParametersProps> = ({
  optionsData,
  onChange,
  onPreset,
}) => {
  const presets = [
    { name: 'ATM Option', icon: Target, values: quickPresets.ATMOption },
    { name: 'OTM Call', icon: TrendingUp, values: quickPresets.OTMCall },
    { name: 'OTM Put', icon: TrendingDown, values: quickPresets.OTMPut },
    { name: 'High Vol', icon: Zap, values: quickPresets.HighVol },
  ];

  return (
    <TooltipProvider>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Market Parameters & Option Pricing Inputs
          </CardTitle>
          <CardDescription>
            Adjust market assumptions to see how pricing and payoffs change.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ParameterSlider
              label="currentPrice"
              optionsData={optionsData}
              min={50}
              max={200}
              step={1}
              onChange={(v) => onChange('currentPrice', v)}
            />
            <ParameterSlider
              label="strikePrice"
              optionsData={optionsData}
              min={50}
              max={200}
              step={5}
              onChange={(v) => onChange('strikePrice', v)}
            />
            <ParameterSlider
              label="premium"
              optionsData={optionsData}
              min={0.5}
              max={30}
              step={0.25}
              onChange={(v) => onChange('premium', v)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            <ParameterSlider
              label="daysToExpiry"
              optionsData={optionsData}
              min={1}
              max={365}
              step={1}
              onChange={(v) => onChange('daysToExpiry', v)}
            />
            <ParameterSlider
              label="impliedVolatility"
              optionsData={optionsData}
              min={5}
              max={100}
              step={1}
              onChange={(v) => onChange('impliedVolatility', v)}
            />
            <ParameterSlider
              label="interestRate"
              optionsData={optionsData}
              min={0}
              max={10}
              step={0.1}
              onChange={(v) => onChange('interestRate', v)}
            />
            <ParameterSlider
              label="dividendYield"
              optionsData={optionsData}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => onChange('dividendYield', v)}
            />
          </div>
          <div className="mt-6 pt-6 border-t">
            <h4 className="mb-3 font-medium">Quick Presets</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presets.map((p) => (
                <Button
                  key={p.name}
                  variant="outline"
                  size="sm"
                  onClick={() => onPreset(p.values, p.name)}
                  className="text-xs"
                >
                  <p.icon className="w-3 h-3 mr-1" />
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default OptionsParameters;
