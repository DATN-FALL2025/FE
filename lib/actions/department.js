'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy-application-production.up.railway.app';
const API_PATH = '/api';

/**
 * Lấy danh sách tất cả khoa
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllDepartments() {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_PATH}/admin/departments`,
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
        message: data.message || 'Lấy danh sách khoa thất bại',
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
 * Lấy thông tin khoa theo ID
 * @param {number} id - ID của khoa
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
      `${API_BASE_URL}${API_PATH}/admin/departments/${id}`,
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
        message: data.message || 'Lấy thông tin khoa thất bại',
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
 * Tạo khoa mới
 * @param {FormData} formData - FormData chứa dữ liệu khoa
 * @returns {Promise<Object>} Response từ API
 */
export async function createDepartment(formData) {
  try {
    const departmentName = formData.get('departmentName');
    const departmentDescription = formData.get('departmentDescription');
    const departmentImage = formData.get('departmentImage');
    
    if (!departmentName) {
      return {
        status: 'error',
        message: 'Thiếu departmentName',
        data: null
      };
    }

    // Create new FormData for API request
    const apiFormData = new FormData();
    apiFormData.append('departmentName', departmentName);
    apiFormData.append('departmentDescription', departmentDescription || '');
    
    // Only append image if it's a File object
    if (departmentImage && departmentImage instanceof File && departmentImage.size > 0) {
      apiFormData.append('departmentImage', departmentImage);
    } else {
      apiFormData.append('departmentImage', '');
    }
    
    console.log('🏢 Create Department Request:', {
      departmentName,
      departmentDescription,
      hasImage: departmentImage instanceof File && departmentImage.size > 0
    });

    const response = await fetch(
      `${API_BASE_URL}${API_PATH}/admin/departments/create`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: apiFormData,
      }
    );

    const data = await response.json();
    console.log('🏢 Create Department Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Tạo khoa thất bại',
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
 * Cập nhật khoa theo ID
 * @param {number} id - ID của khoa cần cập nhật
 * @param {FormData} formData - FormData chứa dữ liệu cập nhật
 * @returns {Promise<Object>} Response từ API
 */
export async function updateDepartmentById(id, formData) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const departmentName = formData.get('departmentName');
    const departmentDescription = formData.get('departmentDescription');
    const departmentImage = formData.get('departmentImage');

    // Create new FormData for API request
    const apiFormData = new FormData();
    if (departmentName) apiFormData.append('departmentName', departmentName);
    if (departmentDescription) apiFormData.append('departmentDescription', departmentDescription);
    
    // Only append image if it's a File object
    if (departmentImage && departmentImage instanceof File && departmentImage.size > 0) {
      apiFormData.append('departmentImage', departmentImage);
    }
    
    console.log('✏️ Update Department Request:', {
      id,
      departmentName,
      departmentDescription,
      hasImage: departmentImage instanceof File && departmentImage.size > 0
    });

    const response = await fetch(
      `${API_BASE_URL}${API_PATH}/admin/departments/${id}`,
      {
        method: 'PUT',
        headers: {
          'accept': '*/*',
        },
        body: apiFormData,
      }
    );

    const data = await response.json();
    console.log('✏️ Update Department Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật khoa thất bại',
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
 * Xóa khoa theo ID
 * @param {number} id - ID của khoa cần xóa
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
      `${API_BASE_URL}${API_PATH}/admin/departments/${id}`,
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
        message: data.message || 'Xóa khoa thất bại',
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

