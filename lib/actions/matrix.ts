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
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/getAllMatrix?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store'
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
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/matrix/department/${departmentID}`, {
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

// Create document rule value
export async function createDocumentRuleValue(data: {
  matrixID: number;
  documentRuleValueDTOList: Array<{
    document_rule_Id: number;
    document_rule_value: string;
  }>;
}) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/document_rule_value/create_document_rule_value`, {
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
        message: result.message || 'Failed to create document rule value',
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

// Get document with rules by ID
export async function getDocumentWithRules(documentId: number) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/admin/documents/${documentId}/with-rules`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to get document with rules',
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

// Update document rule value
export async function updateDocumentRuleValue(data: {
  matrixID: number;
  documentRuleValueDTOList: Array<{
    document_rule_Id: number;
    document_rule_value: string;
  }>;
}) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/document_rule_value/update_document_rule_value`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to update document rule value',
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

/**
 * Set status (Approve/Reject) for department matrix
 * Only succeeds if department matrix setup progress is 100%
 */
export async function setMatrixStatusByDepartment(
  departmentId: number,
  status: 'Approve' | 'Rejected'
) {
  try {
    const formData = new FormData();
    formData.append('statusEnum', status);

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/matrix/set-status/department/${departmentId}`,
      {
        method: 'PUT',
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to set matrix status',
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

/**
 * Activate all matrices
 * Sets StatusEnum of all InputDocumentMatrix to Active
 */
export async function setActiveAllMatrix() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/matrix/set-active-all`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to activate all matrices',
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

/**
 * Set complete status to active
 * Sets matrix status from Complete to Active
 */
export async function setCompleteStatusToActive() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/matrix/setCompletestatusToActive`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to set complete status to active',
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

/**
 * Set matrix status to DRAFTED for a department - FOR HEAD OF DEPARTMENT
 * PUT /api/matrix/set-drafted/{departmentID}_for_head_department
 */
export async function setMatrixDraftedByDepartment(departmentId: number) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/matrix/set-drafted/${departmentId}_for_head_department`,
      {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to set matrix to DRAFTED status',
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

/**
 * Set PENDING status and deadline for matrices - FOR TRAINING DIRECTOR
 * POST /api/matrix/setPendintStatusMatrix_for_training_director
 */
export async function setPendingStatusMatrixForTrainingDirector(payload: {
  startDate_deadLine: string; // ISO 8601 format: "2026-01-01T11:39:09.555Z"
  endDate_deadLine: string;   // ISO 8601 format: "2026-12-31T11:39:09.555Z"
}) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/matrix/setPendintStatusMatrix_for_training_director`,
      {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to set PENDING status',
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

/**
 * Approve or Reject matrix for a department - FOR TRAINING DIRECTOR
 * PUT /api/matrix/set-status/department/{departmentId}_for_training_director_approve_or_reject
 */
export async function setMatrixStatusForTrainingDirector(
  departmentId: number,
  statusEnum: 'Approve' | 'Reject',
  rejectReason?: string
) {
  try {
    const formData = new FormData();
    // Always append rejectReason, use single space " " for Approve
    formData.append('rejectReason', rejectReason || ' ');

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/matrix/set-status/department/${departmentId}_for_training_director_approve_or_reject?statusEnum=${statusEnum}`,
      {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || `Failed to ${statusEnum.toLowerCase()} matrix`,
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

/**
 * Get Matrix Dashboard Statistics - FOR TRAINING DIRECTOR
 * GET /api/matrix/input_matrix_document_dashboard
 */
export async function getMatrixDashboard() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/matrix/input_matrix_document_dashboard`,
      {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Failed to get matrix dashboard',
        data: null,
      };
    }

    return {
      status: 'success',
      message: 'Matrix dashboard retrieved successfully',
      data: result,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message || 'Error connecting to server',
      data: null,
    };
  }
}
