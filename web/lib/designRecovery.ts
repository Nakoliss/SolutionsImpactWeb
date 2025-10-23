import { BusinessType } from './businessDesigns';
import { getDesignFromURLWithFallback, setDesignInURL, removeDesignFromURL } from './urlUtils';
import { logContextError, logValidationError } from './designErrorLogger';

// Recovery strategies
export enum RecoveryStrategy {
    URL_FALLBACK = 'URL_FALLBACK',
    LOCAL_STORAGE = 'LOCAL_STORAGE',
    DEFAULT_DESIGN = 'DEFAULT_DESIGN',
    USER_SELECTION = 'USER_SELECTION',
}

// Recovery result
export interface RecoveryResult {
    success: boolean;
    design: BusinessType;
    strategy: RecoveryStrategy;
    message: string;
}

// Local storage key for design backup
const DESIGN_BACKUP_KEY = 'design_context_backup';
const DESIGN_HISTORY_KEY = 'design_context_history';

// Design recovery manager
export class DesignRecoveryManager {
    private static instance: DesignRecoveryManager;

    static getInstance(): DesignRecoveryManager {
        if (!DesignRecoveryManager.instance) {
            DesignRecoveryManager.instance = new DesignRecoveryManager();
        }
        return DesignRecoveryManager.instance;
    }

    // Attempt to recover design context using multiple strategies
    async recoverDesignContext(
        currentDesign?: BusinessType,
        preferredStrategies: RecoveryStrategy[] = [
            RecoveryStrategy.URL_FALLBACK,
            RecoveryStrategy.LOCAL_STORAGE,
            RecoveryStrategy.DEFAULT_DESIGN,
        ]
    ): Promise<RecoveryResult> {
        for (const strategy of preferredStrategies) {
            try {
                const result = await this.executeRecoveryStrategy(strategy, currentDesign);
                if (result.success) {
                    // Log successful recovery
                    logContextError(
                        `Design context recovered using ${strategy}`,
                        { design: result.design, strategy, originalDesign: currentDesign }
                    );
                    return result;
                }
            } catch (error) {
                logContextError(
                    `Recovery strategy ${strategy} failed`,
                    { error: error instanceof Error ? error.message : error, currentDesign }
                );
            }
        }

        // All strategies failed, return default
        return {
            success: false,
            design: BusinessType.AI_AGENCY,
            strategy: RecoveryStrategy.DEFAULT_DESIGN,
            message: 'All recovery strategies failed, using default design',
        };
    }

    // Execute a specific recovery strategy
    private async executeRecoveryStrategy(
        strategy: RecoveryStrategy,
        currentDesign?: BusinessType
    ): Promise<RecoveryResult> {
        switch (strategy) {
            case RecoveryStrategy.URL_FALLBACK:
                return this.recoverFromURL();

            case RecoveryStrategy.LOCAL_STORAGE:
                return this.recoverFromLocalStorage();

            case RecoveryStrategy.DEFAULT_DESIGN:
                return this.recoverWithDefault();

            case RecoveryStrategy.USER_SELECTION:
                return this.recoverWithUserSelection();

            default:
                throw new Error(`Unknown recovery strategy: ${strategy}`);
        }
    }

