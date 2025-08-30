import React, { useMemo, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Zap, HelpCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OptionsParameters } from './OptionsParameters';
import { GreeksExplainer, OptionsData } from './GreeksExplainer';
import { StrategyCard } from './StrategyCard';
import {
  optionsStrategies,
  OptionsStrategy,
  PayoffPoint,
} from '../lib/strategies';
import { validateParameters } from '../lib/optionsUtils';

export { validateParameters } from '../lib/optionsUtils';

export const InteractiveOptionsChart = () => {
  const defaultOptions: OptionsData = {
    strikePrice: 100,
    currentPrice: 100,
    premium: 5,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  };
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [optionsData, setOptionsData] = useState<OptionsData>(defaultOptions);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const sliderAdjusted = React.useRef(false);

  const steps = [
    { title: 'Welcome!', content: 'Pick your experience level to tailor the tour.' },
    {
      title: 'Market Parameters',
      content: 'Set the market scene: price, strike, IV, and more. Try moving a slider.',
    },
    {
      title: 'Strategies',
      content: 'Open a card to see payoff diagrams and guidance.',
    },
    {
      title: 'Chart',
      content: 'Hover the chart to read price vs. profit.',
    },
    {
      title: 'Greeks',
      content: 'Greeks explain sensitivity. Tap a Greek to see tips.',
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('otsd_tour_completed') !== 'true') {
      setShowWalkthrough(true);
    }
  }, []);

  useEffect(() => {
    try {
      validateParameters(optionsData);
    } catch (e) {
      console.warn(e);
    }
  }, [optionsData]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const handleWalkthroughClose = () => {
    localStorage.setItem('otsd_tour_completed', 'true');
    setShowWalkthrough(false);
  };

  const handlePreset = (preset: OptionsData, label: string) => {
    setOptionsData(preset);
    showToast(`Preset applied: ${label}`);
    console.log('preset_applied', { name: label });
  };

  const updateOption = (key: keyof OptionsData, value: number) => {
    setOptionsData((prev) => ({ ...prev, [key]: value }));
    if (!sliderAdjusted.current) {
      showToast('Nice! You adjusted a slider.');
      sliderAdjusted.current = true;
    }
    console.log('param_changed', { name: key, value });
  };

  const handleReset = () => {
    setOptionsData(defaultOptions);
    console.log('parameters_reset');
  };

  const handleReplayTour = () => {
    setWalkthroughStep(0);
    setShowWalkthrough(true);
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
                  onClick={handleWalkthroughClose}
                  aria-label="Skip walkthrough"
                >
                  Skip
                </Button>
                <Button
                  onClick={() => {
                    if (walkthroughStep === steps.length - 1) {
                      handleWalkthroughClose();
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
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6" role="main">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1>Options Trading Strategies</h1>
          <p className="text-muted-foreground">
            Explore different options strategies and learn how their payoffs and Greeks work.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={handleReplayTour}
            aria-label="Replay guided tour"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            aria-label="Reset parameters to defaults"
          >
            <AlertCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <WalkthroughOverlay />
      {toast && (
        <div className="text-center text-sm text-green-600" role="status">
          {toast}
        </div>
      )}

      <OptionsParameters
        optionsData={optionsData}
        onChange={updateOption}
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
        {optionsStrategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isExpanded={expandedStrategy === strategy.id}
            onToggle={(id) => {
              setExpandedStrategy(expandedStrategy === id ? null : id);
              console.log('strategy_toggled', {
                id,
                expanded: expandedStrategy !== id,
              });
            }}
            optionsData={optionsData}
            generatePayoffData={generatePayoffData}
          />
        ))}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        For educational purposes only. Not financial advice. Payoffs and Greeks are simplified approximations.
      </p>
    </div>
  );
};
