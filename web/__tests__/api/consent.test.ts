import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/consent/route';
import { NextRequest } from 'next/server';

// Mock Supabase REST helper
vi.mock('@/lib/supabaseServer', () => ({
  supabaseRestInsert: vi.fn().mockResolvedValue({ id: 'test-id' }),
}));

describe('/api/consent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log consent successfully', async () => {
    const { supabaseRestInsert } = await import('@/lib/supabaseServer');
    
    const request = new NextRequest('http://localhost/api/consent', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '192.168.1.1',
        'user-agent': 'test-agent',
      },
      body: JSON.stringify({
        category: 'analytics',
        granted: true,
        actor: 'cookie_123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(supabaseRestInsert).toHaveBeenCalledWith('consents', expect.objectContaining({
      category: 'analytics',
      granted: true,
      actor: 'cookie_123',
    }));
  });

  it('should use IP address as actor if not provided', async () => {
    const { supabaseRestInsert } = await import('@/lib/supabaseServer');
    
    const request = new NextRequest('http://localhost/api/consent', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '192.168.1.1',
      },
      body: JSON.stringify({
        category: 'ads',
        granted: false,
      }),
    });

    await POST(request);

    expect(supabaseRestInsert).toHaveBeenCalledWith('consents', expect.objectContaining({
      actor: '192.168.1.1',
    }));
  });

  it('should require category and granted fields', async () => {
    const request = new NextRequest('http://localhost/api/consent', {
      method: 'POST',
      body: JSON.stringify({
        // Missing category and granted
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });
});

