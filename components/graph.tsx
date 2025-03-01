"use client"

import { motion } from 'framer-motion';

interface Emotion {
  name: string;
  score: number;
  color: string;
}

interface GraphProps {
  emotions: Emotion[];
}

export default function Graph({ emotions }: GraphProps) {
  return (
    <div className="flex justify-around items-center mb-6 p-4">
      {emotions.map((emotion: Emotion, index: number) => (
        <div key={index} className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40">
            {/* Background bar */}
            <motion.div
              className="absolute w-8 h-full bg-gray-200 opacity-25 rounded-full mx-auto left-0 right-0"
            />
            {/* Animated fill bar */}
            <motion.div
              className="absolute w-8 h-full rounded-full mx-auto left-0 right-0"
              style={{
                backgroundColor: emotion.color,
                originY: 1
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: emotion.score }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{emotion.score.toFixed(2)}</span>
              <span className="text-sm mt-1">{emotion.name}</span>
            </div>
          </div>
          
          {/* Horizontal bar */}
          <div className="w-48 h-8 relative bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: emotion.color }}
              initial={{ width: 0 }}
              animate={{ width: `${emotion.score * 100}%` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
