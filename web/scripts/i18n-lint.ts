#!/usr/bin/env npx ts-node

import * as fs from 'fs';
import * as path from 'path';

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

interface MissingKeys {
  missingInEn: string[];
  missingInFr: string[];
  emptyInEn: string[];
  emptyInFr: string[];
}

/**
 * Recursively get all nested keys from a translation object
 */
function getNestedKeys(obj: TranslationObject, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...getNestedKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Get value from nested object using dot notation
 */
function getNestedValue(obj: TranslationObject, keyPath: string): string | undefined {
  const keys = keyPath.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
}

/**
 * Check if a value is empty or just placeholder text
 */
function isEmpty(value: string | undefined): boolean {
  if (!value) return true;
  
  const trimmed = value.trim();
  if (trimmed === '') return true;
  
  // Check for common placeholder patterns
  const placeholderPatterns = [
    /^TODO:/i,
    /^PLACEHOLDER/i,
    /^TBD/i,
    /^\[.*\]$/,
    /^{{.*}}$/,
    /^__.*__$/
  ];
  
  return placeholderPatterns.some(pattern => pattern.test(trimmed));
}

/**
 * Main i18n linting function
 */
function lintI18n(): MissingKeys {
  const messagesDir = path.join(__dirname, '..', 'messages');
  const frPath = path.join(messagesDir, 'fr.json');
  const enPath = path.join(messagesDir, 'en.json');
  
  // Check if files exist
  if (!fs.existsSync(frPath)) {
    throw new Error(`French translations file not found: ${frPath}`);
  }
  
  if (!fs.existsSync(enPath)) {
    throw new Error(`English translations file not found: ${enPath}`);
  }
  
  // Load translation files
  const frTranslations: TranslationObject = JSON.parse(fs.readFileSync(frPath, 'utf8'));
  const enTranslations: TranslationObject = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  // Get all keys from both files
  const frKeys = new Set(getNestedKeys(frTranslations));
  const enKeys = new Set(getNestedKeys(enTranslations));
  
  const result: MissingKeys = {
    missingInEn: [],
    missingInFr: [],
    emptyInEn: [],
    emptyInFr: []
  };
  
  // Find keys missing in English
  for (const key of frKeys) {
    if (!enKeys.has(key)) {
      result.missingInEn.push(key);
    }
  }
  
  // Find keys missing in French
  for (const key of enKeys) {
    if (!frKeys.has(key)) {
      result.missingInFr.push(key);
    }
  }
  
  // Check for empty values in common keys
  const commonKeys = new Set([...frKeys].filter(key => enKeys.has(key)));
  
  for (const key of commonKeys) {
    const frValue = getNestedValue(frTranslations, key);
    const enValue = getNestedValue(enTranslations, key);
    
    if (isEmpty(frValue)) {
      result.emptyInFr.push(key);
    }
    
    if (isEmpty(enValue)) {
      result.emptyInEn.push(key);
    }
  }
  
  return result;
}

/**
 * Print results in a readable format
 */
function printResults(results: MissingKeys): void {
  let hasIssues = false;
  
  console.log('🔍 i18n Lint Results\n');
  
  if (results.missingInEn.length > 0) {
    hasIssues = true;
    console.log('❌ Keys missing in English (en.json):');
    results.missingInEn.forEach(key => console.log(`  - ${key}`));
    console.log('');
  }
  
  if (results.missingInFr.length > 0) {
    hasIssues = true;
    console.log('❌ Keys missing in French (fr.json):');
    results.missingInFr.forEach(key => console.log(`  - ${key}`));
    console.log('');
  }
  
  if (results.emptyInEn.length > 0) {
    hasIssues = true;
    console.log('⚠️  Empty/placeholder values in English:');
    results.emptyInEn.forEach(key => console.log(`  - ${key}`));
    console.log('');
  }
  
  if (results.emptyInFr.length > 0) {
    hasIssues = true;
    console.log('⚠️  Empty/placeholder values in French:');
    results.emptyInFr.forEach(key => console.log(`  - ${key}`));
    console.log('');
  }
  
  if (!hasIssues) {
    console.log('✅ All i18n keys are present and have values!');
  } else {
    const totalIssues = results.missingInEn.length + results.missingInFr.length + 
                       results.emptyInEn.length + results.emptyInFr.length;
    console.log(`📊 Summary: ${totalIssues} issue(s) found`);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const results = lintI18n();
    printResults(results);
    
    // Exit with error code if there are missing keys (but not for empty values)
    const hasMissingKeys = results.missingInEn.length > 0 || results.missingInFr.length > 0;
    process.exit(hasMissingKeys ? 1 : 0);
  } catch (error) {
    console.error('❌ Error running i18n lint:', error);
    process.exit(1);
  }
}

export { lintI18n, type MissingKeys };