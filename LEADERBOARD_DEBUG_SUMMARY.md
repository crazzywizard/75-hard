# Leaderboard Debug Summary

## Issue Identified
The leaderboard was showing zero steps for today even though entries exist in the database. This was due to **timezone issues in date comparison logic**.

## Root Causes Found

### 1. **Date Comparison Issue in Leaderboard.tsx**
- **Problem**: The `getCurrentWeekRange()` function was creating Date objects with specific hours/minutes, but comparing them with `new Date(entry.date)` caused timezone inconsistencies.
- **Solution**: Changed to string-based date comparison using YYYY-MM-DD format.

### 2. **Incorrect Supabase Configuration**
- **Problem**: `src/lib/supabase.ts` was using `SUPABASE_SERVICE_ROLE_KEY` instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Solution**: Fixed the environment variable name.

### 3. **Missing Environment Variables**
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

### 2. Fixed Supabase Configuration (`src/lib/supabase.ts`)
```typescript
// OLD:
process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// NEW:
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
```

### 3. Added Debug Tools
- **DebugInfo component**: Shows raw data from database to help diagnose issues
- **Console logging**: Added to leaderboard calculation and data fetching
- **Visual debug panel**: Shows today's entries, this week's entries, and participant data

## What You Need to Do

### 1. **Set Up Environment Variables**
Replace the placeholder values in `.env.local` with your actual Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

### 2. **Test the Fix**
1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Don't select any participant (to see leaderboard)
4. Click "Show Debug Info" to see raw data
5. Check browser console for detailed logs

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

### 4. **Remove Debug Tools (Later)**
After confirming the fix works, remove the debug tools:
- Remove `<DebugInfo />` from `src/app/page.tsx`
- Remove console.log statements from `src/components/Leaderboard.tsx`
- Delete `src/components/DebugInfo.tsx`

## Expected Behavior After Fix

1. **This Week View**: Should show steps/calories for the current week (Monday-Sunday)
2. **All Time View**: Should show total steps/calories for all time
3. **Today's Data**: Should appear immediately when entries are added
4. **Proper Ranking**: Participants should be ranked correctly by their totals

## Troubleshooting

If the issue persists:

1. **Check Console Logs**: Look for errors in browser console
2. **Verify API Response**: Check if `/api/entries` returns data
3. **Check Database Connection**: Ensure Supabase credentials are correct
4. **Verify Date Format**: Ensure database dates are in YYYY-MM-DD format
5. **Check participant_id**: Ensure entries have correct participant_id values

## Technical Details

The core issue was that JavaScript's `new Date()` constructor handles timezone conversion, but when comparing dates across different timezone contexts, it can cause filtering to fail. By using string comparison with YYYY-MM-DD format (which matches the database format), we avoid timezone-related issues entirely.

The fix ensures that:
- Date filtering works consistently regardless of user's timezone
- Week calculations are accurate
- Database date format matches comparison format
- No timezone conversion errors occur during filtering