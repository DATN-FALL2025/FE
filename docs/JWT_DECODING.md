# 🔓 JWT Token Decoding - Implementation Summary

## 📋 Overview

JWT token được backend trả về đã chứa đầy đủ thông tin user (role, username). Chúng ta decode token để extract thông tin này thay vì lưu raw token.

---

## 🎯 JWT Token Structure

### Response từ API

```json
{
  "status": "200 OK",
  "message": "Login successfully",
  "data": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJ0aGFuaHZpbmhjbzEyMzQiLCJpYXQiOjE3NjMxMDUxMzAsImV4cCI6MTc2MzEyMzEzMH0.3iHXiEoJNT1qP5LL1VLGEZu1Den9SGBxHtfUBKm0fZQ"
}
```

### JWT Format

```
eyJhbGciOiJIUzI1NiJ9                    ← Header
.
eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJ0aGFu...  ← Payload (important!)
.
3iHXiEoJNT1qP5LL1VLGEZu1Den9SGBxHtfU...  ← Signature
```

### Decoded Payload

```json
{
  "role": "ADMIN",
  "sub": "thanhvinhco1234",
  "iat": 1763105130,
  "exp": 1763123130
}
```

**Fields:**
- `role`: User's role (ADMIN, TRAINEE, etc.)
- `sub`: Username (subject của token)
- `iat`: Issued At Time (Unix timestamp)
- `exp`: Expiration Time (Unix timestamp)

---

## 🛠️ Implementation

### 1. Decode Function

**File:** `lib/actions/auth.js`

```javascript
function decodeJWT(token) {
  try {
    // JWT có format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format');
      return null;
    }

    // Decode base64 payload (part[1])
    const payload = parts[1];
    
    // Replace URL-safe characters và pad nếu cần
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    
    const decoded = JSON.parse(jsonPayload);
    console.log('🔓 Decoded JWT:', decoded);
    
    return decoded;
  } catch (error) {
    console.error('❌ Error decoding JWT:', error);
    return null;
  }
}
```

### 2. Updated Login Flow

```javascript
export async function authenticateAccount(loginData) {
  // ... fetch API ...
  
  const data = await response.json();
  
  // Decode JWT token để lấy thông tin user
  const token = data.data; // JWT string
  const decodedPayload = decodeJWT(token);
  
  // Tạo object user data từ decoded JWT
  const userData = {
    token: token,                              // Store original token
    userName: decodedPayload.sub || userName,  // Extract from 'sub'
    role: decodedPayload.role,                 // Extract role
    iat: decodedPayload.iat,                   // Issued at
    exp: decodedPayload.exp,                   // Expiration
  };

  return {
    status: 'success',
    message: data.message,
    data: userData  // Return decoded user data
  };
}
```

---

## 📊 Data Flow

```
1. User Login
   ↓
2. API Returns JWT Token
   "eyJhbGciOiJIUzI1NiJ9..."
   ↓
3. Decode JWT
   { role: "ADMIN", sub: "thanhvinhco1234", ... }
   ↓
4. Store in localStorage
   {
     token: "eyJ...",
     userName: "thanhvinhco1234",
     role: "ADMIN",
     iat: 1763105130,
     exp: 1763123130
   }
   ↓
5. Use in Application
   - Display user name in navbar/sidebar
   - Check role for authorization
   - Validate token expiration
```

---

## 🎯 Benefits

### ✅ Before (Without Decoding)
```javascript
// Chỉ có raw token, không có user info
{
  token: "eyJhbGciOiJIUzI1NiJ9..."
}
// ❌ Không biết username, role
// ❌ Không thể display user info
// ❌ Không thể check authorization
```

### ✅ After (With Decoding)
```javascript
// Có đầy đủ thông tin user
{
  token: "eyJhbGciOiJIUzI1NiJ9...",
  userName: "thanhvinhco1234",
  role: "ADMIN",
  iat: 1763105130,
  exp: 1763123130
}
// ✅ Có username để display
// ✅ Có role để authorization
// ✅ Có expiration để validate
```

---

## 🔒 Security Notes

### ✅ Safe
- Decoding JWT on server-side (in server actions)
- No secret key needed for decoding (only for verification)
- JWT payload is already public data (anyone can decode)

### ⚠️ Important
- **DO NOT** store sensitive data in JWT payload
- JWT is **NOT encrypted**, only **signed**
- Anyone can decode JWT and see the payload
- The signature ensures the token hasn't been modified

---

## 🧪 Testing

### Test JWT Decoder Online
Visit: https://jwt.io/

Paste your JWT token to see the decoded payload.

### Example Token
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJ0aGFuaHZpbmhjbzEyMzQiLCJpYXQiOjE3NjMxMDUxMzAsImV4cCI6MTc2MzEyMzEzMH0.3iHXiEoJNT1qP5LL1VLGEZu1Den9SGBxHtfUBKm0fZQ
```

**Decoded Header:**
```json
{
  "alg": "HS256"
}
```

**Decoded Payload:**
```json
{
  "role": "ADMIN",
  "sub": "thanhvinhco1234",
  "iat": 1763105130,
  "exp": 1763123130
}
```

---

## 📝 Usage in Application

### Get User Info from Decoded Token

```typescript
import { getUser, getUserRole } from '@/lib/auth-utils';

// Get full user data (includes decoded JWT info)
const user = getUser();
console.log(user?.userName);  // "thanhvinhco1234"
console.log(user?.role);      // "ADMIN"

// Get role directly
const role = getUserRole();
console.log(role);  // "ADMIN"
```

### Display in UI

```tsx
import { useAuthInfo } from '@/hooks/use-auth-info';

function UserProfile() {
  const { user, displayName, role } = useAuthInfo();
  
  return (
    <div>
      <h2>Welcome, {displayName}!</h2>
      <p>Role: {role}</p>
      <p>Username: {user?.userName}</p>
    </div>
  );
}
```

### Check Authorization

```typescript
import { hasRole } from '@/lib/auth-utils';

// Check if user is admin
if (hasRole('ADMIN')) {
  // Show admin features
}
```

---

## 🎓 Learn More

- **JWT Official:** https://jwt.io/
- **RFC 7519:** https://tools.ietf.org/html/rfc7519
- **Base64 Encoding:** Understanding how JWT payload is encoded

---

## ✅ Summary

| Aspect | Description |
|--------|-------------|
| **What** | Decode JWT token to extract user info (role, username) |
| **Why** | Get user info without additional API calls |
| **Where** | `lib/actions/auth.js` - `decodeJWT()` function |
| **When** | Automatically on login success |
| **How** | Split token → Decode base64 payload → Parse JSON |
| **Result** | Full user object with username, role, expiration |

**Next Steps:**
- ✅ JWT decoding implemented
- ✅ User info extracted and stored
- ✅ Display user info in navbar/sidebar
- ✅ Role-based authorization ready
- 🔄 Add token expiration check (optional enhancement)

