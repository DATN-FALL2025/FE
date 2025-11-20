'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy.onrender.com';

// Get all matrix data
export async function getAllMatrix() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matrix/getAllMatrix`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
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

    const response = await fetch(`${API_BASE_URL}/api/matrix/department/${departmentID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
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

// Add single position (row) to matrix
export async function addMatrixRow(positionId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matrix/addRow`, {
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

// Add multiple positions (rows) to matrix
export async function addMatrixMultipleRows(positionIds: number[]) {
  try {
    const payload = positionIds.map(id => ({ positionId: id }));

    const response = await fetch(`${API_BASE_URL}/api/matrix/addMultipleRow`, {
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

// Add single document (column) to matrix
export async function addMatrixColumn(documentId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matrix/addColum`, {
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

// Add multiple documents (columns) to matrix
export async function addMatrixMultipleColumns(documentIds: number[]) {
  try {
    const payload = documentIds.map(id => ({ documentId: id }));

    const response = await fetch(`${API_BASE_URL}/api/matrix/addMultipleColum`, {
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

// Delete position (row) from matrix
export async function deleteMatrixRow(positionId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matrix/deleteRow/${positionId}`, {
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

// Delete document (column) from matrix
export async function deleteMatrixColumn(documentId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matrix/deleteColumn/${documentId}`, {
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

// Delete all columns from matrix
export async function deleteAllMatrixColumns() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matrix/deleteAllColumns`, {
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

// Clear entire matrix
export async function clearMatrix() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matrix/clearMatrix`, {
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
