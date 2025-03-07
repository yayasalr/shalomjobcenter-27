
import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export const SectionHeader = ({ title, subtitle, className = '' }: SectionHeaderProps) => {
  return (
    <motion.div 
      className={`text-center mb-16 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-serif font-bold text-sholom-dark mb-4 tracking-tight">
        {title}
      </h2>
      <p className="text-sholom-muted text-lg max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
      <div className="w-16 h-1 bg-sholom-primary mx-auto mt-6 rounded-full"></div>
    </motion.div>
  );
};
