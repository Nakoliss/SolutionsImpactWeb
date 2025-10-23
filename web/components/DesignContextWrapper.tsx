/**
 * Client-side wrapper for DesignContextProvider
 * This allows us to use the design context in the layout
 */

'use client';

import React from 'react';
import { DesignContextProvider } from '@/lib/designContext';
import { BusinessType } from '@/lib/businessDesigns';
import { getDesignFromURLWithFallback } from '@/lib/urlUtils';

interface DesignContextWrapperProps {
    children: React.ReactNode;
}

export default function DesignContextWrapper({ children }: DesignContextWrapperProps) {
    // Get initial design from URL or default to AI_AGENCY
    const initialDesign = getDesignFromURLWithFallback(BusinessType.AI_AGENCY);

    return (
        <DesignContextProvider initialDesign={initialDesign}>
            {children}
        </DesignContextProvider>
    );
}