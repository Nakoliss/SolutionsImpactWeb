import { type NextRequest,NextResponse } from 'next/server';

import type { DataRequestRecord, DataRequestType } from '@/lib/dataRequests';
import { DATA_REQUEST_TYPES, recordDataRequest } from '@/lib/dataRequests';
import { sendDataRequestEmail } from '@/lib/emailService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TYPES = new Set<DataRequestType>(DATA_REQUEST_TYPES);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, requestType, details, locale = 'fr' } = body ?? {};

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!requestType || typeof requestType !== 'string' || !ALLOWED_TYPES.has(requestType as DataRequestType)) {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    const localeValue = locale === 'en' ? 'en' : 'fr';
    const requestTypeValue = requestType as DataRequestType;

    const payload: Omit<DataRequestRecord, 'id' | 'createdAt' | 'status'> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      requestType: requestTypeValue,
      locale: localeValue,
    };

    if (typeof company === 'string') {
      const trimmedCompany = company.trim();
      if (trimmedCompany) {
        payload.company = trimmedCompany;
      }
    }

    if (typeof details === 'string') {
      const trimmedDetails = details.trim();
      if (trimmedDetails) {
        payload.details = trimmedDetails;
      }
    }

    const record = recordDataRequest(payload);

    const emailPayload = {
      id: record.id,
      requestType: record.requestType,
      name: record.name,
      email: record.email,
      locale: record.locale,
      createdAt: record.createdAt,
      ...(record.company ? { company: record.company } : {}),
      ...(record.details ? { details: record.details } : {}),
    };

    await sendDataRequestEmail(emailPayload);

    return NextResponse.json({
      success: true,
      id: record.id,
      message: 'Request received. The privacy team will follow up within 30 days.',
    });
  } catch (error) {
    console.error('Failed to process data request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
