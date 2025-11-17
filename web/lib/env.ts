/**
 * Environment Variable Schema Validation
 * Validates required and optional environment variables at startup
 */

import { z } from 'zod';

// Define the environment schema
const envSchema = z.object({
  // Node.js environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Application configuration
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
  
  // Sentry configuration (optional)
  NEXT_PUBLIC_SENTRY_ENABLED: z
    .string()
    .transform(val => val === 'true')
    .default(false),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_DEV_MODE: z
    .string()
    .transform(val => val === 'true')
    .default(false),
  
  // Analytics configuration (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_PROVIDER: z
    .enum(['google', 'plausible', 'console', 'none'])
    .default('console'),
  
  // Scheduling configuration
  NEXT_PUBLIC_CAL_BOOKING_URL: z.string().url().optional(),
  NEXT_PUBLIC_CAL_BOOKING_URL_FR: z.string().url().optional(),
  
  // API endpoints (optional)
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  
  // Database configuration (optional, for future use)
  DATABASE_URL: z.string().url().optional(),
  
  // Email configuration (optional, for future use)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(val => val ? parseInt(val, 10) : undefined).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Security configuration
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Feature flags
  NEXT_PUBLIC_MAINTENANCE_MODE: z
    .string()
    .transform(val => val === 'true')
    .default(false),
  NEXT_PUBLIC_BETA_FEATURES: z
    .string()
    .transform(val => val === 'true')
    .default(false),
});

// Extract the type from the schema
export type Environment = z.infer<typeof envSchema>;

// Parse and validate environment variables
let env: Environment;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.issues.forEach(err => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    
    // In production, fail fast
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    // In development, warn but continue with defaults
    console.warn('⚠️  Continuing with default values in development mode');
    env = envSchema.parse({
      NODE_ENV: process.env.NODE_ENV || 'development',
    });
  } else {
    throw error;
  }
}

// Export validated environment
export { env };

/**
 * Type-safe environment variable access
 */
export const getEnv = <K extends keyof Environment>(key: K): Environment[K] => {
  return env[key];
};

/**
 * Check if we're in a specific environment
 */
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

/**
 * Feature flag helpers
 */
export const isMaintenanceMode = env.NEXT_PUBLIC_MAINTENANCE_MODE;
export const areBetaFeaturesEnabled = env.NEXT_PUBLIC_BETA_FEATURES;
export const isSentryEnabled = env.NEXT_PUBLIC_SENTRY_ENABLED;

/**
 * Runtime environment validation
 * Call this in your app initialization to validate environment early
 */
export const validateEnvironment = () => {
  const issues: string[] = [];
  
  // Check for common misconfiguration
  if (isProduction) {
    if (!env.NEXT_PUBLIC_SENTRY_DSN && env.NEXT_PUBLIC_SENTRY_ENABLED) {
      issues.push('Sentry is enabled but NEXT_PUBLIC_SENTRY_DSN is not set');
    }
    
    if (!env.NEXT_PUBLIC_GA_MEASUREMENT_ID && env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'google') {
      issues.push('Google Analytics provider selected but NEXT_PUBLIC_GA_MEASUREMENT_ID is not set');
    }
    
    if (!env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'plausible') {
      issues.push('Plausible provider selected but NEXT_PUBLIC_PLAUSIBLE_DOMAIN is not set');
    }
  }
  
  if (issues.length > 0) {
    console.warn('⚠️  Environment configuration issues:');
    issues.forEach(issue => console.warn(`  - ${issue}`));
    
    if (isProduction) {
      console.error('❌ Production environment has configuration issues');
      process.exit(1);
    }
  }
  
  console.log(`✅ Environment validated for ${env.NODE_ENV} mode`);
  
  return {
    isValid: issues.length === 0,
    issues,
    environment: env,
  };
};

/**
 * Get configuration summary for debugging
 */
export const getConfigSummary = () => {
  const summary = {
    environment: env.NODE_ENV,
    version: env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    features: {
      sentry: env.NEXT_PUBLIC_SENTRY_ENABLED,
      analytics: env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
      maintenance: env.NEXT_PUBLIC_MAINTENANCE_MODE,
      beta: env.NEXT_PUBLIC_BETA_FEATURES,
    },
    configured: {
      database: !!env.DATABASE_URL,
      smtp: !!env.SMTP_HOST,
      auth: !!env.NEXTAUTH_SECRET,
    },
  };
  
  return summary;
};