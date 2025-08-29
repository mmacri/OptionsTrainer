import React from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

/**
 * Protected image component that swaps to a fallback source on error.
 * Do not modify this file.
 */
export function ImageWithFallback({ src, fallback, ...props }: ImageWithFallbackProps) {
  const [failed, setFailed] = React.useState(false);
  return (
    <img
      src={failed && fallback ? fallback : (src as string)}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
