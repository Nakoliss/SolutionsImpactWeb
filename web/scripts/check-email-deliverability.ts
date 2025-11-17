/**
 * Email Deliverability Check Script
 * 
 * Checks SPF, DKIM, and DMARC DNS records for solutionsimpactweb.com
 * Run with: npx tsx scripts/check-email-deliverability.ts
 */

import { promises as dns } from 'dns';
import { promisify } from 'util';

const DOMAIN = 'solutionsimpactweb.com';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'not-found';
  message: string;
  details?: string;
}

/**
 * Resolve TXT records for a domain
 */
async function resolveTXT(hostname: string): Promise<string[]> {
  try {
    const records = await dns.resolveTxt(hostname);
    return records.flat().map(record => Array.isArray(record) ? record.join('') : record);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOTFOUND' || (error as NodeJS.ErrnoException).code === 'ENODATA') {
      return [];
    }
    throw error;
  }
}

/**
 * Check SPF record
 */
async function checkSPF(): Promise<CheckResult> {
  try {
    const records = await resolveTXT(DOMAIN);
    const spfRecord = records.find(record => record.startsWith('v=spf1'));
    
    if (!spfRecord) {
      return {
        name: 'SPF',
        status: 'not-found',
        message: 'No SPF record found',
        details: 'Add a TXT record at the root domain with SPF policy (e.g., v=spf1 include:_spf.resend.com ~all)',
      };
    }
    
    // Basic SPF validation
    const isValid = /^v=spf1/.test(spfRecord);
    const hasInclude = spfRecord.includes('include:');
    const hasAll = /[~-]all/.test(spfRecord);
    
    if (!isValid) {
      return {
        name: 'SPF',
        status: 'fail',
        message: 'Invalid SPF record format',
        details: `Found: ${spfRecord}`,
      };
    }
    
    if (!hasAll) {
      return {
        name: 'SPF',
        status: 'warning',
        message: 'SPF record missing mechanism (~all or -all)',
        details: `Found: ${spfRecord}. Consider adding ~all or -all at the end.`,
      };
    }
    
    return {
      name: 'SPF',
      status: 'pass',
      message: 'SPF record found and valid',
      details: spfRecord,
    };
  } catch (error) {
    return {
      name: 'SPF',
      status: 'fail',
      message: 'Error checking SPF record',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check DMARC record
 */
async function checkDMARC(): Promise<CheckResult> {
  try {
    const records = await resolveTXT(`_dmarc.${DOMAIN}`);
    const dmarcRecord = records.find(record => record.startsWith('v=DMARC1'));
    
    if (!dmarcRecord) {
      return {
        name: 'DMARC',
        status: 'not-found',
        message: 'No DMARC record found',
        details: `Add a TXT record at _dmarc.${DOMAIN} with DMARC policy (e.g., v=DMARC1; p=none; rua=mailto:dmarc@${DOMAIN})`,
      };
    }
    
    // Basic DMARC validation
    const isValid = /^v=DMARC1/.test(dmarcRecord);
    const hasPolicy = /p=(none|quarantine|reject)/i.test(dmarcRecord);
    const hasRua = /rua=mailto:/i.test(dmarcRecord);
    
    if (!isValid) {
      return {
        name: 'DMARC',
        status: 'fail',
        message: 'Invalid DMARC record format',
        details: `Found: ${dmarcRecord}`,
      };
    }
    
    if (!hasPolicy) {
      return {
        name: 'DMARC',
        status: 'warning',
        message: 'DMARC record missing policy (p=)',
        details: `Found: ${dmarcRecord}. Add p=none, p=quarantine, or p=reject.`,
      };
    }
    
    const policyMatch = dmarcRecord.match(/p=(none|quarantine|reject)/i);
    const policy = policyMatch ? policyMatch[1].toLowerCase() : 'unknown';
    
    let status: 'pass' | 'warning' = 'pass';
    let message = 'DMARC record found and valid';
    
    if (policy === 'none') {
      status = 'warning';
      message = 'DMARC policy is set to "none" (monitoring only). Consider moving to "quarantine" or "reject" after testing.';
    }
    
    return {
      name: 'DMARC',
      status,
      message,
      details: `${dmarcRecord} (Policy: ${policy})`,
    };
  } catch (error) {
    return {
      name: 'DMARC',
      status: 'fail',
      message: 'Error checking DMARC record',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check DKIM records (common selectors)
 */
async function checkDKIM(): Promise<CheckResult> {
  const commonSelectors = [
    'default._domainkey',
    's1._domainkey',
    's2._domainkey',
    'selector1._domainkey',
    'selector2._domainkey',
    'key1._domainkey',
    'key2._domainkey',
  ];
  
  const foundRecords: string[] = [];
  
  for (const selector of commonSelectors) {
    try {
      const records = await resolveTXT(`${selector}.${DOMAIN}`);
      if (records.length > 0) {
        foundRecords.push(...records);
      }
    } catch (error) {
      // Continue checking other selectors
    }
  }
  
  if (foundRecords.length === 0) {
    return {
      name: 'DKIM',
      status: 'not-found',
      message: 'No DKIM records found for common selectors',
      details: 'DKIM records are provider-specific. Configure via your email provider (Resend/MailerLite/Google) and add the provided DNS records.',
    };
  }
  
  // Check if records look like DKIM records
  const dkimRecords = foundRecords.filter(record => 
    record.includes('v=DKIM1') || record.includes('k=rsa') || record.includes('p=')
  );
  
  if (dkimRecords.length === 0) {
    return {
      name: 'DKIM',
      status: 'warning',
      message: 'Found TXT records but may not be valid DKIM records',
      details: `Found records: ${foundRecords.join(', ')}`,
    };
  }
  
  return {
    name: 'DKIM',
    status: 'pass',
    message: `Found ${dkimRecords.length} DKIM record(s)`,
    details: `Records found for selectors: ${commonSelectors.filter((_, i) => foundRecords[i]).join(', ')}`,
  };
}

/**
 * Main check function
 */
async function checkEmailDeliverability() {
  console.log(`\n📧 Email Deliverability Check for ${DOMAIN}\n`);
  console.log('=' .repeat(60));
  
  const results: CheckResult[] = [];
  
  // Check SPF
  console.log('\n🔍 Checking SPF record...');
  const spfResult = await checkSPF();
  results.push(spfResult);
  printResult(spfResult);
  
  // Check DKIM
  console.log('\n🔍 Checking DKIM records...');
  const dkimResult = await checkDKIM();
  results.push(dkimResult);
  printResult(dkimResult);
  
  // Check DMARC
  console.log('\n🔍 Checking DMARC record...');
  const dmarcResult = await checkDMARC();
  results.push(dmarcResult);
  printResult(dmarcResult);
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary\n');
  
  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const notFoundCount = results.filter(r => r.status === 'not-found').length;
  
  console.log(`✅ Pass: ${passCount}`);
  console.log(`⚠️  Warning: ${warningCount}`);
  console.log(`❌ Fail: ${failCount}`);
  console.log(`🔍 Not Found: ${notFoundCount}`);
  
  if (passCount === 3) {
    console.log('\n🎉 All email deliverability checks passed!');
  } else {
    console.log('\n⚠️  Some checks need attention. See details above.');
    console.log('\n📖 For configuration instructions, see: web/DNS_EMAIL_CONFIG.md');
  }
  
  console.log('\n');
}

/**
 * Print a check result
 */
function printResult(result: CheckResult) {
  const icons = {
    pass: '✅',
    fail: '❌',
    warning: '⚠️',
    'not-found': '🔍',
  };
  
  const icon = icons[result.status];
  console.log(`${icon} ${result.name}: ${result.message}`);
  if (result.details) {
    console.log(`   ${result.details}`);
  }
}

// Run the check
checkEmailDeliverability().catch((error) => {
  console.error('Error running email deliverability check:', error);
  process.exit(1);
});

