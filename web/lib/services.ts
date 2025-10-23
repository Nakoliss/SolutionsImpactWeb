import type { ServiceCatalog, ServiceCategory } from '@/lib/serviceLoader';

export function getServiceById(
    catalog: ServiceCatalog,
    id: string,
): ServiceCategory | undefined {
    return catalog.services.find((service) => service.id === id);
}

export function getPrimaryPrice(service?: ServiceCategory): string | undefined {
    if (!service) {
        return undefined;
    }

    if (service.headlinePrice) {
        return service.headlinePrice;
    }

    const pricedTier = service.tiers.find((tier) => tier.price);
    return pricedTier?.price;
}