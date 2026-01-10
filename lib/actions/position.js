'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy-application-production.up.railway.app';

// Timeout configuration (30 seconds)
const FETCH_TIMEOUT = 30000;

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Server không phản hồi sau 30 giây');
    }
    throw error;
  }
}

/**
 * Lấy danh sách tất cả vị trí
 * @param {string} [token] - JWT Bearer token (optional)
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllPositions(token) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Bearer token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/position/getAllPossition`,
      {
        method: 'GET',
        headers,
        cache: 'no-store', // Next.js will handle caching
        next: { revalidate: 60 } // Revalidate every 60 seconds
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy danh sách vị trí thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy thông tin vị trí theo ID
 * @param {number} id - ID của vị trí
 * @param {string} [token] - JWT Bearer token (optional)
 * @returns {Promise<Object>} Response từ API
 */
export async function getPositionById(id, token) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Bearer token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/position/getPositionById/${id}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
        next: { revalidate: 60 }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy thông tin vị trí thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting position by id:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Tạo vị trí mới
 * @param {FormData} formData - Form data chứa thông tin vị trí
 * @param {string} formData.positionName - Tên vị trí
 * @param {string} formData.positionDescription - Mô tả vị trí
 * @param {string} formData.departmentID - ID của phòng ban
 * @param {File} [formData.positionImage] - File ảnh vị trí
 * @param {string} [token] - JWT Bearer token (optional)
 * @returns {Promise<Object>} Response từ API
 */
export async function createPosition(formData, token) {
  try {
    console.log('🆕 CREATE POSITION - Starting...');
    console.log('🆕 Token provided:', token ? 'Yes' : 'No');
    console.log('🆕 FormData - positionName:', formData.get('positionName'));
    console.log('🆕 FormData - positionDescription:', formData.get('positionDescription'));
    console.log('🆕 FormData - departmentID:', formData.get('departmentID'));
    console.log('🆕 FormData - positionImage:', formData.get('positionImage'));

    const headers = {
      'accept': '*/*',
    };

    // Add Bearer token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/api/position/createPosition`;
    console.log('🆕 POST URL:', url);
    console.log('🆕 Headers:', headers);

    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    console.log('🆕 Response status:', response.status);
    console.log('🆕 Response ok:', response.ok);

    const data = await response.json();
    console.log('🆕 Response data:', data);
    console.log('🆕 Response data.status:', data?.status);
    console.log('🆕 Response data.message:', data?.message);

    if (!response.ok) {
      console.log('🆕 Response NOT OK - returning error');
      return {
        status: 'error',
        message: data.message || 'Tạo vị trí thất bại',
        data: null
      };
    }

    console.log('🆕 SUCCESS - returning data');
    return data;
  } catch (error) {
    console.error('🆕 EXCEPTION caught:', error);
    console.error('🆕 Error name:', error.name);
    console.error('🆕 Error message:', error.message);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Cập nhật vị trí theo ID
 * @param {number} id - ID của vị trí cần cập nhật
 * @param {FormData} formData - Form data chứa thông tin cập nhật
 * @param {string} [formData.positionName] - Tên vị trí mới
 * @param {string} [formData.positionDescription] - Mô tả vị trí mới
 * @param {string} [formData.departmentID] - ID của phòng ban mới
 * @param {File} [formData.positionImage] - File ảnh vị trí mới
 * @param {string} [token] - JWT Bearer token (optional)
 * @returns {Promise<Object>} Response từ API
 */
export async function updatePositionById(id, formData, token) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    console.log('✏️ FormData - positionName:', formData.get('positionName'));
    console.log('✏️ FormData - positionDescription:', formData.get('positionDescription'));
    console.log('✏️ FormData - departmentID:', formData.get('departmentID'));
    console.log('✏️ FormData - positionImage:', formData.get('positionImage'));

    const headers = {
      'accept': '*/*',
    };

    // Add Bearer token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/api/position/updatePositionById/${id}`;
    console.log('✏️ PUT URL:', url);
    console.log('✏️ Headers:', headers);

    // FIX: Add missing "/" before ${id}
    const response = await fetchWithTimeout(url, {
      method: 'PUT',
      headers,
      body: formData,
    });

    console.log('✏️ Response status:', response.status);
    console.log('✏️ Response ok:', response.ok);

    const data = await response.json();
    console.log('✏️ Response data:', data);
    console.log('✏️ Response data.status:', data?.status);
    console.log('✏️ Response data.message:', data?.message);

    if (!response.ok) {
      console.log('✏️ Response NOT OK - returning error');
      return {
        status: 'error',
        message: data.message || 'Cập nhật vị trí thất bại',
        data: null
      };
    }

    console.log('✏️ SUCCESS - returning data');
    return data;
  } catch (error) {
    console.error('✏️ EXCEPTION caught:', error);
    console.error('✏️ Error name:', error.name);
    console.error('✏️ Error message:', error.message);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Xóa vị trí theo ID
 * @param {number} id - ID của vị trí cần xóa
 * @param {string} [token] - JWT Bearer token (optional)
 * @returns {Promise<Object>} Response từ API
 */
export async function deletePositionById(id, token) {
  try {
    console.log('🗑️ DELETE POSITION - Starting...');
    console.log('🗑️ Position ID:', id);
    console.log('🗑️ Token provided:', token ? 'Yes' : 'No');

    if (!id) {
      console.log('🗑️ ERROR: Missing ID');
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Bearer token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/api/position/deletePositionById/${id}`;
    console.log('🗑️ DELETE URL:', url);
    console.log('🗑️ Headers:', headers);

    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers,
    });

    console.log('🗑️ Response status:', response.status);
    console.log('🗑️ Response ok:', response.ok);

    const data = await response.json();
    console.log('🗑️ Response data:', data);
    console.log('🗑️ Response data.status:', data?.status);
    console.log('🗑️ Response data.message:', data?.message);

    if (!response.ok) {
      console.log('🗑️ Response NOT OK - returning error');
      return {
        status: 'error',
        message: data.message || 'Xóa vị trí thất bại',
        data: null
      };
    }

    console.log('🗑️ SUCCESS - returning data');
    return data;
  } catch (error) {
    console.error('🗑️ EXCEPTION caught:', error);
    console.error('🗑️ Error name:', error.name);
    console.error('🗑️ Error message:', error.message);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}
