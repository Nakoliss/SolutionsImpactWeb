

export enum BusinessType {
  AI_AGENCY = 'AI_AGENCY',
  MEDICAL_CLINIC = 'MEDICAL_CLINIC',
  ANTIQUE_SHOP = 'ANTIQUE_SHOP',
  AUTO_GARAGE = 'AUTO_GARAGE',
  RETAIL_STORE = 'RETAIL_STORE',
  RESTAURANT = 'RESTAURANT',
  LAW_FIRM = 'LAW_FIRM',
  BEAUTY_SALON = 'BEAUTY_SALON',
  PET_GROOMING = 'PET_GROOMING',
  HOME_SERVICES = 'HOME_SERVICES',
}

export const BUSINESS_TYPE_ORDER: BusinessType[] = [
  BusinessType.AI_AGENCY,
  BusinessType.MEDICAL_CLINIC,
  BusinessType.ANTIQUE_SHOP,
  BusinessType.AUTO_GARAGE,
  BusinessType.RETAIL_STORE,
  BusinessType.RESTAURANT,
  BusinessType.LAW_FIRM,
  BusinessType.BEAUTY_SALON,
  BusinessType.PET_GROOMING,
  BusinessType.HOME_SERVICES,
];

export interface BusinessDesignTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  gradient: string;
  text: string;
  border: string;
  muted: string;
  contrastText: string;
  // Enhanced theme properties for comprehensive styling
  hoverShadow: string;
  borderHover: string;
  cardBackground: string;
  cardBorder: string;
  buttonPrimary: string;
  buttonSecondary: string;
  buttonHover: string;
  linkColor: string;
  linkHover: string;
}

export interface BusinessDesignConfig {
  type: BusinessType;
  theme: BusinessDesignTheme;
  i18nKey: string;
}

export type BusinessDesignMap = Record<BusinessType, BusinessDesignConfig>;

