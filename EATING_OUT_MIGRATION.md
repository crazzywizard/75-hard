# Eating Out Rule Enhancement Migration

This update enhances the eating out tracking from a simple boolean to a more sophisticated system that tracks actual calories when eating out.

## Rule Change

**Before:** Simple checkbox for "No Eating Out"
**After:** "No eating out OR if eating out, less than 500 calories"

## Behavior Change

**Important:** Entries with ≥500 calories when eating out are now **allowed** but will **break the streak**. This provides better user experience by letting users log what actually happened rather than preventing the entry entirely.

## Database Migration Required

Before using the updated application, you need to run the database migration to add the new fields.

### Step 1: Apply the Migration

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Add new columns for enhanced eating out tracking
ALTER TABLE entries 
ADD COLUMN ate_out BOOLEAN DEFAULT false,
ADD COLUMN eating_out_calories INTEGER DEFAULT 0;

-- Migrate existing data: if no_eating_out was true, set ate_out to false (they didn't eat out)
UPDATE entries 
SET ate_out = NOT no_eating_out,
    eating_out_calories = 0;

-- Add a check constraint to ensure eating_out_calories is reasonable (non-negative)
ALTER TABLE entries 
ADD CONSTRAINT check_eating_out_calories 
CHECK (eating_out_calories >= 0);
```

### Step 2: Verify Migration

After running the migration, you can verify it worked by checking:

```sql
-- Check that new columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'entries' 
AND column_name IN ('ate_out', 'eating_out_calories');

-- Check that data was migrated correctly
SELECT date, no_eating_out, ate_out, eating_out_calories 
FROM entries 
LIMIT 5;
```

## New Features

1. **Enhanced Form**: When adding daily entries, users can now:
   - Check "Ate Out Today" if they ate out
   - If they ate out, enter the calorie count
   - The form validates that calories are <500 if eating out

2. **Smart Validation**: 
   - The rule is satisfied if: `!ate_out OR (ate_out AND eating_out_calories < 500)`
   - Visual feedback shows green for satisfied rule, red for violations
   - Entries with ≥500 calories are allowed but will break the streak

3. **Enhanced Table Display**:
   - Shows "No" if didn't eat out
   - Shows "Yes (XXX cal)" with green color if ate out but <500 calories
   - Shows "Yes (XXX cal)" with red color if ate out and >=500 calories

4. **Backward Compatibility**: 
   - Keeps the old `no_eating_out` field for backward compatibility
   - Automatically sets it based on the new logic

## Streak Calculation

The streak calculation now uses the enhanced rule:
- Day counts toward streak if user didn't eat out OR ate out with <500 calories
- Combined with existing rules (no sugar, 350+ calories burned OR 8000+ steps)

## Testing

After migration, test the following:
1. Add a new entry without eating out (should maintain streak)
2. Add a new entry with eating out <500 calories (should maintain streak)
3. Add a new entry with eating out ≥500 calories (should show warning but allow entry, breaks streak)
4. Edit existing entries to change eating out status
5. Verify streak calculation correctly resets when rule is violated
6. Verify visual feedback shows red for ≥500 calories, green for <500 calories