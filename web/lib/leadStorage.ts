import fs from 'fs';
import path from 'path';

import type { LeadFormData } from '@/components/LeadCaptureForm';

export interface StoredLead extends LeadFormData {
  id: string;
  timestamp: string;
  source: string;
  locale: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * In-memory storage for development/testing
 * In production, this would be replaced with a proper database
 */
let memoryStorage: StoredLead[] = [];

/**
 * Get the leads storage file path
 */
function getLeadsFilePath(): string {
  return path.join(process.cwd(), 'data', 'leads.json');
}

/**
 * Ensure the data directory exists
 */
function ensureDataDirectory(): void {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Load leads from JSON file
 */
function loadLeadsFromFile(): StoredLead[] {
  try {
    const filePath = getLeadsFilePath();
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error loading leads from file:', error);
  }
  return [];
}

/**
 * Save leads to JSON file
 */
function saveLeadsToFile(leads: StoredLead[]): void {
  try {
    ensureDataDirectory();
    const filePath = getLeadsFilePath();
    fs.writeFileSync(filePath, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Error saving leads to file:', error);
  }
}

/**
 * Generate a unique ID for a lead
 */
function generateLeadId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Store a new lead submission
 */
export function storeLead(
  leadData: LeadFormData & { 
    source: string; 
    locale: string; 
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
  }
): StoredLead {
  const storedLead: StoredLead = {
    ...leadData,
    id: generateLeadId()
  };
  
  // Console log for development
  console.log('📝 New lead submission:', {
    id: storedLead.id,
    name: storedLead.name,
    email: storedLead.email,
    companySize: storedLead.companySize,
    interest: storedLead.interest,
    source: storedLead.source,
    locale: storedLead.locale,
    timestamp: storedLead.timestamp
  });
  
  // Store in memory
  memoryStorage.push(storedLead);
  
  // Also store in file for persistence
  try {
    const existingLeads = loadLeadsFromFile();
    existingLeads.push(storedLead);
    saveLeadsToFile(existingLeads);
  } catch (error) {
    console.error('Failed to save lead to file:', error);
  }
  
  return storedLead;
}

/**
 * Get all stored leads (development function)
 */
export function getAllLeads(): StoredLead[] {
  try {
    // Try to load from file first
    const fileLeads = loadLeadsFromFile();
    
    // Merge with memory storage (for any leads not yet persisted)
    const allLeads = [...fileLeads];
    
    // Add any memory-only leads
    for (const memoryLead of memoryStorage) {
      if (!fileLeads.find(lead => lead.id === memoryLead.id)) {
        allLeads.push(memoryLead);
      }
    }
    
    return allLeads.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error getting all leads:', error);
    return memoryStorage;
  }
}

/**
 * Get leads by source
 */
export function getLeadsBySource(source: string): StoredLead[] {
  return getAllLeads().filter(lead => lead.source === source);
}

/**
 * Get leads by date range
 */
export function getLeadsByDateRange(startDate: Date, endDate: Date): StoredLead[] {
  return getAllLeads().filter(lead => {
    const leadDate = new Date(lead.timestamp);
    return leadDate >= startDate && leadDate <= endDate;
  });
}

/**
 * Get lead statistics
 */
export function getLeadStats(): {
  total: number;
  bySource: Record<string, number>;
  byCompanySize: Record<string, number>;
  byInterest: Record<string, number>;
  byLocale: Record<string, number>;
  recent24h: number;
} {
  const allLeads = getAllLeads();
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const stats = {
    total: allLeads.length,
    bySource: {} as Record<string, number>,
    byCompanySize: {} as Record<string, number>,
    byInterest: {} as Record<string, number>,
    byLocale: {} as Record<string, number>,
    recent24h: 0
  };
  
  for (const lead of allLeads) {
    // Count by source
    stats.bySource[lead.source] = (stats.bySource[lead.source] || 0) + 1;
    
    // Count by company size
    stats.byCompanySize[lead.companySize] = (stats.byCompanySize[lead.companySize] || 0) + 1;
    
    // Count by interest
    stats.byInterest[lead.interest] = (stats.byInterest[lead.interest] || 0) + 1;
    
    // Count by locale
    stats.byLocale[lead.locale] = (stats.byLocale[lead.locale] || 0) + 1;
    
    // Count recent leads
    if (new Date(lead.timestamp) >= yesterday) {
      stats.recent24h++;
    }
  }
  
  return stats;
}

/**
 * Export leads to CSV format
 */
export function exportLeadsToCSV(): string {
  const allLeads = getAllLeads();
  
  if (allLeads.length === 0) {
    return 'No leads to export';
  }
  
  const headers = [
    'ID',
    'Timestamp',
    'Name',
    'Email',
    'Company Size',
    'Interest',
    'Source',
    'Locale',
    'IP Address',
    'User Agent'
  ];
  
  const csvRows = [
    headers.join(','),
    ...allLeads.map(lead => [
      lead.id,
      lead.timestamp,
      `"${lead.name}"`,
      lead.email,
      lead.companySize,
      `"${lead.interest}"`,
      lead.source,
      lead.locale,
      lead.ipAddress || '',
      `"${lead.userAgent || ''}"`
    ].join(','))
  ];
  
  return csvRows.join('\n');
}

/**
 * Clear all leads (development function)
 */
export function clearAllLeads(): void {
  memoryStorage = [];
  try {
    const filePath = getLeadsFilePath();
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error clearing leads file:', error);
  }
  console.log('All leads cleared');
}