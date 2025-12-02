# Configuration Files

Centralized configuration for API endpoints and application routes.

## Files

### 1. `api-paths.ts` - API Endpoint Configuration

Manages all backend API endpoints in one place.

#### Usage:

```typescript
import { API_PATHS, MATRIX_PATHS, buildApiUrl } from '@/lib/config/api-paths';

// Using full path
const url = buildApiUrl(API_PATHS.MATRIX.GET_ALL);
// Result: "https://...onrender.com/api/matrix/getAllMatrix"

// Using individual path constants
const matrixUrl = buildApiUrl(MATRIX_PATHS.GET_ALL);

// Dynamic paths with parameters
const deptMatrixUrl = buildApiUrl(MATRIX_PATHS.GET_BY_DEPARTMENT(5));
// Result: "https://...onrender.com/api/matrix/department/5"

// Build URL with query parameters
const url = buildApiUrlWithQuery('/api/documents/create', {
  name: 'My Document',
  description: 'Test'
});
// Result: "https://...onrender.com/api/documents/create?name=My%20Document&description=Test"
```

#### Available Path Groups:

- `AUTH_PATHS` - Authentication & Account APIs
- `POSITION_PATHS` - Position Management APIs
- `DOCUMENT_PATHS` - Document Management APIs
- `DOCUMENT_RULE_PATHS` - Document Rule APIs
- `DEPARTMENT_PATHS` - Department Management APIs
- `MATRIX_PATHS` - Matrix Management APIs
- `UPLOAD_PATHS` - File Upload APIs

### 2. `route-paths.ts` - Application Route Configuration

Manages all frontend navigation routes.

#### Usage:

```typescript
import { ROUTES, TRAINING_DIRECTOR_ROUTES, isActiveRoute } from '@/lib/config/route-paths';

// Using in navigation
<Link href={ROUTES.TRAINING_DIRECTOR.DASHBOARD}>
  Dashboard
</Link>

// Or directly
<Link href={TRAINING_DIRECTOR_ROUTES.DASHBOARD}>
  Dashboard
</Link>

// Check if route is active
const active = isActiveRoute(pathname, TRAINING_DIRECTOR_ROUTES.MATRIX);

// Get route metadata
const metadata = getRouteMetadata(TRAINING_DIRECTOR_ROUTES.MATRIX);
console.log(metadata.title); // "Document Matrix"
console.log(metadata.description); // "Manage position-document matrix"

// Check user access
const hasAccess = hasRouteAccess('/training-director/matrix', 'TRAINING_DIRECTOR');

// Get all routes for a role
const routes = getRoutesByRole('TRAINING_DIRECTOR');
```

#### Available Route Groups:

- `ADMIN_ROUTES` - Admin panel routes
- `TRAINING_DIRECTOR_ROUTES` - Training Director routes
- `HEAD_OF_DEPARTMENT_ROUTES` - Head of Department routes
- `ACADEMIC_STAFF_AFFAIR_ROUTES` - Academic Staff Affair routes
- `TRAINEE_ROUTES` - Trainee routes
- `AUTH_ROUTES` - Authentication routes
- `PUBLIC_ROUTES` - Public routes

## Benefits

### ✅ Type Safety
- Full TypeScript autocomplete
- Compile-time error checking
- Prevents typos in URLs

### ✅ Centralized Management
- Change URLs in one place
- Easy to maintain and refactor
- Single source of truth

### ✅ Better Developer Experience
```typescript
// ❌ Before (error-prone)
href="/training-director/dashboard"
fetch('https://api.com/api/matrix/department/' + id)

// ✅ After (type-safe)
href={TRAINING_DIRECTOR_ROUTES.DASHBOARD}
fetch(buildApiUrl(MATRIX_PATHS.GET_BY_DEPARTMENT(id)))
```

### ✅ Easy Refactoring
```typescript
// Need to change route? Just update in one place!
export const TRAINING_DIRECTOR_ROUTES = {
  DASHBOARD: '/training-director/dashboard', // Change here
  MATRIX: '/training-director/matrix',
} as const;

// All usages automatically updated!
```

## Examples

### Example 1: Using API Paths in Actions

```typescript
// lib/actions/matrix.ts
import { API_BASE_URL, MATRIX_PATHS } from '@/lib/config/api-paths';

export async function getMatrixByDepartment(departmentId: number) {
  const url = `${API_BASE_URL}${MATRIX_PATHS.GET_BY_DEPARTMENT(departmentId)}`;
  const response = await fetch(url);
  return response.json();
}
```

### Example 2: Using Route Paths in Sidebar

```typescript
// components/sidebar.tsx
import { TRAINING_DIRECTOR_ROUTES } from '@/lib/config/route-paths';

const navigation = [
  { name: "Dashboard", href: TRAINING_DIRECTOR_ROUTES.DASHBOARD },
  { name: "Matrix", href: TRAINING_DIRECTOR_ROUTES.MATRIX },
];
```

### Example 3: Dynamic Route Building

```typescript
import { buildRoute } from '@/lib/config/route-paths';

// If you have dynamic routes like: /users/:id/profile
const userProfileRoute = buildRoute('/users/:id/profile', { id: 123 });
// Result: '/users/123/profile'
```

## Migration Guide

### Migrating Existing Code

```typescript
// ❌ Old way
const url = 'https://manage-and-automate-aviation-academy.onrender.com/api/matrix/getAllMatrix';

// ✅ New way
import { buildApiUrl, MATRIX_PATHS } from '@/lib/config/api-paths';
const url = buildApiUrl(MATRIX_PATHS.GET_ALL);
```

```typescript
// ❌ Old way
<Link href="/training-director/dashboard">Dashboard</Link>

// ✅ New way
import { TRAINING_DIRECTOR_ROUTES } from '@/lib/config/route-paths';
<Link href={TRAINING_DIRECTOR_ROUTES.DASHBOARD}>Dashboard</Link>
```

## Notes

- All paths are defined with `as const` for maximum type safety
- API_BASE_URL can be overridden via environment variable: `NEXT_PUBLIC_API_URL`
- Route metadata includes: title, description, requiresAuth, allowedRoles
- Helper functions available for common operations (buildApiUrl, isActiveRoute, etc.)
