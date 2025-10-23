#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { CONTENT_CATEGORIES, SUPPORTED_LOCALES, type ContentCategory, type SupportedLocale } from '@/content';

type ValidationLevel = 'error' | 'warning';

interface ValidationMessage {
  file: string;
  message: string;
  level: ValidationLevel;
}

interface LocaleCoverage {
  locales: Set<SupportedLocale>;
  declared: Set<SupportedLocale>;
  files: string[];
}

const MEDICAL_TERMS = [
  'clinique',
  'medical',
  'medecin',
  'medicin',
  'patient',
  'patients',
  'soins',
  'treatment',
  'therapie',
  'therapy',
  'hospital',
  'pharmacie',
  'pharmacy',
  'docteur',
  'doctor',
];

const LEGACY_PACKAGE_TERMS = [
  'soins avances',
  'soins essentiels',
  'soins essenciels',
  'advanced care',
  'essential care',
  'complete care',
  'clinique medicale',
];

const BRAND_KEYWORDS = [
  'web impact solutions',
  'ai web agency',
  'agence web ia',
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

class ContentValidator {
  private errors: ValidationMessage[] = [];
  private warnings: ValidationMessage[] = [];
  private localeCoverage = new Map<string, LocaleCoverage>();
  private slugUsage = new Map<string, string[]>();

  async validate(): Promise<void> {
    console.log('[INFO] Starting content validation...');

    await this.validateContentTree();
    this.validateTranslationCoverage();
    this.validateSlugConsistency();
    this.printSummary();
  }

  private async validateContentTree(): Promise<void> {
    const contentRoot = path.join(process.cwd(), 'content');

    if (!fs.existsSync(contentRoot)) {
      this.addError('', 'Content directory does not exist');
      return;
    }

    for (const [categoryKey] of Object.entries(CONTENT_CATEGORIES)) {
      const category = categoryKey as ContentCategory;
      const categoryDir = path.join(contentRoot, category);

      if (!fs.existsSync(categoryDir)) {
        this.addError(category, `Missing category directory '${category}'`);
        continue;
      }

      const files = fs.readdirSync(categoryDir).filter((file) => file.endsWith('.mdx'));

      if (files.length === 0) {
        this.addWarning(category, `No MDX files found in '${category}'`);
        continue;
      }

      for (const file of files) {
        await this.validateMDXFile(path.join(categoryDir, file), category);
      }
    }
  }

  private async validateMDXFile(filePath: string, category: ContentCategory): Promise<void> {
    const relativePath = path.relative(process.cwd(), filePath);

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(raw);

      const filename = path.basename(filePath);
      const localeMatch = filename.match(/\.(fr|en)\.mdx$/);
      const locale = localeMatch ? (localeMatch[1] as SupportedLocale) : undefined;
      const baseSlug = filename.replace(/\.(fr|en)\.mdx$/, '');
      const slug = typeof frontmatter.slug === 'string' && frontmatter.slug.trim().length > 0
        ? frontmatter.slug.trim()
        : baseSlug;

      if (!locale) {
        this.addError(relativePath, 'Filename must end with .fr.mdx or .en.mdx');
        return;
      }

      this.validateFrontmatter(relativePath, frontmatter, category, slug, locale, baseSlug);
      this.trackSlugUsage(slug, relativePath);
      this.trackLocaleCoverage(category, slug, locale, frontmatter.localeAvail, relativePath);
      this.enforceBrandCompliance(relativePath, frontmatter, content);
    } catch (error) {
      this.addError(relativePath, `Failed to parse MDX: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private validateFrontmatter(
    file: string,
    frontmatter: Record<string, unknown>,
    category: ContentCategory,
    slug: string,
    locale: SupportedLocale,
    baseSlug: string,
  ): void {
    const requiredFields: Array<{ key: string; valid: (value: unknown) => boolean; message: string }> = [
      { key: 'title', valid: (value) => typeof value === 'string' && value.trim().length > 0, message: 'title is required' },
      { key: 'description', valid: (value) => typeof value === 'string' && value.trim().length > 0, message: 'description is required' },
      { key: 'slug', valid: (value) => typeof value === 'string' && value.trim().length > 0, message: 'slug is required' },
      { key: 'localeAvail', valid: Array.isArray, message: 'localeAvail must be an array' },
    ];

    for (const field of requiredFields) {
      if (!field.valid(frontmatter[field.key])) {
        this.addError(file, `Frontmatter field '${field.key}' ${field.message}`);
      }
    }

    if (typeof frontmatter.slug === 'string' && frontmatter.slug.trim() !== baseSlug) {
      this.addWarning(file, `Frontmatter slug '${frontmatter.slug}' does not match filename slug '${baseSlug}'`);
    }

    if (frontmatter.category && frontmatter.category !== category) {
      this.addError(file, `Frontmatter category '${frontmatter.category}' does not match directory '${category}'`);
    }

    if (frontmatter.localeAvail && Array.isArray(frontmatter.localeAvail)) {
      const declared = frontmatter.localeAvail as unknown[];
      const invalid = declared.filter((value) => !isSupportedLocale(value));
      if (invalid.length > 0) {
        this.addError(file, `localeAvail contains unsupported locales: ${invalid.join(', ')}`);
      }
      if (!declared.includes(locale)) {
        this.addError(file, `localeAvail is missing the current file locale '${locale}'`);
      }
      if (!declared.includes('fr') || !declared.includes('en')) {
        this.addWarning(file, 'localeAvail should include both fr and en for bilingual content');
      }
    }

    if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
      this.addError(file, 'tags must be an array when provided');
    }

    if (frontmatter.author && typeof frontmatter.author !== 'string') {
      this.addError(file, 'author must be a string when provided');
    }

    const dateFields: Array<{ key: string; label: string }> = [
      { key: 'publishedAt', label: 'publishedAt' },
      { key: 'updatedAt', label: 'updatedAt' },
    ];

    for (const field of dateFields) {
      const value = frontmatter[field.key];
      if (value) {
        const date = new Date(String(value));
        if (Number.isNaN(date.getTime())) {
          this.addWarning(file, `Frontmatter field '${field.label}' is not a valid date`);
        }
      }
    }

    if (frontmatter.leadForm !== undefined && typeof frontmatter.leadForm !== 'boolean') {
      this.addError(file, 'leadForm must be a boolean when provided');
    }
  }

  private trackSlugUsage(slug: string, file: string): void {
    if (!this.slugUsage.has(slug)) {
      this.slugUsage.set(slug, []);
    }
    this.slugUsage.get(slug)!.push(file);
  }

  private trackLocaleCoverage(
    category: ContentCategory,
    slug: string,
    locale: SupportedLocale,
    localeAvail: unknown,
    file: string,
  ): void {
    const key = `${category}::${slug}`;
    if (!this.localeCoverage.has(key)) {
      this.localeCoverage.set(key, {
        locales: new Set<SupportedLocale>(),
        declared: new Set<SupportedLocale>(),
        files: [],
      });
    }

    const entry = this.localeCoverage.get(key)!;
    entry.locales.add(locale);
    entry.files.push(file);

    if (Array.isArray(localeAvail)) {
      for (const value of localeAvail) {
        if (isSupportedLocale(value)) {
          entry.declared.add(value);
        }
      }
    }
  }

  private enforceBrandCompliance(
    file: string,
    frontmatter: Record<string, unknown>,
    body: string,
  ): void {
    const combined = [frontmatter.title, frontmatter.description, body].filter(Boolean).join('
');
    const normalized = normalize(combined);

    const medicalMatches = MEDICAL_TERMS.filter((term) => normalized.includes(term));
    if (medicalMatches.length > 0) {
      this.addError(file, `Found medical terminology not allowed for the AI agency brand: ${medicalMatches.join(', ')}`);
    }

    const legacyMatches = LEGACY_PACKAGE_TERMS.filter((term) => normalized.includes(term));
    if (legacyMatches.length > 0) {
      this.addError(file, `Found legacy package naming: ${legacyMatches.join(', ')}`);
    }

    const hasBrandKeyword = BRAND_KEYWORDS.some((keyword) => normalized.includes(keyword));
    if (!hasBrandKeyword) {
      this.addWarning(file, 'Content does not reference AI web agency positioning keywords (e.g., Web Impact Solutions, AI web agency).');
    }
  }

  private validateTranslationCoverage(): void {
    for (const [key, coverage] of this.localeCoverage.entries()) {
      const missingLocales = SUPPORTED_LOCALES.filter((locale) => !coverage.locales.has(locale));

      if (missingLocales.length > 0) {
        const declaredLocales = Array.from(coverage.declared);
        const message = declaredLocales.length > 0
          ? `Missing locale files for ${missingLocales.join(', ')} (declared locales: ${declaredLocales.join(', ')})`
          : `Missing locale files for ${missingLocales.join(', ')}`;
        this.addWarning(coverage.files[0] ?? key, message);
      }

      for (const declared of coverage.declared) {
        if (!coverage.locales.has(declared)) {
          this.addError(coverage.files[0] ?? key, `Declared locale '${declared}' is missing its MDX file`);
        }
      }
    }
  }

  private validateSlugConsistency(): void {
    for (const [slug, files] of this.slugUsage.entries()) {
      if (files.length > 1) {
        this.addError('', `Duplicate slug '${slug}' found in files: ${files.join(', ')}`);
      }
    }
  }

  private addError(file: string, message: string): void {
    this.errors.push({ file, message, level: 'error' });
  }

  private addWarning(file: string, message: string): void {
    this.warnings.push({ file, message, level: 'warning' });
  }

  private printSummary(): void {
    console.log('
[RESULT] Content validation summary');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('[SUCCESS] All content validation checks passed.');
      return;
    }

    if (this.errors.length > 0) {
      console.log(`
Errors (${this.errors.length}):`);
      for (const error of this.errors) {
        const prefix = error.file ? `[${error.file}] ` : '';
        console.log(`- ${prefix}${error.message}`);
      }
    }

    if (this.warnings.length > 0) {
      console.log(`
Warnings (${this.warnings.length}):`);
      for (const warning of this.warnings) {
        const prefix = warning.file ? `[${warning.file}] ` : '';
        console.log(`- ${prefix}${warning.message}`);
      }
    }

    if (this.errors.length > 0) {
      process.exitCode = 1;
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ContentValidator();
  validator.validate().catch((error) => {
    console.error('[FATAL] Content validation failed:', error);
    process.exit(1);
  });
}
