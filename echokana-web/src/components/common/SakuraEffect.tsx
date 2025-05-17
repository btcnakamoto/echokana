import { useEffect, useState } from 'react';

interface SakuraProps {
  count?: number; // 樱花数量
  minSize?: number; // 最小尺寸
  maxSize?: number; // 最大尺寸
}

export function SakuraEffect({ 
  count = 15, 
  minSize = 10, 
  maxSize = 20 
}: SakuraProps) {
  const [sakuras, setSakuras] = useState<Array<{
    id: number;
    size: number;
    left: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // 创建樱花元素数组
    const newSakuras = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * (maxSize - minSize) + minSize,
      left: Math.random() * 100, // 水平位置(百分比)
      delay: Math.random() * 10, // 延迟
      duration: Math.random() * 5 + 10, // 动画持续时间
    }));
    
    setSakuras(newSakuras);
    
    // 每30秒重新生成樱花位置，保持动态效果
    const interval = setInterval(() => {
      setSakuras(prev => 
        prev.map(sakura => ({
          ...sakura,
          left: Math.random() * 100,
          delay: Math.random() * 10,
        }))
      );
    }, 30000);
    
    return () => clearInterval(interval);
  }, [count, minSize, maxSize]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sakuras.map((sakura) => (
        <div
          key={sakura.id}
          className="sakura absolute"
          style={{
            width: `${sakura.size}px`,
            height: `${sakura.size}px`,
            left: `${sakura.left}%`,
            animationDuration: `${sakura.duration}s`,
            animationDelay: `${sakura.delay}s`,
            opacity: 0
          }}
        />
      ))}
    </div>
  );
} 