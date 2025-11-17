# DNS Email Configuration Guide

This document outlines the DNS records required for email deliverability for `solutionsimpactweb.com` domain.

## Overview

To ensure proper email deliverability and prevent spam filtering, the following DNS records must be configured for `solutionsimpactweb.com`:

1. **SPF (Sender Policy Framework)** - Authorizes which servers can send email on behalf of the domain
2. **DKIM (DomainKeys Identified Mail)** - Provides cryptographic authentication of email messages
3. **DMARC (Domain-based Message Authentication, Reporting & Conformance)** - Policy framework that uses SPF and DKIM to prevent email spoofing

## Email Provider Configuration

The configuration depends on which email provider is used. Configure DNS records according to your provider:

### Option 1: Resend

**SPF Record:**
- **Type:** TXT
- **Name:** `@` (root domain) or `solutionsimpactweb.com`
- **Value:** `v=spf1 include:_spf.resend.com ~all`
- **TTL:** 3600 (or default)

**DKIM:**
1. Log into Resend dashboard
2. Navigate to Domains → Add Domain → `solutionsimpactweb.com`
3. Resend will provide DKIM DNS records (typically 3 CNAME records)
4. Add these records to your DNS provider

**DMARC Record:**
- **Type:** TXT
- **Name:** `_dmarc`
- **Value (Initial):** `v=DMARC1; p=none; rua=mailto:dmarc@solutionsimpactweb.com`
- **Value (After Testing):** `v=DMARC1; p=quarantine; rua=mailto:dmarc@solutionsimpactweb.com`
- **Value (Target):** `v=DMARC1; p=reject; rua=mailto:dmarc@solutionsimpactweb.com`
- **TTL:** 3600 (or default)

### Option 2: MailerLite

**SPF Record:**
- **Type:** TXT
- **Name:** `@` (root domain) or `solutionsimpactweb.com`
- **Value:** `v=spf1 include:servers.mcsv.net ~all`
- **TTL:** 3600 (or default)

**DKIM:**
1. Log into MailerLite dashboard
2. Navigate to Settings → Sending domains → Add domain
3. MailerLite will provide DKIM DNS records
4. Add these records to your DNS provider

**DMARC Record:**
- **Type:** TXT
- **Name:** `_dmarc`
- **Value (Initial):** `v=DMARC1; p=none; rua=mailto:dmarc@solutionsimpactweb.com`
- **Value (After Testing):** `v=DMARC1; p=quarantine; rua=mailto:dmarc@solutionsimpactweb.com`
- **Value (Target):** `v=DMARC1; p=reject; rua=mailto:dmarc@solutionsimpactweb.com`
- **TTL:** 3600 (or default)

### Option 3: Google Workspace / Gmail

**SPF Record:**
- **Type:** TXT
- **Name:** `@` (root domain) or `solutionsimpactweb.com`
- **Value:** `v=spf1 include:_spf.google.com ~all`
- **TTL:** 3600 (or default)

**DKIM:**
1. Log into Google Admin Console
2. Navigate to Apps → Google Workspace → Gmail → Authenticate email
3. Select domain `solutionsimpactweb.com`
4. Google will provide a DKIM TXT record (typically under `default._domainkey`)
5. Add this record to your DNS provider

**DMARC Record:**
- **Type:** TXT
- **Name:** `_dmarc`
- **Value (Initial):** `v=DMARC1; p=none; rua=mailto:dmarc@solutionsimpactweb.com`
- **Value (After Testing):** `v=DMARC1; p=quarantine; rua=mailto:dmarc@solutionsimpactweb.com`
- **Value (Target):** `v=DMARC1; p=reject; rua=mailto:dmarc@solutionsimpactweb.com`
- **TTL:** 3600 (or default)

## Implementation Steps

1. **Choose your email provider** (Resend, MailerLite, Google Workspace, or other)
2. **Add SPF record** to your DNS provider
3. **Configure DKIM** via your email provider's dashboard and add DNS records
4. **Add DMARC record** (start with `p=none` for monitoring)
5. **Wait for DNS propagation** (typically 15 minutes to 48 hours)
6. **Verify records** using tools like:
   - [MXToolbox SPF Checker](https://mxtoolbox.com/spf.aspx)
   - [MXToolbox DKIM Checker](https://mxtoolbox.com/dkim.aspx)
   - [MXToolbox DMARC Checker](https://mxtoolbox.com/dmarc.aspx)
7. **Test email sending** from production environment
8. **Monitor DMARC reports** (sent to `dmarc@solutionsimpactweb.com`)
9. **Gradually tighten DMARC policy** (`none` → `quarantine` → `reject`)

## Target Configuration

Once all records are verified and email is sending successfully, target configuration should be:

- **SPF:** `PASS` ✅
- **DKIM:** `PASS` ✅
- **DMARC:** `PASS` with `p=reject` ✅

## Email Addresses Used

The following email addresses are configured in the application:

- `info@solutionsimpactweb.com` - Contact form submissions
- `privacy@solutionsimpactweb.com` - Data requests (Law 25)
- `support@solutionsimpactweb.com` - Waitlist confirmations
- `dmarc@solutionsimpactweb.com` - DMARC aggregate reports

## Verification Checklist

- [ ] SPF record added and verified
- [ ] DKIM records added and verified
- [ ] DMARC record added and verified
- [ ] Test email sent from production
- [ ] SPF check: PASS
- [ ] DKIM check: PASS
- [ ] DMARC check: PASS
- [ ] DMARC reports being received
- [ ] All email addresses configured correctly

## Troubleshooting

### SPF Failures
- Verify SPF record syntax (no extra spaces, correct format)
- Check for multiple SPF records (only one allowed)
- Ensure include statements match your email provider

### DKIM Failures
- Verify all DKIM records are added correctly
- Check record TTL and wait for propagation
- Ensure selector matches email provider configuration

### DMARC Failures
- Verify DMARC record syntax
- Check that SPF and DKIM are passing first
- Review DMARC reports for specific issues

## Additional Resources

- [SPF Record Syntax](https://www.ietf.org/rfc/rfc7208.txt)
- [DKIM Specification](https://www.ietf.org/rfc/rfc6376.txt)
- [DMARC Specification](https://www.ietf.org/rfc/rfc7489.txt)
- [Google Postmaster Tools](https://postmaster.google.com/) - For Gmail deliverability insights

