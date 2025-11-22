'use server';

const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';

/**
 * Lấy danh sách tất cả quy tắc tài liệu
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllDocumentRules() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/document-rules`,
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
        message: data.message || 'Lấy danh sách quy tắc tài liệu thất bại',
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
 * Lấy thông tin quy tắc tài liệu theo ID
 * @param {number} id - ID của quy tắc tài liệu
 * @returns {Promise<Object>} Response từ API
 */
export async function getDocumentRuleById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/document-rules/${id}`,
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
        message: data.message || 'Lấy thông tin quy tắc tài liệu thất bại',
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
 * Tạo quy tắc tài liệu mới
 * @param {Object} documentRuleData - Dữ liệu quy tắc tài liệu
 * @returns {Promise<Object>} Response từ API
 */
export async function createDocumentRule(documentRuleData) {
  try {
    if (!documentRuleData || Object.keys(documentRuleData).length === 0) {
      return {
        status: 'error',
        message: 'Thiếu dữ liệu quy tắc tài liệu',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/document-rules/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentRuleData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || `Tạo quy tắc tài liệu thất bại (${response.status})`,
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
 * Cập nhật quy tắc tài liệu theo ID
 * @param {number} id - ID của quy tắc tài liệu cần cập nhật
 * @param {Object} documentRuleData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Response từ API
 */
export async function updateDocumentRuleById(id, documentRuleData) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    if (!documentRuleData || Object.keys(documentRuleData).length === 0) {
      return {
        status: 'error',
        message: 'Thiếu dữ liệu cập nhật',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/document-rules/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentRuleData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật quy tắc tài liệu thất bại',
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
 * Xóa quy tắc tài liệu theo ID
 * @param {number} id - ID của quy tắc tài liệu cần xóa
 * @returns {Promise<Object>} Response từ API
 */
export async function deleteDocumentRuleById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/document-rules/${id}`,
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
        message: data.message || 'Xóa quy tắc tài liệu thất bại',
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

