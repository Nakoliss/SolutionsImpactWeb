/**
 * Roadmap export utilities for generating Markdown and JSON formats
 */

export interface RoadmapExportData {
  generatedAt: string;
  locale: 'fr' | 'en';
  selectedCapabilities: string[];
  totalBudget: number;
  totalDuration: number;
  phases: {
    immediate: ExportCapability[];
    short: ExportCapability[];
    medium: ExportCapability[];
    long: ExportCapability[];
  };
  metadata: {
    companyName?: string;
    contactEmail?: string;
    notes?: string;
  };
}

export interface ExportCapability {
  id: string;
  name: string;
  description: string;
  duration: { min: number; max: number };
  effort: string;
  price: { min: number; max: number };
  type: string;
  benefits: string[];
  compliance: boolean;
}

const PHASE_NAMES = {
  fr: {
    immediate: 'Phase 1: Immédiat (0-2 mois)',
    short: 'Phase 2: Court terme (2-6 mois)',
    medium: 'Phase 3: Moyen terme (6-12 mois)',
    long: 'Phase 4: Long terme (12+ mois)'
  },
  en: {
    immediate: 'Phase 1: Immediate (0-2 months)',
    short: 'Phase 2: Short term (2-6 months)',
    medium: 'Phase 3: Medium term (6-12 months)',
    long: 'Phase 4: Long term (12+ months)'
  }
};

const CONTENT = {
  fr: {
    title: 'Feuille de Route IA - AI Web Agency',
    generatedOn: 'Généré le',
    totalBudget: 'Budget total estimé',
    totalDuration: 'Durée totale estimée',
    weeks: 'semaines',
    capabilities: 'Capacités sélectionnées',
    roadmapPhases: 'Phases de la feuille de route',
    duration: 'Durée',
    effort: 'Effort',
    price: 'Prix',
    benefits: 'Avantages',
    compliance: 'Conformité Loi 25',
    required: 'Requis',
    notRequired: 'Non requis',
    notes: 'Notes',
    disclaimer: 'Cette feuille de route est une estimation basée sur nos services standards. Les prix et délais peuvent varier selon les exigences spécifiques du projet.'
  },
  en: {
    title: 'AI Roadmap - AI Web Agency',
    generatedOn: 'Generated on',
    totalBudget: 'Total estimated budget',
    totalDuration: 'Total estimated duration',
    weeks: 'weeks',
    capabilities: 'Selected capabilities',
    roadmapPhases: 'Roadmap phases',
    duration: 'Duration',
    effort: 'Effort',
    price: 'Price',
    benefits: 'Benefits',
    compliance: 'Law 25 Compliance',
    required: 'Required',
    notRequired: 'Not required',
    notes: 'Notes',
    disclaimer: 'This roadmap is an estimate based on our standard services. Prices and timelines may vary based on specific project requirements.'
  }
};

/**
 * Export roadmap data as Markdown format
 */
export function exportRoadmapAsMarkdown(data: RoadmapExportData): string {
  const content = CONTENT[data.locale];
  const phaseNames = PHASE_NAMES[data.locale];
  
  let markdown = `# ${content.title}\n\n`;
  
  // Header information
  markdown += `**${content.generatedOn}:** ${new Date(data.generatedAt).toLocaleDateString(data.locale === 'fr' ? 'fr-CA' : 'en-CA')}\n\n`;
  
  // Summary
  markdown += `## Résumé\n\n`;
  markdown += `- **${content.totalBudget}:** $${data.totalBudget.toLocaleString()} CAD\n`;
  markdown += `- **${content.totalDuration}:** ${Math.ceil(data.totalDuration)} ${content.weeks}\n`;
  markdown += `- **${content.capabilities}:** ${data.selectedCapabilities.length}\n\n`;
  
  // Phases
  markdown += `## ${content.roadmapPhases}\n\n`;
  
  Object.entries(data.phases).forEach(([phaseKey, capabilities]) => {
    if (capabilities.length === 0) return;
    
    const phaseName = phaseNames[phaseKey as keyof typeof phaseNames];
    markdown += `### ${phaseName}\n\n`;
    
    capabilities.forEach((capability, index) => {
      markdown += `#### ${index + 1}. ${capability.name}\n\n`;
      markdown += `${capability.description}\n\n`;
      
      markdown += `**Détails:**\n`;
      markdown += `- **${content.duration}:** ${capability.duration.min}-${capability.duration.max} ${content.weeks}\n`;
      markdown += `- **${content.effort}:** ${capability.effort}\n`;
      markdown += `- **${content.price}:** $${capability.price.min.toLocaleString()}-$${capability.price.max.toLocaleString()} CAD\n`;
      markdown += `- **${content.compliance}:** ${capability.compliance ? content.required : content.notRequired}\n\n`;
      
      if (capability.benefits.length > 0) {
        markdown += `**${content.benefits}:**\n`;
        capability.benefits.forEach(benefit => {
          markdown += `- ${benefit}\n`;
        });
        markdown += `\n`;
      }
    });
  });
  
  // Notes section
  if (data.metadata.notes) {
    markdown += `## ${content.notes}\n\n`;
    markdown += `${data.metadata.notes}\n\n`;
  }
  
  // Disclaimer
  markdown += `---\n\n`;
  markdown += `*${content.disclaimer}*\n\n`;
  
  // Contact information
  if (data.metadata.contactEmail) {
    markdown += `**Contact:** ${data.metadata.contactEmail}\n`;
  }
  markdown += `**AI Web Agency** - Expert en transformation numérique au Québec\n`;
  
  return markdown;
}

/**
 * Export roadmap data as JSON format
 */
export function exportRoadmapAsJSON(data: RoadmapExportData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Download file with given content and filename
 */
export function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for export
 */
export function generateExportFilename(locale: 'fr' | 'en', format: 'md' | 'json', companyName?: string): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const prefix = companyName 
    ? `${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_`
    : '';
  
  const baseName = locale === 'fr' 
    ? 'feuille_de_route_ia'
    : 'ai_roadmap';
    
  return `${prefix}${baseName}_${timestamp}.${format}`;
}

/**
 * Export roadmap with download
 */
export function exportAndDownloadRoadmap(
  data: RoadmapExportData, 
  format: 'markdown' | 'json',
  companyName?: string
): void {
  let content: string;
  let contentType: string;
  let extension: 'md' | 'json';
  
  if (format === 'markdown') {
    content = exportRoadmapAsMarkdown(data);
    contentType = 'text/markdown';
    extension = 'md';
  } else {
    content = exportRoadmapAsJSON(data);
    contentType = 'application/json';
    extension = 'json';
  }
  
  const filename = generateExportFilename(data.locale, extension, companyName);
  downloadFile(content, filename, contentType);
}