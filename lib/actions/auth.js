'use server';

const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';

/**
 * Decode JWT token để lấy payload
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload hoặc null nếu lỗi
 */
function decodeJWT(token) {
  try {
    // JWT có format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format');
      return null;
    }

    // Decode base64 payload (part[1])
    const payload = parts[1];
    // Replace URL-safe characters và pad nếu cần
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    
    const decoded = JSON.parse(jsonPayload);
    console.log('🔓 Decoded JWT:', decoded);
    
    return decoded;
  } catch (error) {
    console.error('❌ Error decoding JWT:', error);
    return null;
  }
}

/**
 * Đăng nhập tài khoản
 * @param {Object} loginData - Dữ liệu đăng nhập
 * @param {string} loginData.userName - Tên đăng nhập
 * @param {string} loginData.password - Mật khẩu
 * @returns {Promise<Object>} Response từ API
 */
export async function authenticateAccount(loginData) {
  try {
    const { userName, password } = loginData;
    
    if (!userName || !password) {
      return {
        status: 'error',
        message: 'Thiếu userName hoặc password',
        data: null
      };
    }

    // API expects query parameters, not JSON body
    const queryParams = new URLSearchParams({
      userName,
      password
    });
    
    const url = `${API_BASE_URL}/account/v1/authenticateAccount?${queryParams}`;
    console.log('🔐 Login Request:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': '*/*',
      },
    });

    const data = await response.json();
    
    // Debug logging
    console.log('🔐 Login Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    // Check if successful (API returns "200 OK" or similar)
    if (!response.ok || (data.status && !data.status.includes('OK') && !data.status.includes('success'))) {
      return {
        status: 'error',
        message: data.message || 'Đăng nhập thất bại',
        data: null
      };
    }

    // Decode JWT token để lấy thông tin user
    const token = data.data;
    const decodedPayload = decodeJWT(token);
    
    if (!decodedPayload) {
      return {
        status: 'error',
        message: 'Không thể decode JWT token',
        data: null
      };
    }

    // Tạo object user data từ decoded JWT
    const userData = {
      token: token,
      userName: decodedPayload.sub || userName, // sub chứa username
      role: decodedPayload.role, // role từ JWT
      iat: decodedPayload.iat, // issued at time
      exp: decodedPayload.exp, // expiration time
    };

    console.log('✅ Login success! User data:', userData);

    // Normalize response với user data đầy đủ
    return {
      status: 'success',
      message: data.message,
      data: userData
    };
  } catch (error) {
    console.error('Error authenticating account:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Tạo tài khoản người dùng mới
 * @param {Object} accountData - Dữ liệu tài khoản
 * @param {string} accountData.userName - Tên đăng nhập
 * @param {string} accountData.password - Mật khẩu
 * @param {string} accountData.gmail - Email
 * @param {string} [accountData.accountImage] - URL ảnh đại diện
 * @returns {Promise<Object>} Response từ API
 */
export async function createUser(accountData) {
  try {
    const { userName, password, gmail, accountImage } = accountData;
    
    if (!userName || !password || !gmail) {
      return {
        status: 'error',
        message: 'Thiếu thông tin bắt buộc (userName, password, gmail)',
        data: null
      };
    }

    // API expects query parameters, not JSON body
    const queryParams = new URLSearchParams({
      userName,
      password,
      gmail,
      accountImage: accountImage || ''
    });
    
    const url = `${API_BASE_URL}/account/v1/createUser?${queryParams}`;
    console.log('📝 Signup Request:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': '*/*',
      },
    });

    const data = await response.json();
    
    // Debug logging
    console.log('📝 Signup Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    // Check if successful (API returns "200 OK" in status field)
    if (!response.ok || (data.status && !data.status.includes('OK') && !data.status.includes('success'))) {
      console.error('❌ Signup failed:', data);
      return {
        status: 'error',
        message: data.message || 'Tạo tài khoản thất bại',
        data: null
      };
    }

    console.log('✅ Signup success!');
    // Normalize response
    return {
      status: 'success',
      message: data.message,
      data: data.data
    };
  } catch (error) {
    console.error('💥 Error creating user:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy danh sách tất cả người dùng
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllUsers() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/account/v1/getAllUser`,
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
        message: data.message || 'Lấy danh sách người dùng thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting all users:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Tạo role mới
 * @param {Object} roleData - Dữ liệu role
 * @param {string} roleData.roleName - Tên role (VD: "ACADEMIC_STAFF_AFFAIR")
 * @returns {Promise<Object>} Response từ API
 */
export async function createRole(roleData) {
  try {
    const { roleName } = roleData;
    
    if (!roleName) {
      return {
        status: 'error',
        message: 'Thiếu roleName',
        data: null
      };
    }

    // API expects query parameters
    const queryParams = new URLSearchParams({ roleName });
    
    const response = await fetch(
      `${API_BASE_URL}/account/v1/createRole?${queryParams}`,
      {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
      }
    );

    const data = await response.json();

    // Normalize response
    if (!response.ok || (data.status && !data.status.includes('OK') && !data.status.includes('success'))) {
      return {
        status: 'error',
        message: data.message || 'Tạo role thất bại',
        data: null
      };
    }

    return {
      status: 'success',
      message: data.message,
      data: data.data
    };
  } catch (error) {
    console.error('Error creating role:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

/**
 * Lấy danh sách tất cả role
 * @returns {Promise<Object>} Response từ API
 */
export async function getAllRoles() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/account/v1/getAllRole`,
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
        message: data.message || 'Lấy danh sách role thất bại',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting all roles:', error);
    return {
      status: 'error',
      message: error.message || 'Lỗi kết nối đến server',
      data: null
    };
  }
}

