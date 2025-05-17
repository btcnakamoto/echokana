import React from 'react';
import type { ReactNode } from 'react';

interface JapaneseCardProps {
  children: ReactNode;
  className?: string;
  pattern?: 'none' | 'dots' | 'seigaiha' | 'asanoha'; // 日式图案
  borderStyle?: 'none' | 'gradient' | 'simple'; // 边框样式
  elevation?: 'none' | 'low' | 'medium' | 'high'; // 阴影高度
  animate?: boolean; // 是否添加动画效果
}

export function JapaneseCard({
  children,
  className = '',
  pattern = 'none',
  borderStyle = 'simple',
  elevation = 'medium',
  animate = false
}: JapaneseCardProps) {
  // 图案背景样式
  const patternStyles = {
    none: '',
    dots: 'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'%23F9D4D4\' fill-opacity=\'0.3\'/%3E%3C/svg%3E")]',
    seigaiha: 'bg-[url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20c-5.523 0-10-4.477-10-10S14.477 0 20 0s10 4.477 10 10-4.477 10-10 10zm0-3c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm0-3a4 4 0 100-8 4 4 0 000 8zm0-3a1 1 0 100-2 1 1 0 000 2z\' fill=\'%23E8B7DD\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")]',
    asanoha: 'bg-[url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23D7C4F9\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 20L20 0v10L10 20l10 10v10L0 20z\'/%3E%3Cpath d=\'M20 0L0 20h10l10-10 10 10h10L20 0z\' /%3E%3Cpath d=\'M20 40l20-20h-10l-10 10-10-10H0l20 20z\'/%3E%3Cpath d=\'M40 20L20 40v-10l10-10-10-10V0l20 20z\'/%3E%3C/g%3E%3C/svg%3E")]'
  };
  
  // 边框样式
  const borderStyles = {
    none: 'border-0',
    simple: 'border border-pink-100',
    gradient: 'gradient-border p-0'
  };
  
  // 阴影高度
  const elevationStyles = {
    none: '',
    low: 'shadow-md',
    medium: 'shadow-lg',
    high: 'shadow-xl'
  };
  
  // 动画类名
  const animateClass = animate ? 'transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg' : '';
  
  return (
    <div className={`
      ${borderStyle === 'gradient' ? 'gradient-border' : ''}
      ${elevation === 'none' ? '' : elevationStyles[elevation]}
      ${animateClass}
      rounded-xl overflow-hidden
      ${className}
    `}>
      <div className={`
        ${borderStyle === 'gradient' ? 'gradient-border-content' : ''}
        ${borderStyle !== 'gradient' ? borderStyles[borderStyle] : ''}
        ${patternStyles[pattern]}
        bg-white/95 backdrop-blur-md
        p-6 rounded-xl h-full
      `}>
        {children}
      </div>
    </div>
  );
} 