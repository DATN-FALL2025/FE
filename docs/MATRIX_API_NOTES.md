# Matrix API Implementation Notes

## ✅ APIs Đã Implement (trong lib/actions/matrix.ts)

1. ✅ `GET /api/matrix/getAllMatrix` - Lấy toàn bộ matrix
2. ✅ `GET /api/matrix/department/{departmentID}` - Lấy matrix theo department
3. ✅ `POST /api/matrix/addRow` - Thêm 1 position (hàng)
4. ✅ `POST /api/matrix/addMultipleRow` - Thêm nhiều positions
5. ✅ `POST /api/matrix/addColum` - Thêm 1 document (cột)
6. ✅ `POST /api/matrix/addMultipleColum` - Thêm nhiều documents
7. ✅ `DELETE /api/matrix/deleteRow/{positionId}` - Xóa hàng
8. ✅ `DELETE /api/matrix/deleteColumn/{documentId}` - Xóa cột
9. ✅ `DELETE /api/matrix/deleteAllColumns` - Xóa tất cả cột
10. ✅ `DELETE /api/matrix/clearMatrix` - Xóa toàn bộ matrix

## ⚠️ APIs Từ Swagger Cần Kiểm Tra

Theo hình ảnh swagger bạn gửi, các API sau cần được xác nhận:

### 1. `POST /api/matrix/setPendintStatusMatrix`
- **Mục đích**: Không rõ (cần confirm)
- **Payload**: Chưa biết
- **TODO**: Hỏi backend về chức năng này

### 2. `POST /api/matrix/clickToSell`
- **Mục đích**: Toggle checkbox trong cell? (cần confirm)
- **Payload**: Có thể là `{positionId, documentId, required: boolean}`
- **TODO**: Cần biết exact payload để implement

### 3. `DELETE /api/matrix/deleteAllRow`
- **Mục đích**: Xóa tất cả hàng
- **Status**: Chưa implement
- **TODO**: Thêm function vào matrix.ts

## 📝 API Cần Implement Ngay

### Checkbox Toggle (clickToSell?)
```typescript
export async function toggleMatrixCell(positionId: number, documentId: number, required: boolean) {
  // TODO: Cần biết exact endpoint và payload format
  // Có thể là POST /api/matrix/clickToSell
}
```

### Set Pending Status
```typescript
export async function setPendingStatusMatrix(data: unknown) {
  // TODO: Cần biết payload structure
  // POST /api/matrix/setPendintStatusMatrix
}
```

### Delete All Rows
```typescript
export async function deleteAllMatrixRows() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matrix/deleteAllRow`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to delete all rows',
        data: null,
      };
    }
    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}
```

## 🎯 Action Items

1. ⏳ **Cần làm rõ từ backend**:
   - `POST /api/matrix/setPendintStatusMatrix` - Chức năng gì?
   - `POST /api/matrix/clickToSell` - Payload format? Có phải toggle checkbox?

2. ✅ **Có thể implement ngay**:
   - `DELETE /api/matrix/deleteAllRow` - Tương tự deleteAllColumns

3. 🔄 **Đang sử dụng**:
   - Tất cả các API get, add, delete đã hoạt động tốt
   - Cần thêm API để toggle checkbox trong cell

## 💡 Gợi Ý Implementation

### Cho trang Matrix hiện tại:

1. **Thêm hàng** → `addMatrixRow(positionId)` ✅
2. **Thêm cột** → `addMatrixColumn(documentId)` ✅
3. **Xóa hàng** → `deleteMatrixRow(positionId)` ✅
4. **Xóa cột** → `deleteMatrixColumn(documentId)` ✅
5. **Toggle checkbox** → Cần API `clickToSell` hoặc tương tự ⏳

## 📌 Notes

- Base URL: `https://manage-and-automate-aviation-academy.onrender.com/api`
- Tất cả responses có format: `{status, message, data}`
- Đã test thành công: getAllMatrix, getMatrixByDepartment
- Đang pending: Toggle cell checkbox functionality
