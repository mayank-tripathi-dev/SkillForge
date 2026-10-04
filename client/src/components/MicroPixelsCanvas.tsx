import React, { useEffect, useState } from 'react';

interface Pixel {
  id: number;
  top: string;
  left: string;
  size: string;
  color: string;
  transform: string;
}

export const MicroPixelsCanvas: React.FC = () => {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // Generate initial ambient micro-pixels
    const colors = [
      'bg-glow-cyan/60',
      'bg-glow-lavender/50',
      'bg-glow-mint/80',
      'bg-glow-yellow/40',
      'bg-glow-coral/40',
    ];

    const initialPixels: Pixel[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 90) + 5}%`,
      left: `${Math.floor(Math.random() * 90) + 5}%`,
      size: `${Math.random() > 0.5 ? 'w-2 h-2' : 'w-2.5 h-2.5'}`,
      color: colors[i % colors.length],
      transform: `rotate(${Math.floor(Math.random() * 45)}deg)`,
    }));

    setPixels(initialPixels);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pixels.map((p) => (
        <div
          key={p.id}
          className={`interactive-pixel ${p.size} ${p.color} blur-[0.5px]`}
          style={{
            top: p.top,
            left: p.left,
            transform: p.transform,
          }}
        />
      ))}

      {/* Dynamic Cursor Proximity Glow */}
      <div
        className="fixed w-64 h-64 rounded-full pointer-events-none transition-transform duration-75 ease-out opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(165,243,252,0.8) 0%, rgba(221,214,254,0.4) 50%, transparent 80%)',
          left: `${mousePos.x - 128}px`,
          top: `${mousePos.y - 128}px`,
        }}
      />
    </div>
  );
};
