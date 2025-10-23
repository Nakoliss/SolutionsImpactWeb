/**
 * Loading component for smooth theme transitions
 * Provides visual feedback during theme switching
 */

'use client';

import React from 'react';
import { useThemeTransition } from '@/hooks/useThemeTransition';

interface ThemeTransitionLoaderProps {
    isVisible?: boolean;
    className?: string;
    showProgress?: boolean;
    showText?: boolean;
}

export const ThemeTransitionLoader: React.FC<ThemeTransitionLoaderProps> = ({
    isVisible = false,
    className = '',
    showProgress = true,
    showText = true,
}) => {
    const { isTransitioning, isLoading, progress } = useThemeTransition();

    if (!isVisible && !isTransitioning && !isLoading) {
        return null;
    }

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/20 backdrop-blur-sm
        transition-opacity duration-300
        ${isTransitioning || isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        ${className}
      `}
            role="status"
            aria-label="Switching theme"
        >
            <div className="
        bg-white/90 dark:bg-gray-900/90 
        rounded-lg p-6 shadow-xl
        flex flex-col items-center space-y-4
        min-w-[200px]
      ">
                {/* Spinner */}
                <div className="relative">
                    <div className="
            w-8 h-8 border-4 border-gray-200 dark:border-gray-700
            border-t-blue-500 rounded-full animate-spin
          " />
                    {showProgress && (
                        <div className="
              absolute inset-0 flex items-center justify-center
              text-xs font-medium text-gray-600 dark:text-gray-400
            ">
                            {Math.round(progress)}%
                        </div>
                    )}
                </div>

                {/* Progress bar */}
                {showProgress && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="
                bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out
              "
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {/* Loading text */}
                {showText && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Switching theme...
                    </p>
                )}
            </div>
        </div>
    );
};

/**
 * Inline theme transition indicator
 */
interface InlineThemeLoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const InlineThemeLoader: React.FC<InlineThemeLoaderProps> = ({
    size = 'md',
    className = '',
}) => {
    const { isTransitioning, isLoading } = useThemeTransition();

    if (!isTransitioning && !isLoading) {
        return null;
    }

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <div
            className={`
        inline-flex items-center justify-center
        ${className}
      `}
            role="status"
            aria-label="Theme switching"
        >
            <div className={`
        border-2 border-gray-200 dark:border-gray-700
        border-t-blue-500 rounded-full animate-spin
        ${sizeClasses[size]}
      `} />
        </div>
    );
};

/**
 * Theme transition progress bar
 */
interface ThemeProgressBarProps {
    className?: string;
    height?: string;
    showPercentage?: boolean;
}

export const ThemeProgressBar: React.FC<ThemeProgressBarProps> = ({
    className = '',
    height = 'h-1',
    showPercentage = false,
}) => {
    const { isTransitioning, isLoading, progress } = useThemeTransition();

    if (!isTransitioning && !isLoading) {
        return null;
    }

    return (
        <div className={`w-full ${className}`}>
            <div className={`
        w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
        ${height}
      `}>
                <div
                    className="
            bg-gradient-to-r from-blue-500 to-purple-500
            rounded-full transition-all duration-300 ease-out
            h-full
          "
                    style={{ width: `${progress}%` }}
                />
            </div>
            {showPercentage && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {Math.round(progress)}%
                </div>
            )}
        </div>
    );
};

/**
 * Skeleton loader for theme-aware components
 */
interface ThemeSkeletonProps {
    className?: string;
    lines?: number;
    showAvatar?: boolean;
}

export const ThemeSkeleton: React.FC<ThemeSkeletonProps> = ({
    className = '',
    lines = 3,
    showAvatar = false,
}) => {
    const { isTransitioning, isLoading } = useThemeTransition();

    if (!isTransitioning && !isLoading) {
        return null;
    }

    return (
        <div className={`animate-pulse ${className}`}>
            <div className="flex space-x-4">
                {showAvatar && (
                    <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10" />
                )}
                <div className="flex-1 space-y-2">
                    {Array.from({ length: lines }).map((_, index) => (
                        <div
                            key={index}
                            className={`
                h-4 bg-gray-300 dark:bg-gray-600 rounded
                ${index === lines - 1 ? 'w-3/4' : 'w-full'}
              `}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeTransitionLoader;