import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, boxShadow: '0 10px 20px -5px rgba(88, 43, 232, 0.03), 0 8px 16px -6px rgba(88, 43, 232, 0.03)' } : {}}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={`bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_8px_-3px_rgba(88,43,232,0.05)] ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
