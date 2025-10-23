'use client';

import { memo, useState } from 'react';

import type { ServiceCategory } from '@/lib/serviceLoader';

import { ServiceDetailModal } from './ServiceDetailModal';
import { ServiceSummaryCard } from './ServiceSummaryCard';

interface ServiceGridMessages {
  loading: string;
  empty: string;
  tiersAria: string;
  detailsSoon: string;
  priceAria: string;
  setupCostAria: string;
  closeButton: string;
  clickForDetails: string;
}

interface ServiceGridProps {
  services: ServiceCategory[];
  isLoading?: boolean;
  messages: ServiceGridMessages;
}

function ServiceGridComponent({
  services,
  isLoading = false,
  messages,
}: ServiceGridProps) {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: ServiceCategory) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  if (isLoading) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/20 bg-black/20 p-10 text-center text-sm text-slate-300">
        <span
          className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"
          aria-hidden="true"
        />
        <span aria-live="polite">{messages.loading}</span>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div
        className="mt-12 rounded-3xl border border-white/10 bg-black/30 p-10 text-center text-sm text-slate-300"
        role="status"
      >
        {messages.empty}
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 grid gap-6 lg:grid-cols-2" role="list">
        {services.map((service) => (
          <div key={service.id} role="listitem">
            <ServiceSummaryCard
              service={service}
              onClick={() => handleServiceClick(service)}
              clickForDetailsText={messages.clickForDetails}
            />
          </div>
        ))}
      </div>

      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
        messages={{
          detailsSoon: messages.detailsSoon,
          tiersAria: messages.tiersAria,
          priceAria: messages.priceAria,
          setupCostAria: messages.setupCostAria,
          closeButton: messages.closeButton,
        }}
      />
    </>
  );
}

export const ServiceGrid = memo(ServiceGridComponent);
