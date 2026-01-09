# ⚠️ RESTART DEV SERVER BẮT BUỘC

## Đã thay đổi API URL

API URL đã được đổi sang: **Railway**
```
https://manage-and-automate-aviation-academy-application-production.up.railway.app
```

## 🔴 BẮT BUỘC: Restart Dev Server

Để thay đổi có hiệu lực, bạn PHẢI restart dev server:

### Bước 1: Dừng server
Nhấn `Ctrl+C` trong terminal đang chạy dev server

### Bước 2: Chạy lại
```bash
npm run dev
```

## ✅ Files đã được cập nhật

Tất cả các file action đã được cập nhật để sử dụng biến môi trường:

- ✅ `lib/actions/auth.js`
- ✅ `lib/actions/document.js`
- ✅ `lib/actions/document-rule.js`
- ✅ `lib/actions/matrix.ts`
- ✅ `lib/actions/position.js`
- ✅ `lib/actions/rule.js`
- ✅ `lib/actions/trainee-submission.js`
- ✅ `lib/actions/trainee-submission-client.js`
- ✅ `lib/actions/upload.js`

## 🔍 Kiểm tra API URL đang dùng

Sau khi restart, mở browser console và chạy:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

Hoặc kiểm tra trong Network tab của DevTools để xem API requests đang gọi đến đâu.

## 📝 Lưu ý

- Biến môi trường chỉ được load khi server khởi động
- Thay đổi `.env` không tự động reload
- Phải restart server mỗi khi sửa `.env`
