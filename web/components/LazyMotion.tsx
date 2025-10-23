'use client';

import { domAnimation, LazyMotion, m } from 'framer-motion';
import type { ReactNode } from 'react';

interface LazyMotionWrapperProps {
  children: ReactNode;
}

/**
 * Optimized motion wrapper that only loads framer-motion features when needed
 * This reduces the initial bundle size by deferring animation features
 */
export function LazyMotionWrapper({ children }: LazyMotionWrapperProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

/**
 * Lightweight motion component that only loads when animations are needed
 * Use this instead of importing motion directly from framer-motion
 */
export const MotionDiv = m.div;
export const MotionButton = m.button;
export const MotionNav = m.nav;
export const MotionSection = m.section;

/**
 * Common animation variants optimized for performance
 */
export const motionVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  
  slideInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  },
  
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  
  // Hover effects
  hoverScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  },
  
  hoverLift: {
    whileHover: { y: -5, scale: 1.02 },
    transition: { duration: 0.2 }
  }
};

/**
 * Optimized motion hooks for common animations
 */
export const useOptimizedAnimation = () => {
  return {
    fadeInUp: motionVariants.fadeInUp,
    fadeIn: motionVariants.fadeIn,
    slideInLeft: motionVariants.slideInLeft,
    slideInRight: motionVariants.slideInRight,
    scaleIn: motionVariants.scaleIn,
    stagger: motionVariants.staggerContainer,
    hover: motionVariants.hoverScale,
    lift: motionVariants.hoverLift
  };
};

/**
 * Performance-optimized motion component with reduced features
 * Use for simple animations that don't need the full framer-motion library
 */
interface OptimizedMotionProps {
  children: ReactNode;
  className?: string;
  animate?: 'fadeIn' | 'slideUp' | 'scaleIn';
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function OptimizedMotion({ 
  children, 
  className = '', 
  animate = 'fadeIn',
  delay = 0,
  duration = 0.5,
  once = true 
}: OptimizedMotionProps) {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration, delay }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration, delay }
    }
  };

  return (
    <MotionDiv
      {...animations[animate]}
      className={className}
      viewport={{ once }}
    >
      {children}
    </MotionDiv>
  );
}

/**
 * Check if user prefers reduced motion
 * Use this to disable animations for accessibility
 */
export function useReducedMotion() {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Conditional motion wrapper that respects user preferences
 */
interface AccessibleMotionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function AccessibleMotion({ children, fallback, className }: AccessibleMotionProps) {
  const reducedMotion = useReducedMotion();
  
  if (reducedMotion) {
    return <div className={className}>{fallback || children}</div>;
  }
  
  return <div className={className}>{children}</div>;
}