import type { OptionsData } from '../components/GreeksExplainer';

export interface PayoffPoint {
  stockPrice: number;
  profitLoss: number;
}

export interface OptionsStrategy {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: string;
  riskLevel: string;
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
  whenToUse: string[];
  calculatePayoff: (stockPrice: number, options: OptionsData) => number;
  legs: { action: string; type: string; strike?: number; premium?: number }[];
}

export const optionsStrategies: OptionsStrategy[] = [
  {
    id: 'long-call',
    title: 'Long Call',
    description:
      'Buy a call option expecting the stock price to rise significantly above the strike price.',
    category: 'Bullish',
    complexity: 'Basic',
    riskLevel: 'Low',
    maxProfit: 'Unlimited',
    maxLoss: 'Premium Paid',
    breakeven: 'Strike Price + Premium',
    whenToUse: [
      'You expect the stock to rise significantly',
      'Earnings announcement approaching with positive expectations',
      'Technical breakout patterns suggesting upward momentum',
      'Low cost way to participate in upside potential',
    ],
    calculatePayoff: (s, o) => Math.max(s - o.strikePrice, 0) - o.premium,
    legs: [{ action: 'Buy', type: 'Call' }],
  },
  {
    id: 'long-put',
    title: 'Long Put',
    description:
      'Buy a put option expecting the stock price to fall significantly below the strike price.',
    category: 'Bearish',
    complexity: 'Basic',
    riskLevel: 'Low',
    maxProfit: 'Strike Price - Premium',
    maxLoss: 'Premium Paid',
    breakeven: 'Strike Price - Premium',
    whenToUse: [
      'You expect the stock to decline significantly',
      'Negative news or poor earnings outlook for the company',
      'Hedging against a long position in the underlying stock',
      'Low cost way to speculate on downside movement',
    ],
    calculatePayoff: (s, o) => Math.max(o.strikePrice - s, 0) - o.premium,
    legs: [{ action: 'Buy', type: 'Put' }],
  },
  {
    id: 'covered-call',
    title: 'Covered Call',
    description:
      'Sell a call option while holding the underlying stock to generate income and cap potential upside.',
    category: 'Neutral',
    complexity: 'Basic',
    riskLevel: 'Medium',
    maxProfit: 'Strike Price - Stock Cost + Premium',
    maxLoss: 'Stock Cost - Premium',
    breakeven: 'Stock Cost - Premium',
    whenToUse: [
      'You believe the stock will trade sideways',
      'You want to generate income from a long stock position',
      'You are willing to sell your shares at the strike price',
      'You expect moderate price appreciation but want some downside protection',
    ],
    calculatePayoff: (s, o) => {
      const stockPayoff = s - o.currentPrice;
      const shortCall = -Math.max(s - o.strikePrice, 0) + o.premium;
      return stockPayoff + shortCall;
    },
    legs: [
      { action: 'Sell', type: 'Call' },
      { action: 'Buy', type: 'Stock' },
    ],
  },
  {
    id: 'protective-put',
    title: 'Protective Put',
    description:
      'Buy a put option to protect a long stock position from downside risk while maintaining upside potential.',
    category: 'Neutral',
    complexity: 'Basic',
    riskLevel: 'Low',
    maxProfit: 'Unlimited',
    maxLoss: 'Stock Cost + Premium - Strike Price',
    breakeven: 'Stock Cost + Premium',
    whenToUse: [
      'You own the stock and want downside protection',
      'Volatile market conditions with uncertain outlook',
      'Earnings announcements or macro events could cause large drops',
      'Insurance against a decline while retaining upside exposure',
    ],
    calculatePayoff: (s, o) => {
      const stockPayoff = s - o.currentPrice;
      const longPut = Math.max(o.strikePrice - s, 0) - o.premium;
      return stockPayoff + longPut;
    },
    legs: [
      { action: 'Buy', type: 'Stock' },
      { action: 'Buy', type: 'Put' },
    ],
  },
];

