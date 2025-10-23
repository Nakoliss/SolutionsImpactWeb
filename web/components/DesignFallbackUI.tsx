'use client';

import React from 'react';
import Link from 'next/link';
import { BusinessType } from '@/lib/businessDesigns';

interface DesignFallbackUIProps {
    message?: string;
    showDesignSelector?: boolean;
    currentDesign?: BusinessType;
    onDesignSelect?: (design: BusinessType) => void;
    showReturnHome?: boolean;
}

export const DesignFallbackUI: React.FC<DesignFallbackUIProps> = ({
    message = "Design context is missing or invalid",
    showDesignSelector = true,
    currentDesign,
    onDesignSelect,
    showReturnHome = true,
}) => {
    const handleDesignSelect = (design: BusinessType) => {
        if (onDesignSelect) {
            onDesignSelect(design);
        } else {
            // Default behavior: navigate to home with design parameter
            const url = new URL(window.location.origin);
            url.searchParams.set('design', design);
            window.location.href = url.toString();
        }
    };

    const designOptions = [
        { type: BusinessType.AI_AGENCY, label: 'AI Agency', color: 'bg-blue-500' },
        { type: BusinessType.MEDICAL_CLINIC, label: 'Medical Clinic', color: 'bg-cyan-500' },
        { type: BusinessType.RESTAURANT, label: 'Restaurant', color: 'bg-red-500' },
        { type: BusinessType.AUTO_GARAGE, label: 'Auto Garage', color: 'bg-orange-500' },
        { type: BusinessType.LAW_FIRM, label: 'Law Firm', color: 'bg-indigo-500' },
        { type: BusinessType.BEAUTY_SALON, label: 'Beauty Salon', color: 'bg-pink-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                        <svg
                            className="h-6 w-6 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                        Design Context Missing
                    </h3>
                    <p className="text-sm text-slate-300">
                        {message}
                    </p>
                </div>

                {showDesignSelector && (
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3">
                            Select a design theme:
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {designOptions.map((option) => (
                                <button
                                    key={option.type}
                                    onClick={() => handleDesignSelect(option.type)}
                                    className={`
                    p-3 rounded-lg border text-left transition-all duration-200
                    ${currentDesign === option.type
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                            : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-600'
                                        }
                  `}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full ${option.color} mr-2`} />
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {showReturnHome && (
                    <div className="flex flex-col space-y-2">
                        <Link
                            href="/"
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 text-center"
                        >
                            Return to Home Page
                        </Link>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                        >
                            Refresh Page
                        </button>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500 text-center">
                        This page requires a valid design context to display properly.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Hook for showing fallback UI when design context is invalid
export const useDesignFallback = () => {
    const [showFallback, setShowFallback] = React.useState(false);
    const [fallbackMessage, setFallbackMessage] = React.useState<string>();

    const triggerFallback = (message?: string) => {
        setFallbackMessage(message);
        setShowFallback(true);
    };

    const hideFallback = () => {
        setShowFallback(false);
        setFallbackMessage(undefined);
    };

    const FallbackComponent = React.useMemo(() => {
        if (!showFallback) return null;

        return (
            <DesignFallbackUI
                message={fallbackMessage}
                onDesignSelect={hideFallback}
            />
        );
    }, [showFallback, fallbackMessage]);

    return {
        showFallback,
        triggerFallback,
        hideFallback,
        FallbackComponent,
    };
};