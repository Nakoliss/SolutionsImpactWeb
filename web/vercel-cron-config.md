# Vercel Cron Configuration

This document describes how to configure Vercel Cron to automatically create monthly report tasks.

## Setup

1. Add the following to your `vercel.json` file in the project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/monthly",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

The schedule `"0 0 1 * *"` runs at midnight UTC on the 1st of every month.

## Environment Variables

Make sure to set the following environment variable in Vercel:

- `CRON_SECRET`: A secret string used to protect the cron endpoint

## Authorization

The cron endpoint expects an `Authorization` header with the value `Bearer <CRON_SECRET>`.

To test manually, you can call:

```bash
curl -X POST https://your-domain.com/api/cron/monthly \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## What It Does

When triggered, the cron endpoint:
1. Creates a "Rapport maintenance {mois}" task with category `maintenance`
2. Creates a "Rapport SEO/AEO {mois}" task with category `seo`
3. Sets both tasks to `todo` status with due date at end of current month

These tasks will appear in the `/admin` dashboard for manual completion.

