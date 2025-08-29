import { describe, it, expect } from 'vitest';
import { validateParameters } from '../components/InteractiveOptionsChart';
import type { OptionsData } from '../components/GreeksExplainer';

describe('validateParameters', () => {
  const base: OptionsData = {
    strikePrice: 100,
    currentPrice: 100,
    premium: 1,
    daysToExpiry: 10,
    impliedVolatility: 20,
    interestRate: 5,
    dividendYield: 2,
  };

  it('throws for negative strike', () => {
    expect(() => validateParameters({ ...base, strikePrice: -1 })).toThrow();
  });

  it('throws for non-positive current price', () => {
    expect(() => validateParameters({ ...base, currentPrice: 0 })).toThrow();
  });

  it('throws for negative implied volatility', () => {
    expect(() =>
      validateParameters({ ...base, impliedVolatility: -1 })
    ).toThrow();
  });

  it('passes for valid data', () => {
    expect(() => validateParameters(base)).not.toThrow();
  });
});
