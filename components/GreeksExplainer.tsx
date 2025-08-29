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
  },
  {
    name: 'Gamma',
    symbol: 'Γ',
    icon: Zap,
  },
  {
    name: 'Theta',
    symbol: 'Θ',
    icon: Clock,
  },
  {
    name: 'Vega',
    symbol: 'ν',
    icon: AlertTriangle,
  },
  {
    name: 'Rho',
    symbol: 'ρ',
    icon: TrendingDown,
  },
];

const tabContent: Record<
  string,
  { examples: string; factors: string; trading: string }
> = {
  Delta: {
    examples:
      'A call with Delta 0.5 gains $0.50 when the stock rises $1; deep in-the-money calls approach 1.0.',
    factors: 'Moneyness and time to expiry drive Delta toward or away from ±1.',
    trading:
      'Use Delta to gauge directional exposure or to delta-hedge a position by balancing stock and options.',
  },
  Gamma: {
    examples:
      'Near the strike, Gamma is highest, meaning Delta will change quickly as price moves.',
    factors:
      'Time to expiry and proximity to the strike influence Gamma; it falls as you move away from the strike.',
    trading:
      'High Gamma positions react strongly to price changes, so traders monitor Gamma when managing delta hedges.',
  },
  Theta: {
    examples:
      'An option with Theta -0.05 loses about $0.05 per day from time decay.',
    factors:
      'Shorter time to expiry and higher extrinsic value increase the magnitude of Theta.',
    trading:
      'Option sellers rely on negative Theta to earn decay; buyers must overcome Theta with favorable moves.',
  },
  Vega: {
    examples:
      'If Vega is 0.10, a 1% rise in implied volatility adds about $0.10 to the option price.',
    factors:
      'Vega grows with longer expiries and higher premiums and shrinks near expiration.',
    trading:
      'Traders use Vega to judge volatility exposure, favoring long Vega when expecting bigger moves.',
  },
  Rho: {
    examples:
      'A call with Rho 0.02 gains $0.02 when rates rise 1%; puts move inversely.',
    factors:
      'Longer-dated options are more sensitive to interest rates, so Rho increases with time.',
    trading:
      'Rho is minor for short-dated contracts but matters for LEAPS and rate-driven strategies.',
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

  const formatGreekValue = (name: string) => {
    switch (name) {
      case 'Delta':
        return `Call: ${greeks.callDelta.toFixed(2)} | Put: ${greeks.putDelta.toFixed(2)}`;
      case 'Rho':
        return `Call: ${greeks.rhoCall.toFixed(2)} | Put: ${greeks.rhoPut.toFixed(2)}`;
      default:
        return greeks[name.toLowerCase() as keyof typeof greeks].toFixed(2);
    }
  };

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
            <p className="mb-2 text-sm">{formatGreekValue(g.name)}</p>
            <Tabs defaultValue="examples">
              <TabsList>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="factors">Key Factors</TabsTrigger>
                <TabsTrigger value="trading">Trading Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="examples">
                <p className="text-sm">{tabContent[g.name].examples}</p>
              </TabsContent>
              <TabsContent value="factors">
                <p className="text-sm">{tabContent[g.name].factors}</p>
              </TabsContent>
              <TabsContent value="trading">
                <p className="text-sm">{tabContent[g.name].trading}</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

