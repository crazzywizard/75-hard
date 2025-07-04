# Fix for "Update and Save Not Working" Issue

## Problem
The "update and save is going back to original" issue was caused by a **race condition** in the save functionality.

### Root Cause
In `EntriesTable.tsx`, the `saveEdit` function was making **multiple separate API calls** in rapid succession:

```typescript
// OLD (PROBLEMATIC) CODE:
const saveEdit = (date: string) => {
  Object.entries(editValues).forEach(([field, value]) => {
    if (value !== undefined) {
      // This makes SEPARATE API calls for each field!
      updateEntry(date, field as keyof Omit<DayEntry, 'id' | 'date'>, value);
    }
  });
  setEditingDate(null);
  setEditValues({});
};
```

**What was happening:**
1. User edits multiple fields (e.g., calories_burned: 400, steps: 10000, notes: "good day")
2. `saveEdit` calls `updateEntry` 3 times rapidly
3. Each call makes a separate PUT request to `/api/entries`
4. Due to network timing, API calls can complete in any order
5. The last call to complete overwrites all previous updates, causing values to "go back to original"

## Solution
**Modified the update logic to make a single API call with all changes:**

### 1. Updated `updateEntry` function in `src/app/page.tsx`
```typescript
// NEW: Accept multiple fields at once
const updateEntry = async (
  date: string,
  updates: Partial<Omit<DayEntry, 'id' | 'date'>>
) => {
  // ... optimistic update with all fields
  setEntries(entries.map(entry => 
    entry.date === date ? { ...entry, ...updates } : entry
  ));
  
  // Single API call with all updates
  const response = await fetch(`/api/entries?date=${date}&participant_id=${currentParticipant.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates) // All fields at once
  });
}
```

### 2. Updated `saveEdit` function in `src/components/EntriesTable.tsx`
```typescript
// NEW: Collect all changes and make single API call
const saveEdit = (date: string) => {
  const updates: Record<string, string | number | boolean> = {};
  
  Object.entries(editValues).forEach(([field, value]) => {
    if (value !== undefined && value !== null) {
      updates[field] = value as string | number | boolean;
    }
  });
  
  // Single API call with all updates
  if (Object.keys(updates).length > 0) {
    updateEntry(date, updates);
  }
  
  setEditingDate(null);
  setEditValues({});
};
```

## Benefits
1. **Eliminates race conditions** - Only one API call per save operation
2. **Atomic updates** - All fields are updated together or none at all
3. **Better performance** - Fewer network requests
4. **More reliable** - Consistent data state

## Testing
The fix has been implemented and the development server should now work correctly. Users can now:
1. Click "Update" on any today's entry
2. Modify multiple fields
3. Click "Save" 
4. All changes will persist correctly without reverting to original values

The update and save functionality should now work reliably without the "going back to original" issue.