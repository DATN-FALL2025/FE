'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy-application-production.up.railway.app';

/**
 * Get authorization token
 * @param {string|null} token - Token passed from client
 * @returns {string|null} Authorization token or null
 */
function getAuthToken(token) {
  return token || null;
}

/**
 * Lấy chi tiết trainee submission
 *
 * @param {number} traineeSubmissionId - ID của submission
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function getTraineeSubmissionDetail(traineeSubmissionId, token = null) {
  try {
    if (!traineeSubmissionId) {
      return {
        status: 'error',
        message: 'Thiếu traineeSubmissionId',
        data: null
      };
    }

    const authToken = getAuthToken(token);
    const headers = {
      'Content-Type': 'application/json',
      'accept': '*/*',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('📄 Fetching submission detail for ID:', traineeSubmissionId);

    const response = await fetch(
      `${API_BASE_URL}/api/trainee_submission/get_trainee_submission_detail/${traineeSubmissionId}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('📄 Get submission detail response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy chi tiết submission thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting trainee submission detail:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy tất cả trainee applications của trainee hiện tại
 *
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllTraineeApplicationsByTrainee(token = null) {
  try {
    const authToken = getAuthToken(token);
    const headers = {
      'Content-Type': 'application/json',
      'accept': '*/*',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('📋 Fetching trainee applications with token:', authToken ? 'Yes' : 'No');

    const response = await fetch(
      `${API_BASE_URL}/api/trainee_application/get_all_application_by_trainee`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('📋 Get all applications response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy danh sách đơn đăng ký thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting all trainee applications:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy chi tiết trainee application theo ID (cho trainee)
 *
 * @param {number} applicationId - ID của trainee application
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function getTraineeApplicationDetailByTrainee(applicationId, token = null) {
  try {
    if (!applicationId) {
      return {
        status: 'error',
        message: 'Thiếu applicationId',
        data: null
      };
    }

    const authToken = getAuthToken(token);
    const headers = {
      'Content-Type': 'application/json',
      'accept': '*/*',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('📄 Fetching application detail for ID:', applicationId, 'with token:', authToken ? 'Yes' : 'No');

    const response = await fetch(
      `${API_BASE_URL}/api/trainee_application/get_trainee_application_detail_by_trainee/${applicationId}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('📄 Get application detail response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy chi tiết đơn đăng ký thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting trainee application detail:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Upload/Submit trainee application (đánh dấu hoàn thành nộp hồ sơ)
 *
 * @param {number} traineeApplicationId - ID của trainee application
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function uploadTraineeApplication(traineeApplicationId, token = null) {
  try {
    console.log('🚀 uploadTraineeApplication called with:', { traineeApplicationId, token: token ? 'Yes' : 'No' });
    
    if (!traineeApplicationId) {
      console.error('❌ Missing traineeApplicationId');
      return {
        status: 'error',
        message: 'Thiếu traineeApplicationId',
        data: null
      };
    }

    const authToken = getAuthToken(token);
    const headers = {
      'accept': '*/*',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('🔑 Authorization header added');
    } else {
      console.warn('⚠️ No auth token available');
    }

    const url = `${API_BASE_URL}/api/trainee_application/upload_trainee_application/${traineeApplicationId}`;
    console.log('📤 Upload Trainee Application Request:', { 
      url,
      traineeApplicationId, 
      hasToken: !!authToken,
      headers 
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
    });

    console.log('📥 Response status:', response.status, response.statusText);
    console.log('📥 Response ok:', response.ok);

    const data = await response.json();
    console.log('📥 Upload Trainee Application Response:', data);
    console.log('📥 Response data status:', data.status);
    console.log('📥 Response data message:', data.message);

    if (!response.ok) {
      console.error('❌ Response not ok:', response.status, data);
      return {
        status: 'error',
        message: data.message || 'Submit hồ sơ thất bại',
        data: null
      };
    }

    console.log('✅ Upload successful, returning data');
    return data;
  } catch (error) {
    console.error('💥 Error uploading trainee application:', error);
    console.error('💥 Error details:', error.message, error.stack);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Complete trainee application (đánh dấu hoàn thành toàn bộ hồ sơ)
 * Chỉ được phép khi status là "Approved"
 *
 * @param {number} traineeApplicationId - ID của trainee application
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function completeTraineeApplication(traineeApplicationId, token = null) {
  try {
    if (!traineeApplicationId) {
      return {
        status: 'error',
        message: 'Thiếu traineeApplicationId',
        data: null
      };
    }

    const authToken = getAuthToken(token);
    const headers = {
      'accept': '*/*',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('✅ Complete Trainee Application:', { traineeApplicationId });

    const response = await fetch(
      `${API_BASE_URL}/api/trainee_application/${traineeApplicationId}/complete`,
      {
        method: 'PUT',
        headers,
      }
    );

    const data = await response.json();
    console.log('✅ Complete Trainee Application Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Hoàn thành hồ sơ thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error completing trainee application:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy tất cả trainee applications (cho ACADEMIC_STAFF_AFFAIR)
 *
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllTraineeApplicationsByStaffAcademic(token = null) {
  try {
    const authToken = getAuthToken(token);
    const headers = {
      'Content-Type': 'application/json',
      'accept': '*/*',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('📋 Fetching all trainee applications by staff academic affair');

    const response = await fetch(
      `${API_BASE_URL}/api/trainee_application/get_all_trainee_application_by_staff_academic_affair`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('📋 Get all applications by staff response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy danh sách đơn đăng ký thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting all trainee applications by staff:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lọc trainee applications theo status (cho ACADEMIC_STAFF_AFFAIR)
 *
 * @param {string} statusEnum - Status enum (Pending, InProgress, Complete, etc.)
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function getTraineeApplicationsByStatus(statusEnum, token = null) {
  try {
    if (!statusEnum) {
      return {
        status: 'error',
        message: 'Thiếu statusEnum',
        data: null
      };
    }

    const authToken = getAuthToken(token);
    const headers = {
      'Content-Type': 'application/json',
      'accept': '*/*',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('🔍 Filtering trainee applications by status:', statusEnum);

    const response = await fetch(
      `${API_BASE_URL}/api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair?statusEnum=${statusEnum}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('🔍 Filter by status response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lọc đơn đăng ký theo trạng thái thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error filtering trainee applications by status:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lọc trainee applications theo position (cho ACADEMIC_STAFF_AFFAIR)
 *
 * @param {number} positionId - ID của position
 * @returns {Promise<Object>} Response từ API
 */
export async function filterTraineeApplicationsByPosition(positionId) {
  try {
    if (!positionId) {
      return {
        status: 'error',
        message: 'Thiếu positionId',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/trainee_application/filter-trainee-application-by-position-by-staff-academic?positionId=${positionId}`,
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
        message: data.message || 'Lọc đơn đăng ký theo vị trí thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error filtering trainee applications by position:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Complete trainee application status
 * Only allowed if current status is Approve
 * 
 * @param {number} traineeApplicationId - ID của trainee application
 * @returns {Promise<Object>} Response từ API
 */
export async function completeTraineeApplicationStatus(traineeApplicationId) {
  try {
    if (!traineeApplicationId) {
      return {
        status: 'error',
        message: 'Thiếu traineeApplicationId',
        data: null
      };
    }

    console.log('✅ Complete Trainee Application Status:', { traineeApplicationId });

    const response = await fetch(
      `${API_BASE_URL}/api/trainee-application/complete-status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify({ traineeApplicationId })
      }
    );

    const data = await response.json();
    console.log('✅ Complete Status Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Hoàn thành trạng thái hồ sơ thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error completing trainee application status:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy chi tiết trainee application theo ID (cho staff academic)
 *
 * @param {number} traineeApplicationId - ID của trainee application
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function getTraineeApplicationDetailByStaff(traineeApplicationId, token = null) {
  try {
    if (!traineeApplicationId) {
      return {
        status: 'error',
        message: 'Thiếu traineeApplicationId',
        data: null
      };
    }

    const authToken = getAuthToken(token);
    const headers = {
      'Content-Type': 'application/json',
      'accept': '*/*',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('📄 Fetching application detail by staff for ID:', traineeApplicationId);

    const response = await fetch(
      `${API_BASE_URL}/api/trainee_application/get_trainee_application_detail_by_staff/${traineeApplicationId}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('📄 Get application detail by staff response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy chi tiết đơn đăng ký thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting trainee application detail by staff:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Get approved and active trainee applications
 * Returns applications with StatusEnum = Approve AND isActive = true
 * 
 * @returns {Promise<Object>} Response từ API
 */
export async function getApprovedActiveTraineeApplications() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/trainee-application/approved-active`,
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
        message: data.message || 'Lấy danh sách hồ sơ đã duyệt thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting approved active applications:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy thông tin đợt nộp gần nhất
 *
 * @returns {Promise<Object>} Response từ API
 */
export async function getNearestBatch() {
  try {
    console.log('📅 Fetching nearest batch info');

    const response = await fetch(
      `${API_BASE_URL}/api/batch/nearest_batch`,
      {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('📅 Get nearest batch response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy thông tin đợt nộp thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting nearest batch:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}
