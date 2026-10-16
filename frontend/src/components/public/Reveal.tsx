import React from 'react';
import { motion } from 'motion/react';

/** Short fade/slide-in on scroll. Disabled automatically via MotionConfig reducedMotion="user". */
export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className,
  delay = 0,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);
