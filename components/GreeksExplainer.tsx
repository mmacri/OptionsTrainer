import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  TrendingUp,
  Zap,
  Clock,
  AlertTriangle,
  TrendingDown,
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
      } else {
        return moneyness < 1 ? -0.7 : moneyness < 1.05 ? -0.5 : -0.3;
      }
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
    icon: TrendingDown,
    calculation: (data: OptionsData, type: 'Call' | 'Put') => {
      return type === 'Call' ? data.premium * 0.01 : -data.premium * 0.01;
    },
  },
];

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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {greeksData.map((g) => (
        <Card key={g.name}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <g.icon className="w-4 h-4" /> {g.name} ({g.symbol})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm">
              {g.name === 'Delta'
                ? `Call: ${greeks.callDelta.toFixed(2)} | Put: ${greeks.putDelta.toFixed(2)}`
                : g.name === 'Gamma'
                ? greeks.gamma.toFixed(2)
                : g.name === 'Theta'
                ? greeks.theta.toFixed(2)
                : g.name === 'Vega'
                ? greeks.vega.toFixed(2)
                : `Call: ${greeks.rhoCall.toFixed(2)} | Put: ${greeks.rhoPut.toFixed(2)}`}
            </p>
            <Tabs defaultValue="examples">
              <TabsList>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="factors">Key Factors</TabsTrigger>
                <TabsTrigger value="trading">Trading Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="examples">
                <p className="text-sm">
                  {g.name} shows how the option reacts; for instance, Delta of 0.5 means the option moves half as much as the stock.
                </p>
              </TabsContent>
              <TabsContent value="factors">
                <p className="text-sm">Moneyness, time to expiry and volatility influence {g.name}.</p>
              </TabsContent>
              <TabsContent value="trading">
                <p className="text-sm">Traders monitor {g.name} to manage risk and plan strategies.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
