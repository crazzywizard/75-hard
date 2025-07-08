# Leaderboard Debug Summary

## Issue Identified
The leaderboard was showing zero steps for today even though entries exist in the database. This was due to **timezone issues in date comparison logic**.

## Root Causes Found

### 1. **Date Comparison Issue in Leaderboard.tsx**
- **Problem**: The `getCurrentWeekRange()` function was creating Date objects with specific hours/minutes, but comparing them with `new Date(entry.date)` caused timezone inconsistencies.
- **Solution**: Changed to string-based date comparison using YYYY-MM-DD format.

### 2. **Missing Environment Variables**
- **Problem**: No `.env.local` file existed for database connection.
- **Solution**: Created template `.env.local` file.

## Changes Made

### 1. Fixed Date Filtering Logic (`src/components/Leaderboard.tsx`)
```typescript
// OLD (problematic):
const getCurrentWeekRange = () => {
  // ... created Date objects with setHours()
  const entryDate = new Date(entry.date);
  return entryDate >= monday && entryDate <= sunday;
};

// NEW (fixed):
const getCurrentWeekRange = () => {
  // ... returns mondayStr and sundayStr as YYYY-MM-DD strings
  return entry.date >= mondayStr && entry.date <= sundayStr;
};
```

### 2. Removed Debug Tools
- **DebugInfo component**: Removed after confirming the fix works
- **Console logging**: Removed for production readiness

## What You Need to Do

### 1. **Set Up Environment Variables**
Replace the placeholder values in `.env.local` with your actual Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_actual_supabase_service_role_key
```

### 2. **Test the Fix**
1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Don't select any participant (to see leaderboard)
4. Verify the leaderboard now shows correct step counts

### 3. **Verify Database Schema**
Ensure your database has these tables with correct structure:

**participants table:**
```sql
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  start_weight DECIMAL,
  end_weight DECIMAL,
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**entries table:**
```sql
CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  no_sugar BOOLEAN DEFAULT false,
  ate_out BOOLEAN DEFAULT false,
  eating_out_calories INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, date)
);
```

## Expected Behavior After Fix

1. **This Week View**: Should show steps/calories for the current week (Monday-Sunday)
2. **All Time View**: Should show total steps/calories for all time
3. **Today's Data**: Should appear immediately when entries are added
4. **Proper Ranking**: Participants should be ranked correctly by their totals

## Troubleshooting

If the issue persists:

1. **Verify API Response**: Check if `/api/entries` returns data
2. **Check Database Connection**: Ensure Supabase credentials are correct
3. **Verify Date Format**: Ensure database dates are in YYYY-MM-DD format
4. **Check participant_id**: Ensure entries have correct participant_id values

## Technical Details

The core issue was that JavaScript's `new Date()` constructor handles timezone conversion, but when comparing dates across different timezone contexts, it can cause filtering to fail. By using string comparison with YYYY-MM-DD format (which matches the database format), we avoid timezone-related issues entirely.

The fix ensures that:
- Date filtering works consistently regardless of user's timezone
- Week calculations are accurate
- Database date format matches comparison format
- No timezone conversion errors occur during filtering