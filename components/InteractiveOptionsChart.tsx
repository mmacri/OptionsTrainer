import React, { useMemo, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { TooltipProvider } from './ui/tooltip';
import { Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ParameterSlider from './ParameterSlider';
import { GreeksExplainer, OptionsData } from './GreeksExplainer';
import { StrategyCard } from './StrategyCard';
import {
  optionsStrategies,
  OptionsStrategy,
  PayoffPoint,
} from '../lib/strategies';
import { quickPresets } from '../lib/presets';
import { validateParameters } from '../lib/optionsUtils';

export { validateParameters } from '../lib/optionsUtils';

export const InteractiveOptionsChart = () => {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'chart' | 'education'>('chart');
  const [optionsData, setOptionsData] = useState<OptionsData>({
    strikePrice: 100,
    currentPrice: 100,
    premium: 5,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  });
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  void selectedTab;
  void setSelectedTab;

  const steps = [
    { title: 'Welcome', content: 'This tour will guide you through the dashboard.' },
    {
      title: 'Parameters',
      content: 'Use these sliders to set market conditions and option inputs.',
    },
    {
      title: 'Strategies',
      content: 'Expand a strategy card to view its payoff chart or educational tips.',
    },
    { title: 'Greeks', content: 'Learn how the Greeks measure option sensitivity.' },
  ];

  useEffect(() => {
    try {
      validateParameters(optionsData);
    } catch (e) {
      console.warn(e);
    }
  }, [optionsData]);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1500);
  };

  const handlePreset = (preset: OptionsData) => {
    setOptionsData(preset);
    triggerCelebration();
  };

  const updateOption = (key: keyof OptionsData, value: number) => {
    setOptionsData((prev) => ({ ...prev, [key]: value }));
    triggerCelebration();
  };

  const generatePayoffData = useMemo(() => {
    return (strategy: OptionsStrategy): PayoffPoint[] => {
      const data: PayoffPoint[] = [];
      const minPrice = Math.max(0, optionsData.strikePrice - 30);
      const maxPrice = optionsData.strikePrice + 30;
      for (let price = minPrice; price <= maxPrice; price += 2) {
        const payoff = strategy.calculatePayoff(price, optionsData);
        data.push({ stockPrice: price, profitLoss: payoff });
      }
      return data;
    };
  }, [optionsData]);

  const WalkthroughOverlay = () => (
    <AnimatePresence>
      {showWalkthrough && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>{steps[walkthroughStep].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">{steps[walkthroughStep].content}</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowWalkthrough(false)}
                  aria-label="Skip walkthrough"
                >
                  Skip
                </Button>
                <Button
                  onClick={() => {
                    if (walkthroughStep === steps.length - 1) {
                      setShowWalkthrough(false);
                    } else {
                      setWalkthroughStep((s) => s + 1);
                    }
                  }}
                  aria-label="Next walkthrough step"
                >
                  {walkthroughStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2">Options Trading Strategies</h1>
        <p className="text-muted-foreground">
          Explore different options strategies and learn how their payoffs and Greeks work.
        </p>
      </div>

      <WalkthroughOverlay />
      {showCelebration && (
        <div className="text-center text-sm text-green-600" role="status">
          Nice! Changes applied.
        </div>
      )}

      <TooltipProvider>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Market Parameters & Option Pricing Inputs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <ParameterSlider
                label="currentPrice"
                value={optionsData.currentPrice}
                min={50}
                max={200}
                step={1}
                onChange={(v) => updateOption('currentPrice', v)}
              />
              <ParameterSlider
                label="strikePrice"
                value={optionsData.strikePrice}
                min={50}
                max={200}
                step={5}
                onChange={(v) => updateOption('strikePrice', v)}
              />
              <ParameterSlider
                label="premium"
                value={optionsData.premium}
                min={0.5}
                max={30}
                step={0.25}
                onChange={(v) => updateOption('premium', v)}
              />
              <ParameterSlider
                label="daysToExpiry"
                value={optionsData.daysToExpiry}
                min={1}
                max={365}
                step={1}
                onChange={(v) => updateOption('daysToExpiry', v)}
              />
              <ParameterSlider
                label="impliedVolatility"
                value={optionsData.impliedVolatility}
                min={5}
                max={100}
                step={1}
                onChange={(v) => updateOption('impliedVolatility', v)}
              />
              <ParameterSlider
                label="interestRate"
                value={optionsData.interestRate}
                min={0}
                max={10}
                step={0.1}
                onChange={(v) => updateOption('interestRate', v)}
              />
              <ParameterSlider
                label="dividendYield"
                value={optionsData.dividendYield}
                min={0}
                max={5}
                step={0.1}
                onChange={(v) => updateOption('dividendYield', v)}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(quickPresets).map(([key, preset]) => (
                <Button
                  key={key}
                  size="sm"
                  onClick={() => handlePreset(preset)}
                >
                  {key}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>

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
        {optionsStrategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isExpanded={expandedStrategy === strategy.id}
            onToggle={(id) => {
              setExpandedStrategy(expandedStrategy === id ? null : id);
              triggerCelebration();
            }}
            optionsData={optionsData}
            generatePayoffData={generatePayoffData}
          />
        ))}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        For educational purposes only. This is not financial advice.
      </p>
    </div>
  );
};
