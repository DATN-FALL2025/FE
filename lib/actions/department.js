'use server';

const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';

/**
 * Lấy danh sách tất cả phòng ban
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllDepartments() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/departments`,
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
        message: data.message || 'Lấy danh sách phòng ban thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting all departments:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy thông tin phòng ban theo ID
 * @param {number} id - ID của phòng ban
 * @returns {Promise<Object>} Response từ API
 */
export async function getDepartmentById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/departments/${id}`,
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
        message: data.message || 'Lấy thông tin phòng ban thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting department by id:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Tạo phòng ban mới
 * @param {Object} departmentData - Dữ liệu phòng ban
 * @param {string} departmentData.departmentName - Tên phòng ban
 * @param {string} departmentData.departmentDescription - Mô tả phòng ban
 * @param {File} [departmentData.departmentImage] - File ảnh phòng ban
 * @returns {Promise<Object>} Response từ API
 */
export async function createDepartment(departmentData) {
  try {
    const { departmentName, departmentDescription, departmentImage } = departmentData;
    
    if (!departmentName || !departmentDescription) {
      return {
        status: 'error',
        message: 'Thiếu departmentName hoặc departmentDescription',
        data: null
      };
    }

    // API expects FormData (multipart/form-data)
    const formData = new FormData();
    formData.append('departmentName', departmentName);
    formData.append('departmentDescription', departmentDescription);
    if (departmentImage) {
      formData.append('departmentImage', departmentImage);
    } else {
      formData.append('departmentImage', ''); // Empty string for no image
    }
    
    console.log('🏢 Create Department Request:', {
      departmentName,
      departmentDescription,
      hasImage: !!departmentImage
    });

    const response = await fetch(
      `${API_BASE_URL}/admin/departments/create`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log('🏢 Create Department Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Tạo phòng ban thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error creating department:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Cập nhật phòng ban theo ID
 * @param {number} id - ID của phòng ban cần cập nhật
 * @param {Object} departmentData - Dữ liệu cập nhật
 * @param {string} [departmentData.departmentName] - Tên phòng ban mới
 * @param {string} [departmentData.departmentDescription] - Mô tả phòng ban mới
 * @param {File} [departmentData.departmentImage] - File ảnh phòng ban mới
 * @returns {Promise<Object>} Response từ API
 */
export async function updateDepartmentById(id, departmentData) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    if (!departmentData || Object.keys(departmentData).length === 0) {
      return {
        status: 'error',
        message: 'Thiếu dữ liệu cập nhật',
        data: null
      };
    }

    const { departmentName, departmentDescription, departmentImage } = departmentData;

    // API expects FormData (multipart/form-data)
    const formData = new FormData();
    if (departmentName) formData.append('departmentName', departmentName);
    if (departmentDescription) formData.append('departmentDescription', departmentDescription);
    if (departmentImage) formData.append('departmentImage', departmentImage);
    
    console.log('✏️ Update Department Request:', {
      id,
      departmentName,
      departmentDescription,
      hasImage: !!departmentImage
    });

    const response = await fetch(
      `${API_BASE_URL}/admin/departments/${id}`,
      {
        method: 'PUT',
        headers: {
          'accept': '*/*',
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log('✏️ Update Department Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật phòng ban thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error updating department:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Xóa phòng ban theo ID
 * @param {number} id - ID của phòng ban cần xóa
 * @returns {Promise<Object>} Response từ API
 */
export async function deleteDepartmentById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/departments/${id}`,
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
        message: data.message || 'Xóa phòng ban thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error deleting department:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

