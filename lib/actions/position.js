'use server';

const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';

/**
 * Lấy danh sách tất cả vị trí
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllPositions() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/position/getAllPossition`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
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
    console.error('Error getting all positions:', error);
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
 * @returns {Promise<Object>} Response từ API
 */
export async function getPositionById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/position/getPositionById/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
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
 * @param {File} [formData.positionImage] - File ảnh vị trí
 * @returns {Promise<Object>} Response từ API
 */
export async function createPosition(formData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/position/createPosition`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Tạo vị trí thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error creating position:', error);
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
 * @param {File} [formData.positionImage] - File ảnh vị trí mới
 * @returns {Promise<Object>} Response từ API
 */
export async function updatePositionById(id, formData) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/position/updatePositionById${id}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật vị trí thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error updating position:', error);
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
 * @returns {Promise<Object>} Response từ API
 */
export async function deletePositionById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/position/deletePositionById${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Xóa vị trí thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error deleting position:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

