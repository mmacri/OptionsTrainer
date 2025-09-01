import type { OptionsData } from '../components/GreeksExplainer';

export const quickPresets: Record<string, OptionsData> = {
  ATMOption: {
    strikePrice: 100,
    currentPrice: 100,
    premium: 3,
    daysToExpiry: 30,
    impliedVolatility: 20,
    interestRate: 5,
    dividendYield: 2,
  },
  OTMCall: {
    strikePrice: 105,
    currentPrice: 100,
    premium: 2,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  },
  OTMPut: {
    strikePrice: 95,
    currentPrice: 100,
    premium: 2,
    daysToExpiry: 30,
    impliedVolatility: 25,
    interestRate: 5,
    dividendYield: 2,
  },
  HighVol: {
    strikePrice: 100,
    currentPrice: 100,
    premium: 8,
    daysToExpiry: 7,
    impliedVolatility: 50,
    interestRate: 5,
    dividendYield: 1,
  },
  EarningsWeek: {
    strikePrice: 100,
    currentPrice: 100,
    premium: 10,
    daysToExpiry: 5,
    impliedVolatility: 70,
    interestRate: 5,
    dividendYield: 1,
  },
  CalmMarket: {
    strikePrice: 100,
    currentPrice: 100,
    premium: 2,
    daysToExpiry: 45,
    impliedVolatility: 12,
    interestRate: 5,
    dividendYield: 2,
  },
  CrashScenario: {
    strikePrice: 95,
    currentPrice: 75,
    premium: 6,
    daysToExpiry: 14,
    impliedVolatility: 80,
    interestRate: 4,
    dividendYield: 0,
  },
};

type TooltipInfo = { title: string; content: string };

export const parameterTooltips: Record<keyof OptionsData, TooltipInfo> = {
  currentPrice: {
    title: 'Current Stock Price (S)',
    content:
      'The current market price of the underlying stock. This determines option moneyness.',
  },
  strikePrice: {
    title: 'Strike Price (K)',
    content: 'The exercise price of the option contract.',
  },
  premium: {
    title: 'Option Premium',
    content:
      'The price paid for the option contract. For short strategies this is the credit received.',
  },
  daysToExpiry: {
    title: 'Days to Expiry (T)',
    content:
      'Number of days until the option expires. Shorter durations increase time decay (Theta).',
  },
  impliedVolatility: {
    title: 'Implied Volatility (IV)',
    content:
      'Expected volatility of the underlying over the life of the option. Higher IV increases option premiums.',
  },
  interestRate: {
    title: 'Risk-free Interest Rate (r)',
    content:
      'Annualized interest rate used in option pricing models. Higher rates generally raise call values and lower put values.',
  },
  dividendYield: {
    title: 'Dividend Yield (q)',
    content:
      'Expected annual dividend yield of the underlying stock. Dividends decrease call values and increase put values.',
  },
};