export const BUSINESS_DESIGNS: BusinessDesignMap = {
  [BusinessType.AI_AGENCY]: {
    type: BusinessType.AI_AGENCY,
    theme: {
      primary: '#2563eb',
      secondary: '#0f172a',
      accent: '#38bdf8',
      background: '#020617',
      surface: '#0b1120',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #312e81 100%)',
      text: '#f8fafc',
      border: 'rgba(99, 102, 241, 0.35)',
      muted: '#94a3b8',
      contrastText: '#0f172a',
      hoverShadow: '0 10px 25px -3px rgba(56, 189, 248, 0.2), 0 4px 6px -2px rgba(56, 189, 248, 0.1)',
      borderHover: 'rgba(56, 189, 248, 0.6)',
      cardBackground: 'rgba(11, 17, 32, 0.8)',
      cardBorder: 'rgba(56, 189, 248, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #0ea5e9 0%, #312e81 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(56, 189, 248, 0.1)',
      linkColor: '#38bdf8',
      linkHover: '#0ea5e9',
    },
    i18nKey: 'aiAgency',
  },
  [BusinessType.MEDICAL_CLINIC]: {
    type: BusinessType.MEDICAL_CLINIC,
    theme: {
      primary: '#0ea5e9',
      secondary: '#1d4ed8',
      accent: '#38bdf8',
      background: '#04121f',
      surface: '#0b1c2c',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)',
      text: '#f0f9ff',
      border: 'rgba(56, 189, 248, 0.35)',
      muted: '#94a3b8',
      contrastText: '#04121f',
      hoverShadow: '0 10px 25px -3px rgba(14, 165, 233, 0.2), 0 4px 6px -2px rgba(14, 165, 233, 0.1)',
      borderHover: 'rgba(14, 165, 233, 0.6)',
      cardBackground: 'rgba(11, 28, 44, 0.8)',
      cardBorder: 'rgba(14, 165, 233, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(14, 165, 233, 0.1)',
      linkColor: '#0ea5e9',
      linkHover: '#38bdf8',
    },
    i18nKey: 'medical',
  },
  [BusinessType.ANTIQUE_SHOP]: {
    type: BusinessType.ANTIQUE_SHOP,
    theme: {
      primary: '#b45309',
      secondary: '#78350f',
      accent: '#facc15',
      background: '#1f1309',
      surface: '#3f2a1d',
      gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)',
      text: '#fefce8',
      border: 'rgba(244, 191, 117, 0.35)',
      muted: '#d6d3c2',
      contrastText: '#1f1309',
      hoverShadow: '0 10px 25px -3px rgba(250, 204, 21, 0.2), 0 4px 6px -2px rgba(250, 204, 21, 0.1)',
      borderHover: 'rgba(250, 204, 21, 0.6)',
      cardBackground: 'rgba(63, 42, 29, 0.8)',
      cardBorder: 'rgba(250, 204, 21, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(250, 204, 21, 0.1)',
      linkColor: '#facc15',
      linkHover: '#d97706',
    },
    i18nKey: 'antique',
  },
  [BusinessType.AUTO_GARAGE]: {
    type: BusinessType.AUTO_GARAGE,
    theme: {
      primary: '#1f2937',
      secondary: '#0f172a',
      accent: '#f97316',
      background: '#05060a',
      surface: '#111827',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #f97316 100%)',
      text: '#f3f4f6',
      border: 'rgba(249, 115, 22, 0.45)',
      muted: '#9ca3af',
      contrastText: '#05060a',
      hoverShadow: '0 10px 25px -3px rgba(249, 115, 22, 0.2), 0 4px 6px -2px rgba(249, 115, 22, 0.1)',
      borderHover: 'rgba(249, 115, 22, 0.6)',
      cardBackground: 'rgba(17, 24, 39, 0.8)',
      cardBorder: 'rgba(249, 115, 22, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #f97316 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(249, 115, 22, 0.1)',
      linkColor: '#f97316',
      linkHover: '#ea580c',
    },
    i18nKey: 'autoGarage',
  },
  [BusinessType.RETAIL_STORE]: {
    type: BusinessType.RETAIL_STORE,
    theme: {
      primary: '#2563eb',
      secondary: '#1e3a8a',
      accent: '#22c55e',
      background: '#031224',
      surface: '#071b35',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #22c55e 100%)',
      text: '#f8fafc',
      border: 'rgba(37, 99, 235, 0.35)',
      muted: '#a5b4fc',
      contrastText: '#031224',
      hoverShadow: '0 10px 25px -3px rgba(34, 197, 94, 0.2), 0 4px 6px -2px rgba(34, 197, 94, 0.1)',
      borderHover: 'rgba(34, 197, 94, 0.6)',
      cardBackground: 'rgba(7, 27, 53, 0.8)',
      cardBorder: 'rgba(34, 197, 94, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #22c55e 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(34, 197, 94, 0.1)',
      linkColor: '#22c55e',
      linkHover: '#16a34a',
    },
    i18nKey: 'retailStore',
  },
  [BusinessType.RESTAURANT]: {
    type: BusinessType.RESTAURANT,
    theme: {
      primary: '#b91c1c',
      secondary: '#7f1d1d',
      accent: '#f97316',
      background: '#2c0a0a',
      surface: '#3f0f0f',
      gradient: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 60%, #f97316 100%)',
      text: '#fef2f2',
      border: 'rgba(239, 68, 68, 0.4)',
      muted: '#fca5a5',
      contrastText: '#2c0a0a',
      hoverShadow: '0 10px 25px -3px rgba(249, 115, 22, 0.2), 0 4px 6px -2px rgba(249, 115, 22, 0.1)',
      borderHover: 'rgba(249, 115, 22, 0.6)',
      cardBackground: 'rgba(63, 15, 15, 0.8)',
      cardBorder: 'rgba(249, 115, 22, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 60%, #f97316 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(249, 115, 22, 0.1)',
      linkColor: '#f97316',
      linkHover: '#ea580c',
    },
    i18nKey: 'restaurant',
  },
  [BusinessType.LAW_FIRM]: {
    type: BusinessType.LAW_FIRM,
    theme: {
      primary: '#1e3a8a',
      secondary: '#0f172a',
      accent: '#f59e0b',
      background: '#070b17',
      surface: '#111c33',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 65%, #f59e0b 100%)',
      text: '#f8fafc',
      border: 'rgba(30, 64, 175, 0.45)',
      muted: '#9ca3af',
      contrastText: '#070b17',
      hoverShadow: '0 10px 25px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -2px rgba(245, 158, 11, 0.1)',
      borderHover: 'rgba(245, 158, 11, 0.6)',
      cardBackground: 'rgba(17, 28, 51, 0.8)',
      cardBorder: 'rgba(245, 158, 11, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 65%, #f59e0b 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(245, 158, 11, 0.1)',
      linkColor: '#f59e0b',
      linkHover: '#d97706',
    },
    i18nKey: 'lawFirm',
  },
  [BusinessType.BEAUTY_SALON]: {
    type: BusinessType.BEAUTY_SALON,
    theme: {
      primary: '#db2777',
      secondary: '#831843',
      accent: '#fbbf24',
      background: '#2f0217',
      surface: '#401020',
      gradient: 'linear-gradient(135deg, #db2777 0%, #831843 60%, #fbbf24 100%)',
      text: '#fdf2f8',
      border: 'rgba(219, 39, 119, 0.35)',
      muted: '#f9a8d4',
      contrastText: '#2f0217',
      hoverShadow: '0 10px 25px -3px rgba(251, 191, 36, 0.2), 0 4px 6px -2px rgba(251, 191, 36, 0.1)',
      borderHover: 'rgba(251, 191, 36, 0.6)',
      cardBackground: 'rgba(64, 16, 32, 0.8)',
      cardBorder: 'rgba(251, 191, 36, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #db2777 0%, #831843 60%, #fbbf24 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(251, 191, 36, 0.1)',
      linkColor: '#fbbf24',
      linkHover: '#f59e0b',
    },
    i18nKey: 'beautySalon',
  },
  [BusinessType.PET_GROOMING]: {
    type: BusinessType.PET_GROOMING,
    theme: {
      primary: '#22c55e',
      secondary: '#0f766e',
      accent: '#f97316',
      background: '#06221c',
      surface: '#0b3028',
      gradient: 'linear-gradient(135deg, #0f766e 0%, #22c55e 55%, #f97316 100%)',
      text: '#f0fdf4',
      border: 'rgba(34, 197, 94, 0.4)',
      muted: '#a7f3d0',
      contrastText: '#06221c',
      hoverShadow: '0 10px 25px -3px rgba(249, 115, 22, 0.2), 0 4px 6px -2px rgba(249, 115, 22, 0.1)',
      borderHover: 'rgba(249, 115, 22, 0.6)',
      cardBackground: 'rgba(11, 48, 40, 0.8)',
      cardBorder: 'rgba(249, 115, 22, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #0f766e 0%, #22c55e 55%, #f97316 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(249, 115, 22, 0.1)',
      linkColor: '#f97316',
      linkHover: '#ea580c',
    },
    i18nKey: 'petGrooming',
  },
  [BusinessType.HOME_SERVICES]: {
    type: BusinessType.HOME_SERVICES,
    theme: {
      primary: '#0369a1',
      secondary: '#0f172a',
      accent: '#22c55e',
      background: '#06121f',
      surface: '#0b1f2c',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #0369a1 55%, #22c55e 100%)',
      text: '#f8fafc',
      border: 'rgba(3, 105, 161, 0.35)',
      muted: '#94a3b8',
      contrastText: '#06121f',
      hoverShadow: '0 10px 25px -3px rgba(34, 197, 94, 0.2), 0 4px 6px -2px rgba(34, 197, 94, 0.1)',
      borderHover: 'rgba(34, 197, 94, 0.6)',
      cardBackground: 'rgba(11, 31, 44, 0.8)',
      cardBorder: 'rgba(34, 197, 94, 0.2)',
      buttonPrimary: 'linear-gradient(135deg, #0f172a 0%, #0369a1 55%, #22c55e 100%)',
      buttonSecondary: 'transparent',
      buttonHover: 'rgba(34, 197, 94, 0.1)',
      linkColor: '#22c55e',
      linkHover: '#16a34a',
    },
    i18nKey: 'homeServices',
  },
};

