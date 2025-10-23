import fs from 'fs';
import path from 'path';

export type DataRequestType = 'access' | 'rectification' | 'portability' | 'deletion' | 'consent-withdrawal';
export const DATA_REQUEST_TYPES: readonly DataRequestType[] = [
  'access',
  'rectification',
  'portability',
  'deletion',
  'consent-withdrawal',
];

export interface DataRequestRecord {
  id: string;
  requestType: DataRequestType;
  name: string;
  email: string;
  company?: string;
  details?: string;
  locale: 'fr' | 'en';
  createdAt: string;
  status: 'received' | 'in-review' | 'completed';
}

const FILE_PATH = path.join(process.cwd(), 'data', 'data-requests.json');

function ensureFile(): void {
  const dir = path.dirname(FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '[]');
  }
}

function loadRequests(): DataRequestRecord[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(raw) as DataRequestRecord[];
  } catch (error) {
    console.error('Failed to load data requests:', error);
    return [];
  }
}

function saveRequests(requests: DataRequestRecord[]): void {
  try {
    ensureFile();
    fs.writeFileSync(FILE_PATH, JSON.stringify(requests, null, 2));
  } catch (error) {
    console.error('Failed to save data requests:', error);
  }
}

function generateId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function recordDataRequest(
  request: Omit<DataRequestRecord, 'id' | 'createdAt' | 'status'>
): DataRequestRecord {
  const entry: DataRequestRecord = {
    ...request,
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: 'received',
  };

  const existing = loadRequests();
  existing.push(entry);
  saveRequests(existing);

  return entry;
}
