import { motion } from 'framer-motion';

/**
 * MorphingSquare Loading Component
 * A smooth morphing animation loader - much more polished than a plain spinner
 * Used in Queue, Appointment, and FollowUp pages
 */
export default function MorphingSquare({ 
  size = 40, 
  className = '' 
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #1A5276, #17A589)',
        }}
        animate={{
          borderRadius: [
            '30% 70% 70% 30% / 30% 30% 70% 70%',
            '58% 42% 75% 25% / 76% 46% 54% 24%',
            '50% 50% 33% 67% / 55% 27% 73% 45%',
            '33% 67% 58% 42% / 63% 68% 32% 37%',
            '30% 70% 70% 30% / 30% 30% 70% 70%'
          ],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
}

/**
 * MorphingSquare with label - for loading states that need text
 */
export function MorphingSquareWithLabel({ 
  size = 40, 
  label = 'Loading...',
  className = '' 
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <MorphingSquare size={size} />
      <p className="text-text-secondary text-sm animate-pulse">{label}</p>
    </div>
  );
}
