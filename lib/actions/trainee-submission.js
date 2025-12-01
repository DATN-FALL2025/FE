'use server';

const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';

/**
 * Tạo trainee submission mới (Trainee nộp tài liệu)
 * API Flow: TRAINEE -> submit document -> HEAD/TRAINING_DIRECTOR review
 *
 * @param {Object} submissionData - Dữ liệu submission
 * @param {string|number} submissionData.documentID - ID của document cần nộp
 * @param {string|number} submissionData.traineeApplicationId - ID của đơn đăng ký trainee
 * @param {string} submissionData.submissionName - Tên submission
 * @param {string} [submissionData.takeNote] - Ghi chú thêm
 * @param {File} submissionData.submissionDocumentFile - File tài liệu cần nộp
 * @returns {Promise<Object>} Response từ API
 */
export async function createTraineeSubmission(submissionData) {
  try {
    const {
      documentID,
      traineeApplicationId,
      submissionName,
      takeNote,
      submissionDocumentFile
    } = submissionData;

    // Validate required fields
    if (!documentID || !traineeApplicationId || !submissionName || !submissionDocumentFile) {
      return {
        status: 'error',
        message: 'Thiếu thông tin bắt buộc: documentID, traineeApplicationId, submissionName, hoặc submissionDocumentFile',
        data: null
      };
    }

    // API expects multipart/form-data
    const formData = new FormData();
    formData.append('documentID', String(documentID));
    formData.append('traineeApplicationId', String(traineeApplicationId));
    formData.append('submissionName', submissionName);
    if (takeNote) {
      formData.append('takeNote', takeNote);
    }
    formData.append('submissionDocumentFile', submissionDocumentFile);

    console.log('📤 Create Trainee Submission Request:', {
      documentID,
      traineeApplicationId,
      submissionName,
      takeNote,
      hasFile: !!submissionDocumentFile,
      fileName: submissionDocumentFile?.name
    });

    const response = await fetch(
      `${API_BASE_URL}/trainee_submission/create_trainee_submission_by_trainee`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log('📤 Create Trainee Submission Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Nộp tài liệu thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error creating trainee submission:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Cập nhật trainee submission (Trainee chỉnh sửa/nộp lại tài liệu)
 *
 * @param {number} submissionID - ID của submission cần cập nhật
 * @param {Object} updateData - Dữ liệu cập nhật
 * @param {string} [updateData.newSubmissionName] - Tên submission mới
 * @param {string} [updateData.newTakeNote] - Ghi chú mới
 * @param {File} [updateData.newSubmissionDocumentFile] - File tài liệu mới
 * @returns {Promise<Object>} Response từ API
 */
export async function updateTraineeSubmission(submissionID, updateData) {
  try {
    if (!submissionID) {
      return {
        status: 'error',
        message: 'Thiếu submissionID',
        data: null
      };
    }

    const {
      newSubmissionName,
      newTakeNote,
      newSubmissionDocumentFile
    } = updateData;

    // API expects multipart/form-data
    const formData = new FormData();
    if (newSubmissionName) {
      formData.append('newSubmissionName', newSubmissionName);
    }
    if (newTakeNote) {
      formData.append('newTakeNote', newTakeNote);
    }
    if (newSubmissionDocumentFile) {
      formData.append('newSubmissionDocumentFile', newSubmissionDocumentFile);
    }

    console.log('✏️ Update Trainee Submission Request:', {
      submissionID,
      newSubmissionName,
      newTakeNote,
      hasFile: !!newSubmissionDocumentFile,
      fileName: newSubmissionDocumentFile?.name
    });

    const response = await fetch(
      `${API_BASE_URL}/trainee_submission/update/${submissionID}`,
      {
        method: 'PUT',
        headers: {
          'accept': '*/*',
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log('✏️ Update Trainee Submission Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật submission thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error updating trainee submission:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy chi tiết trainee submission
 *
 * @param {number} traineeSubmissionId - ID của submission
 * @returns {Promise<Object>} Response từ API
 */
export async function getTraineeSubmissionDetail(traineeSubmissionId) {
  try {
    if (!traineeSubmissionId) {
      return {
        status: 'error',
        message: 'Thiếu traineeSubmissionId',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/trainee_submission/get_trainee_submission_detail/${traineeSubmissionId}`,
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
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllTraineeApplicationsByTrainee() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/trainee_application/get_all_application_by_trainee`,
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
 * @returns {Promise<Object>} Response từ API
 */
export async function getTraineeApplicationDetailByTrainee(applicationId) {
  try {
    if (!applicationId) {
      return {
        status: 'error',
        message: 'Thiếu applicationId',
        data: null
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/trainee_application/get_trainee_application_detail_by_trainee/${applicationId}`,
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
 * @returns {Promise<Object>} Response từ API
 */
export async function uploadTraineeApplication(traineeApplicationId) {
  try {
    if (!traineeApplicationId) {
      return {
        status: 'error',
        message: 'Thiếu traineeApplicationId',
        data: null
      };
    }

    console.log('📤 Upload Trainee Application:', { traineeApplicationId });

    const response = await fetch(
      `${API_BASE_URL}/trainee_application/upload_trainee_application/${traineeApplicationId}`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
      }
    );

    const data = await response.json();
    console.log('📤 Upload Trainee Application Response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Submit hồ sơ thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error uploading trainee application:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Complete trainee application (đánh dấu hoàn thành toàn bộ hồ sơ)
 *
 * @param {number} traineeApplicationId - ID của trainee application
 * @returns {Promise<Object>} Response từ API
 */
export async function completeTraineeApplication(traineeApplicationId) {
  try {
    if (!traineeApplicationId) {
      return {
        status: 'error',
        message: 'Thiếu traineeApplicationId',
        data: null
      };
    }

    console.log('✅ Complete Trainee Application:', { traineeApplicationId });

    const response = await fetch(
      `${API_BASE_URL}/trainee_application/${traineeApplicationId}/complete`,
      {
        method: 'PUT',
        headers: {
          'accept': '*/*',
        },
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
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllTraineeApplicationsByStaffAcademic() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/trainee_application/getAllTraineeApplicationByStaffAcademic`,
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
      `${API_BASE_URL}/trainee_application/filter-trainee-application-by-position-by-staff-academic?positionId=${positionId}`,
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
