# Streak Calculation Analysis

## Current Implementation

The current streak calculation in `src/app/page.tsx` (lines 217-235) already implements the exact logic you requested:

```typescript
const getCurrentStreak = (entries: DayEntry[]): number => {
  let streak = 0;
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const entry of sortedEntries) {
    // Check eating out rule: either didn't eat out OR ate out with <500 calories
    const eatingOutRuleSatisfied = !entry.ate_out || (entry.ate_out && entry.eating_out_calories < 500);
    
    if (
      entry.no_sugar &&
      eatingOutRuleSatisfied &&
      (entry.calories_burned >= 350 || entry.steps >= 8000)
    ) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};
```

## Rule Breakdown

### ✅ Rule 1: NO SUGAR
- **Implementation**: `entry.no_sugar`
- **Requirement**: Must be `true`

### ✅ Rule 2: NO EATING OUT OR IF EATING OUT < 500 CALORIES
- **Implementation**: `eatingOutRuleSatisfied = !entry.ate_out || (entry.ate_out && entry.eating_out_calories < 500)`
- **Requirement**: Either didn't eat out OR ate out with less than 500 calories

### ✅ Rule 3 OR Rule 4: MINIMUM 350 CALORIES BURNED OR 8000 STEPS DAILY
- **Implementation**: `(entry.calories_burned >= 350 || entry.steps >= 8000)`
- **Requirement**: At least one of these conditions must be met:
  - Calories burned ≥ 350, OR
  - Steps ≥ 8000

## Logic Verification

The current logic is: **Rule 1 AND Rule 2 AND (Rule 3 OR Rule 4)**

This matches your requirement perfectly:
- ✅ Rule 1 (no sugar) AND
- ✅ Rule 2 (no eating out or <500 calories) AND  
- ✅ (Rule 3 (≥350 calories) OR Rule 4 (≥8000 steps))

## How It Works

1. **Sorts entries**: Most recent first (descending order by date)
2. **Iterates through entries**: Starting from the most recent day
3. **Checks all conditions**: For each day, verifies all rules are satisfied
4. **Counts consecutive days**: Increments streak counter for each successful day
5. **Breaks on failure**: Stops counting when any rule is not satisfied

## Status: ✅ CORRECT

The current implementation already matches your requirements exactly. The streak calculation is working as intended according to your specification: "consecutive days where rule 1 and rule 2 and (rule 3 or rule 4) is achieved."