import { BusinessType } from '@/lib/businessDesigns';

import AIAgencyModal from './AIAgencyModal';
import AntiqueModal from './AntiqueModal';
import AutoGarageModal from './AutoGarageModal';
import BeautySalonModal from './BeautySalonModal';
import HomeServicesModal from './HomeServicesModal';
import LawFirmModal from './LawFirmModal';
import MedicalModal from './MedicalModal';
import PetGroomingModal from './PetGroomingModal';
import RestaurantModal from './RestaurantModal';
import RetailStoreModal from './RetailStoreModal';
import type { BusinessModalComponent } from './types';

export type { BusinessModalComponent, BusinessModalProps } from './types';
export {
  AIAgencyModal,
  AntiqueModal,
  AutoGarageModal,
  BeautySalonModal,
  HomeServicesModal,
  LawFirmModal,
  MedicalModal,
  PetGroomingModal,
  RestaurantModal,
  RetailStoreModal,
};

export const MODAL_COMPONENTS: Record<BusinessType, BusinessModalComponent> = {
  [BusinessType.AI_AGENCY]: AIAgencyModal,
  [BusinessType.MEDICAL_CLINIC]: MedicalModal,
  [BusinessType.ANTIQUE_SHOP]: AntiqueModal,
  [BusinessType.AUTO_GARAGE]: AutoGarageModal,
  [BusinessType.RETAIL_STORE]: RetailStoreModal,
  [BusinessType.RESTAURANT]: RestaurantModal,
  [BusinessType.LAW_FIRM]: LawFirmModal,
  [BusinessType.BEAUTY_SALON]: BeautySalonModal,
  [BusinessType.PET_GROOMING]: PetGroomingModal,
  [BusinessType.HOME_SERVICES]: HomeServicesModal,
};

export function getModalComponent(type: BusinessType): BusinessModalComponent {
  return MODAL_COMPONENTS[type];
}
