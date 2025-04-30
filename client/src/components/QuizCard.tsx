import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface QuizCardProps {
  children: React.ReactNode;
  direction?: number;
}

/**
 * Composant de carte interactive pour le quiz
 * Inclut des animations et un design plus conversationnel
 */
export const QuizCard: React.FC<QuizCardProps> = ({ children, direction = 0 }) => {
  // Variants pour les animations de la carte
  const cardVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 200 : direction < 0 ? -200 : 0,
      opacity: 0,
      scale: 0.95,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : direction > 0 ? -200 : 0,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    })
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={cardVariants}
      custom={direction}
      layout
    >
      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
        <CardContent className="p-6 sm:p-8">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * Composant d'option conversationnelle pour le quiz
 * Remplace les cases à cocher traditionnelles par un design interactif
 */
export const ConversationalOption: React.FC<{
  value: string;
  label: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ value, label, icon, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-4 my-2 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-primary/15 dark:bg-primary/25 border-2 border-primary' 
          : 'hover:bg-gray-100 dark:hover:bg-slate-800 border-2 border-transparent'
      }`}
    >
      <div className={`rounded-full p-2 ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800'}`}>
        {icon}
      </div>
      <span className="text-lg font-medium">{label}</span>
    </motion.div>
  );
};

/**
 * Composant de question conversationnelle
 * Présente la question comme une "bulle" de conversation
 */
export const ConversationalQuestion: React.FC<{
  question: string;
  icon?: React.ReactNode;
}> = ({ question, icon }) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-start gap-4 mb-6"
    >
      {icon && (
        <div className="rounded-full bg-primary/10 p-3 mt-1">
          {icon}
        </div>
      )}
      <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
        <p className="text-xl font-medium">{question}</p>
      </div>
    </motion.div>
  );
};