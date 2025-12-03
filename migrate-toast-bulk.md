# Bulk Toast Migration Script

## Pattern cần thay thế:

### 1. Error toast (destructive variant):
```typescript
// OLD
toast({
  title: "Lỗi",
  description: "Message here",
  variant: "destructive",
});

// NEW
toast.error("Message here", {
  description: "Chi tiết",
  duration: 4000,
});
```

### 2. Success toast:
```typescript
// OLD
toast({
  title: "Thành công",
  description: "Message here",
});

// NEW
toast.success("Message here", {
  duration: 3000,
});
```

### 3. Info/Warning toast:
```typescript
// OLD
toast({
  title: "Thông báo",
  description: "Message here",
});

// NEW
toast.info("Message here", {
  duration: 3000,
});
```

## Files cần migrate:

1. ✅ `app/(head)/head/matrix/page.tsx` - Đang làm
2. `app/(training-director)/training-director/matrix/page.tsx`
3. `app/(admin)/admin/rules/page.tsx`
4. `app/(admin)/admin/positions/page.tsx`
5. `app/(admin)/admin/documents/page.tsx`
6. `app/(admin)/admin/document-rules/page.tsx`

## Quick Migration Steps:

1. Replace import:
```typescript
// OLD
import { useToast } from "@/hooks/use-toast";
const { toast } = useToast();

// NEW
import { toast } from "sonner";
```

2. Find & Replace patterns (use regex):
```regex
// Pattern 1: Error toast
toast\(\{\s*title:\s*"Lỗi",\s*description:\s*([^,]+),\s*variant:\s*"destructive",\s*\}\)
→ toast.error($1, { duration: 4000 })

// Pattern 2: Success toast
toast\(\{\s*title:\s*"Thành công",\s*description:\s*([^,]+),?\s*\}\)
→ toast.success($1, { duration: 3000 })

// Pattern 3: Info toast
toast\(\{\s*title:\s*"Thông báo",\s*description:\s*([^,]+),?\s*\}\)
→ toast.info($1, { duration: 3000 })
```

## Manual Migration (Recommended):

Vì mỗi toast có context khác nhau, nên migrate thủ công sẽ tốt hơn để:
- Giữ message có ý nghĩa
- Thêm description phù hợp
- Set duration hợp lý
