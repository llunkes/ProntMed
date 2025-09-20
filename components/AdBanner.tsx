
import React from 'react';

interface AdBannerProps {
  className?: string;
  width: number | string;
  height: number | string;
}

const AdBanner: React.FC<AdBannerProps> = ({ className, width, height }) => {
  return (
    <div
      className={`bg-gray-200 flex items-center justify-center border border-dashed border-gray-400 ${className}`}
      style={{ width, height }}
    >
      <span className="text-gray-500 text-sm font-medium">
        Espaço para Google AdSense ({width}x{height})
      </span>
    </div>
  );
};

export default AdBanner;
