import type { ReactElement } from 'react';

import type { SupportedLocale } from '@/content';
import type {
  BusinessDesignTheme,
} from '@/lib/businessDesigns';
import type { ServiceCatalog } from '@/lib/serviceLoader';

export interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: SupportedLocale;
  services: ServiceCatalog;
  theme: BusinessDesignTheme;
  designCopy: any;
  modalCopy: any;
}

export type BusinessModalComponent = (props: BusinessModalProps) => ReactElement | null;