    // Recover from URL parameters
    private recoverFromURL(): RecoveryResult {
        try {
            const design = getDesignFromURLWithFallback();
            return {
                success: true,
                design,
                strategy: RecoveryStrategy.URL_FALLBACK,
                message: `Recovered design from URL: ${design}`,
            };
        } catch (error) {
            return {
                success: false,
                design: BusinessType.AI_AGENCY,
                strategy: RecoveryStrategy.URL_FALLBACK,
                message: `Failed to recover from URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }

    // Recover from local storage backup
    private recoverFromLocalStorage(): RecoveryResult {
        try {
            if (typeof window === 'undefined') {
                return {
                    success: false,
                    design: BusinessType.AI_AGENCY,
                    strategy: RecoveryStrategy.LOCAL_STORAGE,
                    message: 'Local storage not available (server-side)',
                };
            }

            const backup = localStorage.getItem(DESIGN_BACKUP_KEY);
            if (backup && Object.values(BusinessType).includes(backup as BusinessType)) {
                const design = backup as BusinessType;

                // Update URL with recovered design
                setDesignInURL(design);

                return {
                    success: true,
                    design,
                    strategy: RecoveryStrategy.LOCAL_STORAGE,
                    message: `Recovered design from local storage: ${design}`,
                };
            }

            return {
                success: false,
                design: BusinessType.AI_AGENCY,
                strategy: RecoveryStrategy.LOCAL_STORAGE,
                message: 'No valid design found in local storage',
            };
        } catch (error) {
            return {
                success: false,
                design: BusinessType.AI_AGENCY,
                strategy: RecoveryStrategy.LOCAL_STORAGE,
                message: `Local storage recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }

    // Recover with default design
    private recoverWithDefault(): RecoveryResult {
        const design = BusinessType.AI_AGENCY;

        try {
            // Update URL with default design
            setDesignInURL(design);

            return {
                success: true,
                design,
                strategy: RecoveryStrategy.DEFAULT_DESIGN,
                message: `Using default design: ${design}`,
            };
        } catch (error) {
            return {
                success: true, // Still successful as we have a design
                design,
                strategy: RecoveryStrategy.DEFAULT_DESIGN,
                message: `Using default design (URL update failed): ${design}`,
            };
        }
    }

    // Recover with user selection (placeholder for UI integration)
    private recoverWithUserSelection(): RecoveryResult {
        // This would typically trigger a UI component for user selection
        // For now, return failure to indicate user interaction is needed
        return {
            success: false,
            design: BusinessType.AI_AGENCY,
            strategy: RecoveryStrategy.USER_SELECTION,
            message: 'User selection required for design recovery',
        };
    }

    // Backup current design to local storage
    backupDesign(design: BusinessType): void {
        try {
            if (typeof window === 'undefined') return;

            localStorage.setItem(DESIGN_BACKUP_KEY, design);

            // Also maintain a history of designs
            this.addToDesignHistory(design);
        } catch (error) {
            logContextError(
                'Failed to backup design to local storage',
                { design, error: error instanceof Error ? error.message : error }
            );
        }
    }

    // Add design to history
    private addToDesignHistory(design: BusinessType): void {
        try {
            if (typeof window === 'undefined') return;

            const historyStr = localStorage.getItem(DESIGN_HISTORY_KEY);
            const history: { design: BusinessType; timestamp: string }[] = historyStr
                ? JSON.parse(historyStr)
                : [];

            // Add new entry
            history.push({
                design,
                timestamp: new Date().toISOString(),
            });

            // Keep only last 10 entries
            const trimmedHistory = history.slice(-10);

            localStorage.setItem(DESIGN_HISTORY_KEY, JSON.stringify(trimmedHistory));
        } catch (error) {
            logContextError(
                'Failed to update design history',
                { design, error: error instanceof Error ? error.message : error }
            );
        }
    }

    // Get design history
    getDesignHistory(): { design: BusinessType; timestamp: string }[] {
        try {
            if (typeof window === 'undefined') return [];

            const historyStr = localStorage.getItem(DESIGN_HISTORY_KEY);
            return historyStr ? JSON.parse(historyStr) : [];
        } catch (error) {
            logContextError(
                'Failed to get design history',
                { error: error instanceof Error ? error.message : error }
            );
            return [];
        }
    }

    // Clear all recovery data
    clearRecoveryData(): void {
        try {
            if (typeof window === 'undefined') return;

            localStorage.removeItem(DESIGN_BACKUP_KEY);
            localStorage.removeItem(DESIGN_HISTORY_KEY);
            removeDesignFromURL();
        } catch (error) {
            logContextError(
                'Failed to clear recovery data',
                { error: error instanceof Error ? error.message : error }
            );
        }
    }

    // Check if recovery is needed
    isRecoveryNeeded(currentDesign?: BusinessType): boolean {
        if (!currentDesign) return true;

        // Check if current design is valid
        const isValid = Object.values(BusinessType).includes(currentDesign);
        return !isValid;
    }
}

// Convenience functions
export const designRecovery = DesignRecoveryManager.getInstance();

export const recoverDesignContext = (
    currentDesign?: BusinessType,
    strategies?: RecoveryStrategy[]
): Promise<RecoveryResult> => {
    return designRecovery.recoverDesignContext(currentDesign, strategies);
};

export const backupDesignContext = (design: BusinessType): void => {
    designRecovery.backupDesign(design);
};

export const clearDesignRecoveryData = (): void => {
    designRecovery.clearRecoveryData();
};

export const getDesignContextHistory = (): { design: BusinessType; timestamp: string }[] => {
    return designRecovery.getDesignHistory();
};