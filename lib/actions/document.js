'use server';

const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';

/**
 * Lấy danh sách tất cả tài liệu
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllDocuments() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/documents`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();

    console.log('📄 getAllDocuments - Response:', { status: response.status, ok: response.ok, data });

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy danh sách tài liệu thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting all documents:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy thông tin tài liệu theo ID
 * @param {number} id - ID của tài liệu
 * @returns {Promise<Object>} Response từ API
 */
export async function getDocumentById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/documents/${id}`,
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
        message: data.message || 'Lấy thông tin tài liệu thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting document by id:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Tạo tài liệu mới
 * @param {Object} documentData - Dữ liệu tài liệu
 * @param {string} documentData.documentName - Tên tài liệu
 * @param {string} documentData.documentDescription - Mô tả tài liệu
 * @returns {Promise<Object>} Response từ API
 */
export async function createDocument(documentData) {
  try {
    const { documentName, documentDescription } = documentData;

    if (!documentName || !documentDescription) {
      return {
        status: 'error',
        message: 'Thiếu documentName hoặc documentDescription',
        data: null
      };
    }

    // API expects JSON body
    const requestBody = {
      documentName,
      documentDescription
    };

    console.log('📄 Create Document Request:', requestBody);

    const response = await fetch(`${API_BASE_URL}/admin/documents/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    console.log('📄 Create Document Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Tạo tài liệu thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error creating document:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Cập nhật tài liệu theo ID
 * @param {number} id - ID của tài liệu cần cập nhật
 * @param {Object} documentData - Dữ liệu cập nhật
 * @param {string} [documentData.documentName] - Tên tài liệu mới
 * @param {string} [documentData.documentDescription] - Mô tả tài liệu mới
 * @returns {Promise<Object>} Response từ API
 */
export async function updateDocumentById(id, documentData) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const { documentName, documentDescription } = documentData;

    // API expects JSON body
    const requestBody = {
      documentName,
      documentDescription
    };

    console.log('📝 Update Document Request:', { id, body: requestBody });

    const response = await fetch(`${API_BASE_URL}/admin/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('📝 Update Document Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật tài liệu thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error updating document:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Xóa tài liệu theo ID
 * @param {number} id - ID của tài liệu cần xóa
 * @returns {Promise<Object>} Response từ API
 */
export async function deleteDocumentById(id) {
  try {
    if (!id) {
      return {
        status: 'error',
        message: 'Thiếu ID',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/documents/${id}`,
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
        message: data.message || 'Xóa tài liệu thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error deleting document:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

