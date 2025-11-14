'use server';

const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';

/**
 * Upload file lên Cloudinary
 * @param {FormData} formData - Form data chứa file cần upload
 * @param {File} formData.file - File cần upload
 * @returns {Promise<Object>} Response từ API chứa URL của file đã upload
 */
export async function uploadFile(formData) {
  try {
    const file = formData.get('file');
    
    if (!file) {
      return {
        status: 'error',
        message: 'Thiếu file để upload',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/uploads/file`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Upload file thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Cập nhật file trên Cloudinary (thay thế file cũ)
 * @param {string} oldPublicId - Public ID của file cũ trên Cloudinary
 * @param {FormData} formData - Form data chứa file mới
 * @param {File} formData.file - File mới
 * @returns {Promise<Object>} Response từ API chứa URL của file mới
 */
export async function updateFile(oldPublicId, formData) {
  try {
    if (!oldPublicId) {
      return {
        status: 'error',
        message: 'Thiếu oldPublicId',
        data: null
      };
    }

    const file = formData.get('file');
    if (!file) {
      return {
        status: 'error',
        message: 'Thiếu file để upload',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/uploads/file?oldPublicId=${encodeURIComponent(oldPublicId)}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật file thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error updating file:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

