# News Data Cache

This directory contains cached news data for the application.

## Files

- `news-cache.json` - Main news data cache file

## Structure

```json
{
  "lastUpdated": "ISO 8601 timestamp",
  "news": [
    {
      "id": "unique-id",
      "title": "Event Title",
      "impact": "high" | "medium",
      "eventTimeUTC": "ISO 8601 timestamp",
      "forecast": "Expected value",
      "previous": "Previous value"
    }
  ]
}
```

## Updating News Data

To update the news data:

1. Edit `news-cache.json`
2. Update the `lastUpdated` timestamp
3. Add/modify news items in the `news` array
4. Restart the development server

## Event Time Format

All times should be in UTC format (ISO 8601). The application will convert them to NY time for display.

Example: `"2026-02-09T13:30:00.000Z"` = 8:30 AM NY time (UTC-5)

## Impact Levels

- `high` - Red badge, high volatility expected
- `medium` - Yellow badge, moderate volatility expected
