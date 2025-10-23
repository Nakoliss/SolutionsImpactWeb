'use client';

import React, { useState, useEffect } from 'react';
import {
    getDesignErrorStats,
    clearDesignErrors,
    exportDesignErrors,
    designErrorLogger
} from '@/lib/designErrorLogger';
import {
    getDesignContextHistory,
    clearDesignRecoveryData
} from '@/lib/designRecovery';
import { useDesignContext } from '@/lib/designContext';

interface DesignErrorDebugPanelProps {
    isVisible?: boolean;
    onToggle?: () => void;
}

export const DesignErrorDebugPanel: React.FC<DesignErrorDebugPanelProps> = ({
    isVisible = false,
    onToggle,
}) => {
    const [stats, setStats] = useState(getDesignErrorStats());
    const [history, setHistory] = useState(getDesignContextHistory());
    const [recentErrors, setRecentErrors] = useState(designErrorLogger.getRecentErrors(5));
    const { currentDesign } = useDesignContext();

    // Refresh data
    const refreshData = () => {
        setStats(getDesignErrorStats());
        setHistory(getDesignContextHistory());
        setRecentErrors(designErrorLogger.getRecentErrors(5));
    };

    // Auto-refresh every 5 seconds when visible
    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(refreshData, 5000);
            return () => clearInterval(interval);
        }
    }, [isVisible]);

    // Handle export errors
    const handleExportErrors = () => {
        const errorData = exportDesignErrors();
        const blob = new Blob([errorData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `design-errors-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Handle clear errors
    const handleClearErrors = () => {
        clearDesignErrors();
        refreshData();
    };

    // Handle clear recovery data
    const handleClearRecoveryData = () => {
        clearDesignRecoveryData();
        refreshData();
    };

    if (!isVisible) {
        return (
            <button
                onClick={onToggle}
                className="fixed bottom-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full shadow-lg z-40 transition-colors"
                title="Open Design Debug Panel"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
                <h3 className="text-white font-medium">Design Debug Panel</h3>
                <button
                    onClick={onToggle}
                    className="text-slate-400 hover:text-slate-300 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-3 overflow-y-auto max-h-80">
                {/* Current Status */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Current Status</h4>
                    <div className="text-xs text-slate-300 space-y-1">
                        <div>Design: <span className="text-blue-400">{currentDesign}</span></div>
                        <div>Total Errors: <span className="text-red-400">{stats.totalErrors}</span></div>
                        <div>Last Error: {stats.lastError ? (
                            <span className="text-yellow-400">
                                {new Date(stats.lastError.timestamp).toLocaleTimeString()}
                            </span>
                        ) : (
                            <span className="text-green-400">None</span>
                        )}</div>
                    </div>
                </div>

                {/* Error Statistics */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Error Statistics</h4>
                    <div className="text-xs text-slate-300 space-y-1">
                        {Object.entries(stats.errorsByType).map(([type, count]) => (
                            <div key={type} className="flex justify-between">
                                <span>{type.replace(/_/g, ' ')}</span>
                                <span className={count > 0 ? 'text-red-400' : 'text-green-400'}>
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Errors */}
                {recentErrors.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-white mb-2">Recent Errors</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {recentErrors.map((error, index) => (
                                <div key={index} className="text-xs bg-slate-700 p-2 rounded">
                                    <div className="text-red-400 font-medium">{error.type}</div>
                                    <div className="text-slate-300 truncate">{error.message}</div>
                                    <div className="text-slate-500">
                                        {new Date(error.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Design History */}
                {history.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-white mb-2">Design History</h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                            {history.slice(-5).map((entry, index) => (
                                <div key={index} className="text-xs text-slate-300 flex justify-between">
                                    <span>{entry.design}</span>
                                    <span className="text-slate-500">
                                        {new Date(entry.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                    <button
                        onClick={refreshData}
                        className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    >
                        Refresh Data
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleExportErrors}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                        >
                            Export Errors
                        </button>

                        <button
                            onClick={handleClearErrors}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                        >
                            Clear Errors
                        </button>
                    </div>

                    <button
                        onClick={handleClearRecoveryData}
                        className="w-full px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
                    >
                        Clear Recovery Data
                    </button>
                </div>
            </div>
        </div>
    );
};

// Hook for managing debug panel
export const useDesignErrorDebugPanel = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show panel in development mode or when there are errors
    useEffect(() => {
        const isDev = process.env.NODE_ENV === 'development';
        const hasErrors = getDesignErrorStats().totalErrors > 0;

        // Auto-show in development if there are errors
        if (isDev && hasErrors && !isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const toggle = () => setIsVisible(!isVisible);
    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);

    const DebugPanelComponent = (
        <DesignErrorDebugPanel
            isVisible={isVisible}
            onToggle={toggle}
        />
    );

    return {
        isVisible,
        toggle,
        show,
        hide,
        DebugPanelComponent,
    };
};