import React from 'react';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onValueChange: (value: number) => void;
}

export const Slider = ({ value, onValueChange, className = '', ...props }: SliderProps) => (
  <input
    type="range"
    value={value}
    onChange={(e) => onValueChange(Number(e.target.value))}
    className={`w-full ${className}`}
    {...props}
  />
);
