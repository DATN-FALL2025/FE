'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy.onrender.com';

/**
 * Lấy danh sách tất cả rules template
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllRules() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/rules`,
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
        message: data.message || 'Lấy danh sách rules thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting all rules:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy thông tin rule theo ID
 * @param {number} id - ID của rule
 * @returns {Promise<Object>} Response từ API
 */
export async function getRuleById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/admin/rules/${id}`,
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
        message: data.message || 'Lấy thông tin rule thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting rule by id:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Tạo rule mới
 * @param {Object} ruleData - Dữ liệu rule
 * @returns {Promise<Object>} Response từ API
 */
export async function createRule(ruleData) {
  try {
    if (!ruleData || Object.keys(ruleData).length === 0) {
      return {
        status: 'error',
        message: 'Thiếu dữ liệu rule',
        data: null
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/rules/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify(ruleData)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Tạo rule thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error creating rule:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Cập nhật rule theo ID
 * @param {number} id - ID của rule cần cập nhật
 * @param {Object} ruleData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Response từ API
 */
export async function updateRuleById(id, ruleData) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    if (!ruleData || Object.keys(ruleData).length === 0) {
      return {
        status: 'error',
        message: 'Thiếu dữ liệu cập nhật',
        data: null
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/rules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify(ruleData)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật rule thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error updating rule:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Xóa rule theo ID
 * @param {number} id - ID của rule cần xóa
 * @returns {Promise<Object>} Response từ API
 */
export async function deleteRuleById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/admin/rules/${id}`,
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
        message: data.message || 'Xóa rule thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error deleting rule:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}
