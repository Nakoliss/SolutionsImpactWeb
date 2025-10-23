/**
 * Performance monitoring component for theme switching
 * Provides insights into theme transition performance
 */

'use client';

import React, { useState, useEffect } from 'react';
import { getThemePerformanceMetrics } from '@/lib/themePerformance';
import { useThemeTransition } from '@/hooks/useThemeTransition';

interface PerformanceMetrics {
    cachedThemes: number;
    cachedClasses: number;
    currentTheme: string | null;
    isTransitioning: boolean;
    transitionDuration: number;
    renderTime?: number;
    memoryUsage?: number;
}

interface ThemePerformanceMonitorProps {
    enabled?: boolean;
    showInProduction?: boolean;
    className?: string;
}

export const ThemePerformanceMonitor: React.FC<ThemePerformanceMonitorProps> = ({
    enabled = process.env.NODE_ENV === 'development',
    showInProduction = false,
    className = '',
}) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { getPerformanceMetrics } = useThemeTransition();

    // Don't render in production unless explicitly enabled
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
        return null;
    }

    // Don't render if disabled
    if (!enabled) {
        return null;
    }

    useEffect(() => {
        const updateMetrics = () => {
            const themeMetrics = getThemePerformanceMetrics();
            const transitionMetrics = getPerformanceMetrics();

            // Measure render performance
            const startTime = performance.now();

            // Get memory usage if available
            const memoryInfo = (performance as any).memory;

            setMetrics({
                ...themeMetrics,
                ...transitionMetrics,
                renderTime: performance.now() - startTime,
                memoryUsage: memoryInfo ? memoryInfo.usedJSHeapSize : undefined,
            });
        };

        // Update metrics initially
        updateMetrics();

        // Update metrics periodically
        const interval = setInterval(updateMetrics, 1000);

        return () => clearInterval(interval);
    }, [getPerformanceMetrics]);

    if (!metrics) {
        return null;
    }

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className={`
          fixed bottom-4 right-4 z-50
          bg-gray-900 text-white px-3 py-2 rounded-lg
          text-xs font-mono shadow-lg
          hover:bg-gray-800 transition-colors
          ${className}
        `}
                title="Toggle Theme Performance Monitor"
            >
                🎨 Perf
            </button>

            {/* Performance panel */}
            {isVisible && (
                <div className="
          fixed bottom-16 right-4 z-50
          bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
          rounded-lg shadow-xl p-4 w-80
          text-xs font-mono
          max-h-96 overflow-y-auto
        ">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-sm">Theme Performance</h3>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-2">
                        {/* Cache metrics */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <div className="font-semibold mb-1">Cache Status</div>
                            <div>Cached Themes: {metrics.cachedThemes}</div>
                            <div>Cached Classes: {metrics.cachedClasses}</div>
                        </div>

                        {/* Current state */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <div className="font-semibold mb-1">Current State</div>
                            <div>Theme: {metrics.currentTheme || 'None'}</div>
                            <div>Transitioning: {metrics.isTransitioning ? 'Yes' : 'No'}</div>
                            <div>Duration: {metrics.transitionDuration}ms</div>
                        </div>

                        {/* Performance metrics */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <div className="font-semibold mb-1">Performance</div>
                            {metrics.renderTime && (
                                <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
                            )}
                            {metrics.memoryUsage && (
                                <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</div>
                            )}
                        </div>

                        {/* Performance tips */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                            <div className="font-semibold mb-1 text-blue-700 dark:text-blue-300">
                                Tips
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 space-y-1">
                                {metrics.cachedThemes < 5 && (
                                    <div>• Preload more themes for faster switching</div>
                                )}
                                {metrics.renderTime && metrics.renderTime > 16 && (
                                    <div>• Render time is high, consider optimization</div>
                                )}
                                {metrics.isTransitioning && (
                                    <div>• Theme transition in progress</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/**
 * Simple performance indicator for theme transitions
 */
export const ThemePerformanceIndicator: React.FC<{
    className?: string;
}> = ({ className = '' }) => {
    const [isOptimal, setIsOptimal] = useState(true);
    const { isTransitioning } = useThemeTransition();

    useEffect(() => {
        if (isTransitioning) {
            const startTime = performance.now();

            const checkPerformance = () => {
                const duration = performance.now() - startTime;
                setIsOptimal(duration < 300); // Consider optimal if under 300ms
            };

            const timeout = setTimeout(checkPerformance, 350);
            return () => clearTimeout(timeout);
        }
    }, [isTransitioning]);

    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    return (
        <div className={`
      fixed top-4 right-4 z-50
      px-2 py-1 rounded text-xs font-mono
      ${isOptimal
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }
      ${isTransitioning ? 'opacity-100' : 'opacity-0'}
      transition-opacity duration-200
      ${className}
    `}>
            {isOptimal ? '🟢 Fast' : '🟡 Slow'}
        </div>
    );
};

export default ThemePerformanceMonitor;