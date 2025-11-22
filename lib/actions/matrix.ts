'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy.onrender.com';

// Timeout configuration (20 seconds for matrix - faster than position)
const FETCH_TIMEOUT = 20000;

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Server không phản hồi sau 20 giây');
    }
    throw error;
  }
}

// Get all matrix data
export async function getAllMatrix() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/getAllMatrix`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 30 }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to get matrix data',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Get matrix by department ID
export async function getMatrixByDepartment(departmentID: number) {
  try {
    console.log('🔍 Fetching matrix for department ID:', departmentID);
    console.log('📍 URL:', `${API_BASE_URL}/api/matrix/department/${departmentID}`);

    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/department/${departmentID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 30 }
    });

    console.log('📡 Response status:', response.status);

    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to get matrix data for department',
        data: null,
      };
    }

    // Check if response has the expected structure
    if (data && typeof data === 'object') {
      return data;
    }

    return {
      status: 'success',
      message: 'Matrix data retrieved',
      data: data,
    };
  } catch (error: any) {
    console.error('❌ Matrix fetch error:', error);
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Add single position (row) to matrix - FOR TRAINING DIRECTOR
export async function addMatrixRow(positionId: number) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/addRow_for_training_director`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ positionId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to add row to matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Add multiple positions (rows) to matrix - FOR TRAINING DIRECTOR
export async function addMatrixMultipleRows(positionIds: number[]) {
  try {
    const payload = positionIds.map(id => ({ positionId: id }));

    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/addMultipleRow_for_training_director`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to add rows to matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Add single document (column) to matrix - FOR TRAINING DIRECTOR
export async function addMatrixColumn(documentId: number) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/addColum_for_training_director`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to add column to matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Add multiple documents (columns) to matrix - FOR TRAINING DIRECTOR
export async function addMatrixMultipleColumns(documentIds: number[]) {
  try {
    const payload = documentIds.map(id => ({ documentId: id }));

    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/addMultipleColum_for_training_director`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to add columns to matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Delete position (row) from matrix - FOR TRAINING DIRECTOR
export async function deleteMatrixRow(positionId: number) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/deleteRow_for_training_director/${positionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to delete row from matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Delete document (column) from matrix - FOR TRAINING DIRECTOR
export async function deleteMatrixColumn(documentId: number) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/deleteColumn_for_training_director/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to delete column from matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Delete all rows from matrix - FOR TRAINING DIRECTOR
export async function deleteAllMatrixRows() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/deleteAllRow_for_training_director`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to delete all rows from matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Delete all columns from matrix - FOR TRAINING DIRECTOR
export async function deleteAllMatrixColumns() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/deleteAllColumns_for_training_director`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to delete all columns from matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Clear entire matrix - FOR TRAINING DIRECTOR
export async function clearMatrix() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/clearMatrix_for_training_director`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to clear matrix',
        data: null,
      };
    }

    return data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Set pending status for matrix - FOR TRAINING DIRECTOR
export async function setPendingStatusMatrix(data: any) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/setPendintStatusMatrix_for_training_director`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to set pending status',
        data: null,
      };
    }

    return result;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}

// Click to cell in matrix - FOR HEAD OF DEPARTMENT
export async function clickToCellMatrix(data: any) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/clickToCellMatrix_for_head_of_department`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to update cell',
        data: null,
      };
    }

    return result;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}
