import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import type { LeadFormData } from '@/components/LeadCaptureForm';
import { sendContactFormEmail } from '@/lib/emailService';
import { getAllLeads, getLeadStats,storeLead } from '@/lib/leadStorage';

/**
 * POST /api/leads - Submit a new lead
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, companySize, interest, source, locale } = body;
    
    if (!name || !email || !companySize || !interest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Check for honeypot (spam detection)
    if (body.honeypot) {
      console.log('Spam submission detected:', { email, honeypot: body.honeypot });
      // Return success to not let spammer know they were detected
      return NextResponse.json({ success: true });
    }
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Prepare lead data
    const leadData: LeadFormData & { 
      source: string; 
      locale: string; 
      timestamp: string;
      ipAddress?: string;
      userAgent?: string;
    } = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      companySize,
      interest,
      source: source || 'unknown',
      locale: locale || 'fr',
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent
    };
    
    // Store the lead
    const storedLead = storeLead(leadData);
    
    // Send email notification if this is a contact form submission
    if (body.message && (body.name || body.email)) {
      try {
        const emailResult = await sendContactFormEmail({
          name: leadData.name,
          email: leadData.email,
          phone: body.phone,
          company: body.company,
          message: body.message,
          wantsConsultation: body.wantsConsultation || false,
          locale: leadData.locale as 'fr' | 'en',
          timestamp: leadData.timestamp
        });

        if (emailResult.success) {
          console.log('Contact form email sent successfully');
        } else {
          console.error('Contact form email failed:', emailResult.error);
          if (process.env.NODE_ENV === 'development') {
            console.warn('[dev] Email dispatch failed or disabled; proceeding without error.');
          } else {
            return NextResponse.json(
              { error: 'Failed to send contact notification', details: emailResult.error },
              { status: 502 }
            );
          }
        }
      } catch (emailError) {
        console.error('Failed to send contact form email:', emailError);
        if (process.env.NODE_ENV === 'development') {
          console.warn('[dev] Email dispatch threw; proceeding without error.');
        } else {
          return NextResponse.json(
            { error: 'Failed to send contact notification' },
            { status: 502 }
          );
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      id: storedLead.id,
      message: 'Lead submitted successfully'
    });
    
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads - Get leads (development only)
 */
export async function GET(request: NextRequest) {
  // In production, this should be protected with authentication
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }
  
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    switch (action) {
      case 'stats':
        const stats = getLeadStats();
        return NextResponse.json(stats);
      
      case 'export':
        // This would typically be protected and require admin access
        const { exportLeadsToCSV } = await import('@/lib/leadStorage');
        const csvData = exportLeadsToCSV();
        
        return new NextResponse(csvData, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="leads.csv"'
          }
        });
      
      default:
        const leads = getAllLeads();
        return NextResponse.json({
          leads: leads.slice(0, 50), // Limit to 50 most recent
          total: leads.length
        });
    }
  } catch (error) {
    console.error('Error retrieving leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
