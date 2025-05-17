import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface JapaneseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'sakura' | 'indigo';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fluid?: boolean; // 是否占满宽度
  withRipple?: boolean; // 是否有波纹效果
  withIcon?: React.ReactNode; // 是否带有图标
}

export function JapaneseButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fluid = false,
  withRipple = true,
  withIcon,
  type = 'button',
  ...props
}: JapaneseButtonProps) {
  // 按钮变体样式
  const variantStyles = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 border-none',
    secondary: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 border-none',
    outline: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-none',
    link: 'bg-transparent text-pink-600 hover:text-pink-700 underline border-none',
    sakura: 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600 border-none',
    indigo: 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:from-indigo-500 hover:to-purple-600 border-none',
  };
  
  // 按钮尺寸样式
  const sizeStyles = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-6',
    icon: 'p-2',
  };
  
  // 流体宽度样式
  const fluidStyle = fluid ? 'w-full' : '';
  
  // 波纹效果样式
  const rippleStyle = withRipple ? 'relative overflow-hidden' : '';
  
  return (
    <button
      type={type}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fluidStyle}
        ${rippleStyle}
        rounded-full font-medium transition-all duration-200
        flex items-center justify-center gap-2 shadow-sm
        hover:shadow focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50
        japan-hover
        ${className}
      `}
      {...props}
    >
      {withIcon && <span className="flex-shrink-0">{withIcon}</span>}
      <span>{children}</span>
      
      {withRipple && variant !== 'ghost' && variant !== 'link' && (
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
        </span>
      )}
    </button>
  );
} 