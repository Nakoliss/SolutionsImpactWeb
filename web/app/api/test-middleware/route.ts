import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Middleware test - if you see this, middleware is NOT redirecting',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}


