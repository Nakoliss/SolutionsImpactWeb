import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/lead/route';
import { NextRequest } from 'next/server';

// Mock Supabase REST helper
vi.mock('@/lib/supabaseServer', () => ({
  supabaseRestInsert: vi.fn().mockResolvedValue({ id: 'test-id' }),
}));

describe('/api/lead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log a lead successfully', async () => {
    const { supabaseRestInsert } = await import('@/lib/supabaseServer');
    
    const request = new NextRequest('http://localhost/api/lead', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        locale: 'fr',
        source: 'contact_form',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(supabaseRestInsert).toHaveBeenCalledWith('leads', expect.objectContaining({
      name: 'Test User',
      email: 'test@example.com',
      locale: 'fr',
      source: 'contact_form',
    }));
  });

  it('should handle missing fields gracefully', async () => {
    const request = new NextRequest('http://localhost/api/lead', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        // Missing name
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Should still return success (fail gracefully)
    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
  });

  it('should extract UTM parameters', async () => {
    const { supabaseRestInsert } = await import('@/lib/supabaseServer');
    
    const request = new NextRequest('http://localhost/api/lead', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        locale: 'en',
        source: 'organic',
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test-campaign',
      }),
    });

    await POST(request);

    expect(supabaseRestInsert).toHaveBeenCalledWith('leads', expect.objectContaining({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'test-campaign',
    }));
  });
});

