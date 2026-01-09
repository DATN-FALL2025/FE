// Client-side functions for trainee submission
// These run in the browser and can handle File objects

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
 * @param {string|null} [submissionData.token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function createTraineeSubmission(submissionData) {
  try {
    console.log('🚀 createTraineeSubmission called with:', submissionData);

    const {
      documentID,
      traineeApplicationId,
      submissionName,
      takeNote,
      submissionDocumentFile,
      token
    } = submissionData;

    console.log('📋 Extracted data:', {
      documentID,
      traineeApplicationId,
      submissionName,
      takeNote,
      hasFile: !!submissionDocumentFile,
      fileName: submissionDocumentFile?.name,
      fileSize: submissionDocumentFile?.size,
      fileType: submissionDocumentFile?.type,
    });

    // Validate required fields
    if (!documentID || !traineeApplicationId || !submissionName || !submissionDocumentFile) {
      console.error('❌ Missing required fields');
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

    console.log('📦 FormData created with fields:', {
      documentID: String(documentID),
      traineeApplicationId: String(traineeApplicationId),
      submissionName,
      takeNote,
      fileName: submissionDocumentFile.name,
    });

    // Log FormData entries for debugging
    console.log('📦 FormData entries:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`  ${pair[0]}: File(${pair[1].name}, ${pair[1].size} bytes, ${pair[1].type})`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }

    const headers = {
      'accept': '*/*',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Authorization header added');
      console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No auth token available');
    }

    const url = `${API_BASE_URL}/api/trainee_submission/create_trainee_submission_by_trainee`;
    console.log('📤 Making POST request to:', url);
    console.log('📤 Request headers:', headers);
    console.log('📤 Request method: POST');
    console.log('📤 Request body type: FormData');

    console.log('📤 Sending request...');
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    console.log('📥 Response received!');
    console.log('📥 Response status:', response.status, response.statusText);
    console.log('📥 Response ok:', response.ok);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    const responseText = await response.text();
    console.log('📥 Response text:', responseText);

    try {
      data = JSON.parse(responseText);
      console.log('📥 Response data:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON:', parseError);
      console.log('📥 Raw response text:', responseText);
      // If response is empty or not JSON, create error response
      if (!responseText || responseText.trim() === '') {
        return {
          status: response.ok ? '200 OK' : 'error',
          message: response.ok ? 'Nộp tài liệu thành công' : 'Không có phản hồi từ server',
          data: null
        };
      }
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      console.error('❌ Response not ok:', response.status, data);
      return {
        status: 'error',
        message: data.message || 'Nộp tài liệu thất bại',
        data: null
      };
    }

    console.log('✅ Submission created successfully');
    return data;
  } catch (error) {
    console.error('💥 Error creating trainee submission:', error);
    console.error('💥 Error details:', error.message, error.stack);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}


/**
 * Cập nhật trainee submission (Trainee cập nhật tài liệu đã nộp)
 *
 * @param {string|number} submissionId - ID của submission cần cập nhật
 * @param {Object} updateData - Dữ liệu cập nhật
 * @param {string} [updateData.newSubmissionName] - Tên submission mới
 * @param {string} [updateData.newTakeNote] - Ghi chú mới
 * @param {File} [updateData.newSubmissionDocumentFile] - File tài liệu mới
 * @param {string|null} [updateData.token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function updateTraineeSubmission(submissionId, updateData) {
  try {
    console.log('🔄 updateTraineeSubmission called with:', { submissionId, updateData });

    const {
      newSubmissionName,
      newTakeNote,
      newSubmissionDocumentFile,
      token
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

    const headers = {
      'accept': '*/*',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/api/trainee_submission/update`;
    console.log('📤 Making PUT request to:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: formData,
    });

    console.log('📥 Response status:', response.status);

    let data;
    const responseText = await response.text();

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      if (!responseText || responseText.trim() === '') {
        return {
          status: response.ok ? '200 OK' : 'error',
          message: response.ok ? 'Cập nhật tài liệu thành công' : 'Không có phản hồi từ server',
          data: null
        };
      }
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Cập nhật tài liệu thất bại',
        data: null
      };
    }

    console.log('✅ Submission updated successfully');
    return data;
  } catch (error) {
    console.error('💥 Error updating trainee submission:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}
