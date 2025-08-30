import type { OptionsData } from '../components/GreeksExplainer';
import type { OptionsStrategy } from './strategies';

export const getCategoryColor = (c: string) =>
  c === 'Bullish'
    ? 'bg-green-50 text-green-700 border-green-200'
    : c === 'Bearish'
    ? 'bg-red-50 text-red-700 border-red-200'
    : c === 'Neutral'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : c === 'Volatility'
    ? 'bg-purple-50 text-purple-700 border-purple-200'
    : 'bg-blue-50 text-blue-700 border-blue-200';

export const getComplexityColor = (c: string) =>
  c === 'Basic'
    ? 'bg-green-50 text-green-700 border-green-200'
    : c === 'Intermediate'
    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
    : c === 'Advanced'
    ? 'bg-red-50 text-red-700 border-red-200'
    : 'bg-gray-50 text-gray-700 border-gray-200';

export const getRiskColor = (r: string) =>
  r === 'Low'
    ? 'bg-green-50 text-green-700 border-green-200'
    : r === 'Medium'
    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
    : r === 'High'
    ? 'bg-orange-50 text-orange-700 border-orange-200'
    : r === 'Unlimited'
    ? 'bg-red-50 text-red-700 border-red-200'
    : 'bg-gray-50 text-gray-700 border-gray-200';

export const validateParameters = (d: OptionsData) => {
  if (d.strikePrice <= 0) throw new Error('Strike price must be positive');
  if (d.currentPrice <= 0) throw new Error('Current price must be positive');
  if (d.premium < 0) throw new Error('Premium cannot be negative');
  if (d.daysToExpiry <= 0) throw new Error('Days to expiry must be positive');
  if (d.impliedVolatility < 0)
    throw new Error('Implied volatility cannot be negative');
  if (d.interestRate < 0)
    throw new Error('Interest rate cannot be negative');
  if (d.dividendYield < 0)
    throw new Error('Dividend yield cannot be negative');
};

export const safePayoffCalculation = (
  s: number,
  strategy: OptionsStrategy,
  o: OptionsData,
) => {
  try {
    return strategy.calculatePayoff(s, o);
  } catch (e) {
    console.warn('Payoff calculation error:', e);
    return 0;
  }
};