export const getDesignTheme = (type: BusinessType): BusinessDesignTheme =>
  BUSINESS_DESIGNS[type].theme;

export const getDesignConfig = (type: BusinessType): BusinessDesignConfig =>
  BUSINESS_DESIGNS[type];

/**
 * Get the CSS theme class name for a business type
 */
export const getThemeClassName = (type: BusinessType): string => {
  const classNameMap: Record<BusinessType, string> = {
    [BusinessType.AI_AGENCY]: 'theme-ai-agency',
    [BusinessType.MEDICAL_CLINIC]: 'theme-medical-clinic',
    [BusinessType.ANTIQUE_SHOP]: 'theme-antique-shop',
    [BusinessType.AUTO_GARAGE]: 'theme-auto-garage',
    [BusinessType.RETAIL_STORE]: 'theme-retail-store',
    [BusinessType.RESTAURANT]: 'theme-restaurant',
    [BusinessType.LAW_FIRM]: 'theme-law-firm',
    [BusinessType.BEAUTY_SALON]: 'theme-beauty-salon',
    [BusinessType.PET_GROOMING]: 'theme-pet-grooming',
    [BusinessType.HOME_SERVICES]: 'theme-home-services',
  };

  return classNameMap[type];
};

/**
 * Get CSS variables object for a business type theme
 */
export const getThemeCSSVariables = (type: BusinessType): Record<string, string> => {
  const theme = getDesignTheme(type);

  return {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-accent': theme.accent,
    '--theme-background': theme.background,
    '--theme-surface': theme.surface,
    '--theme-gradient': theme.gradient,
    '--theme-text': theme.text,
    '--theme-border': theme.border,
    '--theme-muted': theme.muted,
    '--theme-contrast-text': theme.contrastText,
    '--theme-hover-shadow': theme.hoverShadow,
    '--theme-border-hover': theme.borderHover,
    '--theme-card-background': theme.cardBackground,
    '--theme-card-border': theme.cardBorder,
    '--theme-button-primary': theme.buttonPrimary,
    '--theme-button-secondary': theme.buttonSecondary,
    '--theme-button-hover': theme.buttonHover,
    '--theme-link-color': theme.linkColor,
    '--theme-link-hover': theme.linkHover,
  };
};
