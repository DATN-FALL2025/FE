import ExcelJS from 'exceljs';

interface Department {
  departmentName: string;
}

interface Position {
  positionName: string;
  department?: {
    departmentName: string;
  };
}

export async function createAccountImportTemplate(
  departments: Department[],
  positions: Position[]
) {
  const workbook = new ExcelJS.Workbook();
  
  // Group positions by department first
  const positionsByDept: { [key: string]: string[] } = {};
  positions.forEach(pos => {
    const deptName = pos.department?.departmentName || '';
    if (deptName) {
      if (!positionsByDept[deptName]) {
        positionsByDept[deptName] = [];
      }
      positionsByDept[deptName].push(pos.positionName);
    }
  });
  
  // Sheet 1: Accounts
  const accountsSheet = workbook.addWorksheet('Accounts');
  accountsSheet.columns = [
    { header: 'userName', key: 'userName', width: 20 },
    { header: 'password', key: 'password', width: 20 },
    { header: 'gmail', key: 'gmail', width: 30 },
    { header: 'departmentName', key: 'departmentName', width: 30 },
    { header: 'positionName', key: 'positionName', width: 30 }
  ];
  
  // Add sample rows
  accountsSheet.addRow({
    userName: 'user001',
    password: 'password123',
    gmail: 'user001@example.com',
    departmentName: '',
    positionName: ''
  });
  accountsSheet.addRow({
    userName: 'user002',
    password: 'password456',
    gmail: 'user002@example.com',
    departmentName: '',
    positionName: ''
  });
  
  // Sheet 2: Departments
  const departmentsSheet = workbook.addWorksheet('Departments');
  departmentsSheet.columns = [
    { header: 'departmentName', key: 'departmentName', width: 35 }
  ];
  
  const departmentsList = departments.map(dept => dept.departmentName);
  departmentsList.forEach(deptName => {
    departmentsSheet.addRow({ departmentName: deptName });
  });
  
  // Sheet 3: Positions (with department reference)
  const positionsSheet = workbook.addWorksheet('Positions');
  positionsSheet.columns = [
    { header: 'departmentName', key: 'departmentName', width: 35 },
    { header: 'positionName', key: 'positionName', width: 35 }
  ];
  
  positions.forEach(pos => {
    positionsSheet.addRow({
      departmentName: pos.department?.departmentName || '',
      positionName: pos.positionName
    });
  });
  
  // Create hidden lookup sheet with positions in columns by department
  const lookupSheet = workbook.addWorksheet('_Lookup');
  lookupSheet.state = 'hidden';
  
  // Create a row with department names and columns with their positions
  let colIndex = 1;
  departmentsList.forEach(deptName => {
    const deptPositions = positionsByDept[deptName] || [];
    if (deptPositions.length > 0) {
      const colLetter = getColumnLetter(colIndex);
      
      // Row 1: Department name
      lookupSheet.getCell(`${colLetter}1`).value = deptName;
      
      // Rows 2+: Positions for this department
      deptPositions.forEach((posName, idx) => {
        lookupSheet.getCell(`${colLetter}${idx + 2}`).value = posName;
      });
      
      // Define a named range for this department
      const safeName = deptName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 255);
      const endRow = deptPositions.length + 1;
      
      workbook.definedNames.add(
        `_Lookup!$${colLetter}$2:$${colLetter}$${endRow}`,
        safeName
      );
      
      colIndex++;
    }
  });
  
  // Add data validation for departmentName (column D)
  for (let row = 2; row <= 100; row++) {
    accountsSheet.getCell(`D${row}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['Departments!$A$2:$A$' + (departmentsList.length + 1)],
      showErrorMessage: true,
      errorStyle: 'error',
      errorTitle: 'Lỗi',
      error: 'Vui lòng chọn phòng ban từ danh sách'
    };
  }
  
  // Add dependent data validation for positionName (column E)
  // This uses INDIRECT to reference the column in _Lookup sheet based on department
  for (let row = 2; row <= 100; row++) {
    const deptCell = `D${row}`;
    
    // Try using INDIRECT with MATCH to find the right column
    // Formula: OFFSET(_Lookup!$A$1, 1, MATCH(D2, _Lookup!$1:$1, 0)-1, COUNTA(OFFSET(_Lookup!$A$1, 1, MATCH(D2, _Lookup!$1:$1, 0)-1, 100, 1)), 1)
    const formula = `OFFSET(_Lookup!$A$1,1,MATCH(${deptCell},_Lookup!$1:$1,0)-1,COUNTA(OFFSET(_Lookup!$A$1,1,MATCH(${deptCell},_Lookup!$1:$1,0)-1,100,1)),1)`;
    
    accountsSheet.getCell(`E${row}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [formula],
      showErrorMessage: true,
      errorStyle: 'warning',
      errorTitle: 'Lưu ý',
      error: 'Vui lòng chọn phòng ban trước, sau đó chọn vị trí'
    };
  }
  
  // Style headers
  [accountsSheet, departmentsSheet, positionsSheet, lookupSheet].forEach(sheet => {
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  });
  
  // Add instructions
  accountsSheet.getCell('D1').note = {
    texts: [{
      font: { size: 10, name: 'Arial' },
      text: 'Bước 1: Chọn phòng ban từ dropdown'
    }]
  };
  
  accountsSheet.getCell('E1').note = {
    texts: [{
      font: { size: 10, name: 'Arial' },
      text: 'Bước 2: Chọn vị trí (chỉ hiển thị vị trí của phòng ban đã chọn)'
    }]
  };
  
  return workbook;
}

// Helper function to convert column index to Excel column letter
function getColumnLetter(columnIndex: number): string {
  let letter = '';
  while (columnIndex > 0) {
    const remainder = (columnIndex - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    columnIndex = Math.floor((columnIndex - 1) / 26);
  }
  return letter;
}
