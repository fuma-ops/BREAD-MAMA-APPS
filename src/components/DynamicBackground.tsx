import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Croissant, Wheat, Coffee, Leaf, Star, Sparkles, ChefHat } from 'lucide-react';

const icons = [Croissant, Wheat, Coffee, Leaf, Star, Sparkles, ChefHat];

export function DynamicBackground() {
  const [elements, setElements] = useState<{ id: number; IconName: any; x: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    // Generate random background elements
    const newElements = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      IconName: icons[Math.floor(Math.random() * icons.length)],
      x: Math.random() * 100, // random start horizontal position (%)
      delay: Math.random() * 5,
      duration: 20 + Math.random() * 30, // 20 to 50 seconds
      size: 30 + Math.random() * 40, // 30px to 70px
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0] opacity-[0.08]">
      {elements.map((el) => {
        const Icon = el.IconName;
        return (
          <motion.div
            key={el.id}
            initial={{ y: '110vh', x: `${el.x}vw`, rotate: 0 }}
            animate={{
              y: '-10vh',
              x: `${el.x + (Math.random() * 20 - 10)}vw`,
              rotate: 360,
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              color: 'var(--color-gold)', // Use the gold color for a vintage style
            }}
          >
            <Icon size={el.size} strokeWidth={1} />
          </motion.div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] to-transparent opacity-80" />
    </div>
  );
}
