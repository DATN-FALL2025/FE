'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy-application-production.up.railway.app';

/**
 * Lấy thời gian deadline của ma trận (trạng thái Pending)
 * @param {string|null} token - Auth token
 * @returns {Promise<Object>} Response từ API
 */
export async function getMatrixTimeDeadline(token = null) {
  try {
    const headers = { 'accept': '*/*' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `${API_BASE_URL}/api/matrix/matrix-time-deadline`,
      { method: 'GET', headers, cache: 'no-store' }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting matrix time deadline:', error);
    return { status: 'error', message: error.message, data: null };
  }
}

/**
 * Lấy thời gian active của ma trận (trạng thái Complete/Active)
 * @param {string|null} token - Auth token
 * @returns {Promise<Object>} Response từ API
 */
export async function getMatrixTimeActive(token = null) {
  try {
    const headers = { 'accept': '*/*' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `${API_BASE_URL}/api/matrix/matrix-time-active`,
      { method: 'GET', headers, cache: 'no-store' }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting matrix time active:', error);
    return { status: 'error', message: error.message, data: null };
  }
}

/**
 * Set trạng thái Pending cho ma trận (tạo deadline) - Training Director
 * @param {Object} params - Parameters
 * @param {string} params.startDate_deadLine - Ngày bắt đầu deadline
 * @param {string} params.endDate_deadLine - Ngày kết thúc deadline
 * @param {string|null} token - Auth token
 * @returns {Promise<Object>} Response từ API
 */
export async function setPendingStatusMatrix({ startDate_deadLine, endDate_deadLine }, token = null) {
  try {
    const headers = { 
      'accept': '*/*',
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `${API_BASE_URL}/api/matrix/setPendintStatusMatrix_for_training_director`,
      { 
        method: 'POST', 
        headers,
        body: JSON.stringify({
          startDate_deadLine,
          endDate_deadLine
        })
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting pending status:', error);
    return { status: 'error', message: error.message, data: null };
  }
}

/**
 * Set trạng thái Complete/Active cho ma trận - Training Director
 * @param {Object} params - Parameters
 * @param {string} params.startDate - Ngày bắt đầu active
 * @param {string} params.endDate - Ngày kết thúc active
 * @param {string|null} token - Auth token
 * @returns {Promise<Object>} Response từ API
 */
export async function setCompleteStatusMatrix({ startDate, endDate }, token = null) {
  try {
    const headers = { 
      'accept': '*/*',
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `${API_BASE_URL}/api/matrix/setCompleteStatusToActive_for_training_director`,
      { 
        method: 'PUT', 
        headers,
        body: JSON.stringify({ startDate, endDate })
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting complete status:', error);
    return { status: 'error', message: error.message, data: null };
  }
}
