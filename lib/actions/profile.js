'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy-application-production.up.railway.app';

/**
 * Lấy thông tin profile của user hiện tại
 *
 * @param {string|null} [token] - Auth token from client
 * @returns {Promise<Object>} Response từ API
 */
export async function getProfile(token = null) {
  try {
    const headers = {
      'accept': '*/*',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('👤 Fetching user profile');

    const response = await fetch(
      `${API_BASE_URL}/api/account/profile`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    const data = await response.json();
    console.log('👤 Get profile response:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Lấy thông tin profile thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting profile:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}
