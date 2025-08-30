import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  TrendingUp,
  Zap,
  Clock,
  AlertTriangle,
  TrendingUp as RhoIcon,
} from 'lucide-react';

export interface OptionsData {
  strikePrice: number;
  currentPrice: number;
  premium: number;
  daysToExpiry: number;
  impliedVolatility: number;
  interestRate: number;
  dividendYield: number;
}

const greeksData = [
  {
    name: 'Delta',
    symbol: 'Δ',
    icon: TrendingUp,
    calculation: (data: OptionsData, type: 'Call' | 'Put') => {
      const moneyness = data.currentPrice / data.strikePrice;
      if (type === 'Call') {
        return moneyness > 1 ? 0.7 : moneyness > 0.95 ? 0.5 : 0.3;
      }
      return moneyness < 1 ? -0.7 : moneyness < 1.05 ? -0.5 : -0.3;
    },
  },
  {
    name: 'Gamma',
    symbol: 'Γ',
    icon: Zap,
    calculation: (data: OptionsData) => {
      const moneyness = data.currentPrice / data.strikePrice;
      return Math.max(0.1, 0.3 * Math.exp(-Math.abs(moneyness - 1) * 5));
    },
  },
  {
    name: 'Theta',
    symbol: 'Θ',
    icon: Clock,
    calculation: (data: OptionsData) => {
      return -data.premium * 0.03 * (30 / data.daysToExpiry);
    },
  },
  {
    name: 'Vega',
    symbol: 'ν',
    icon: AlertTriangle,
    calculation: (data: OptionsData) => {
      const timeToExpiry = data.daysToExpiry / 365;
      return data.premium * 0.2 * Math.sqrt(timeToExpiry);
    },
  },
  {
    name: 'Rho',
    symbol: 'ρ',
    icon: RhoIcon,
    calculation: (data: OptionsData, type: 'Call' | 'Put') => {
      return type === 'Call' ? data.premium * 0.01 : -data.premium * 0.01;
    },
  },
];

const tabContent: Record<string, { examples: string; factors: string; trading: string }> = {
  Delta: {
    examples: 'Delta approaches 1 for deep ITM calls and -1 for deep ITM puts.',
    factors: 'Driven by moneyness and time to expiry.',
    trading: 'Use Delta to estimate directional exposure and hedge positions.',
  },
  Gamma: {
    examples: 'Gamma peaks at-the-money, making Delta change quickly near the strike.',
    factors: 'Time to expiry and distance from strike influence Gamma.',
    trading: 'High Gamma strategies require active Delta management.',
  },
  Theta: {
    examples: 'An option with Theta -0.05 loses about $0.05 per day.',
    factors: 'Shorter expiries increase the magnitude of Theta.',
    trading: 'Option sellers benefit from negative Theta as time passes.',
  },
  Vega: {
    examples: 'If Vega is 0.10, a 1% IV rise adds about $0.10 to the option.',
    factors: 'Longer time to expiry and higher premiums raise Vega.',
    trading: 'Traders buy Vega when expecting volatility to increase.',
  },
  Rho: {
    examples: 'Calls gain value as rates rise; puts move inversely.',
    factors: 'Long-dated options are more sensitive to interest rates.',
    trading: 'Rho matters mainly for LEAPS and rate-driven strategies.',
  },
};

const calculateGreeks = (data: OptionsData) => {
  const moneyness = data.currentPrice / data.strikePrice;
  const timeToExpiry = data.daysToExpiry / 365;
  const callDelta = moneyness > 1 ? 0.7 : moneyness > 0.95 ? 0.5 : 0.3;
  const putDelta = moneyness < 1 ? -0.7 : moneyness < 1.05 ? -0.5 : -0.3;
  const gamma = Math.max(0.1, 0.3 * Math.exp(-Math.abs(moneyness - 1) * 5));
  const theta = -data.premium * 0.03 * (30 / data.daysToExpiry);
  const vega = data.premium * 0.2 * Math.sqrt(timeToExpiry);
  const rhoCall = data.premium * 0.01;
  const rhoPut = -data.premium * 0.01;
  return { callDelta, putDelta, gamma, theta, vega, rhoCall, rhoPut };
};

export const GreeksExplainer = ({ optionsData }: { optionsData: OptionsData }) => {
  const greeks = useMemo(() => calculateGreeks(optionsData), [optionsData]);

  const formatValue = (name: string) => {
    switch (name) {
      case 'Delta':
        return `Call: ${greeks.callDelta.toFixed(2)} | Put: ${greeks.putDelta.toFixed(2)}`;
      case 'Rho':
        return `Call: ${greeks.rhoCall.toFixed(2)} | Put: ${greeks.rhoPut.toFixed(2)}`;
      default:
        return (greeks[name.toLowerCase() as keyof typeof greeks] as number).toFixed(2);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {greeksData.map((g) => (
        <Card key={g.name}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <g.icon className="w-4 h-4" />
              {g.name} ({g.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm">Value: {formatValue(g.name)}</p>
            <Tabs defaultValue="examples">
              <TabsList>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="factors">Key Factors</TabsTrigger>
                <TabsTrigger value="trading">Trading Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="examples" className="text-sm">
                {tabContent[g.name].examples}
              </TabsContent>
              <TabsContent value="factors" className="text-sm">
                {tabContent[g.name].factors}
              </TabsContent>
              <TabsContent value="trading" className="text-sm">
                {tabContent[g.name].trading}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
