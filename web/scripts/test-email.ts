/**
 * Test script to verify email configuration
 * Run with: npx tsx scripts/test-email.ts
 */

import { testEmailConfiguration } from '../lib/emailService';

async function testEmail() {
  console.log('Testing email configuration...');
  
  const result = await testEmailConfiguration();
  
  if (result.success) {
    console.log('✅ Email configuration is working!');
  } else {
    console.log('❌ Email configuration failed:', result.error);
  }
}

testEmail().catch(console.error);