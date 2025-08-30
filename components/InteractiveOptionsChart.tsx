import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { GreeksExplainer, OptionsData } from './GreeksExplainer';
import { StrategyCard } from './StrategyCard';
import { OptionsParameters } from './OptionsParameters';
import {
  optionsStrategies,
  OptionsStrategy,
  PayoffPoint,
} from '../lib/strategies';
import {
  validateParameters,
  safePayoffCalculation,
} from '../lib/optionsUtils';

export { validateParameters } from '../lib/optionsUtils';

export const InteractiveOptionsChart = () => {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(
    null,
  );
  const [optionsData, setOptionsData] = useState<OptionsData>({
    strikePrice: 100,
    currentPrice: 100,
    premium: 5,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  });
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const handlePreset = (p: OptionsData) => {
    validateParameters(p);
    setOptionsData(p);
  };

  const handleWalkthroughClose = () => setShowWalkthrough(false);

  useEffect(() => {
    try {
      validateParameters(optionsData);
    } catch (e) {
      console.error((e as Error).message);
    }
  }, [optionsData]);

  const generatePayoffData = useMemo(
    () => (strategy: OptionsStrategy): PayoffPoint[] => {
      const data: PayoffPoint[] = [];
      const minPrice = Math.max(0, optionsData.strikePrice - 30);
      const maxPrice = optionsData.strikePrice + 30;

      for (let price = minPrice; price <= maxPrice; price += 2) {
        const payoff = safePayoffCalculation(price, strategy, optionsData);
        data.push({ stockPrice: price, profitLoss: payoff });
      }

      return data;
    },
    [optionsData],
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2">Options Trading Strategies</h1>
        <p className="text-gray-600">
          Explore different options strategies and learn how their payoffs and
          Greeks work.
        </p>
      </div>
      {showWalkthrough && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card>
            <CardContent>
              <p>Welcome to the walkthrough!</p>
              <Button onClick={handleWalkthroughClose}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
      <OptionsParameters
        optionsData={optionsData}
        onChange={setOptionsData}
        onPreset={handlePreset}
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Options Greeks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GreeksExplainer optionsData={optionsData} />
        </CardContent>
      </Card>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {optionsStrategies.map((s) => (
          <StrategyCard
            key={s.id}
            strategy={s}
            isExpanded={expandedStrategy === s.id}
            onToggle={(id) =>
              setExpandedStrategy(expandedStrategy === id ? null : id)
            }
            optionsData={optionsData}
            generatePayoffData={generatePayoffData}
          />
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground mt-8">
        This tool is for educational purposes only and does not constitute
        financial advice.
      </p>
    </div>
  );
};

