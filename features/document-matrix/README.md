# Document Matrix Management

A comprehensive system for managing document requirements across different position levels and departments in the aviation training academy.

## Overview

The Document Matrix Management system allows Training Directors and Department Heads to:
- Define position levels and certificate types by department
- Configure document requirements for each position-certificate combination
- Track compliance and coverage across departments
- Export matrix configurations

## Features

### For Training Directors
- **Department Selection**: Select a department (GO, CC, TAM, FC) to configure its matrix
- **Quick Matrix Editing**: Add positions and certificates directly from the grid using + buttons
- **Full Rule Management**: Create, edit, and delete matrix rules for any department
- **Import/Export**: Bulk operations for matrix configuration
- **Statistics Dashboard**: Overview of matrix coverage across all departments

### For Department Heads
- **Department-Specific View**: Automatically displays matrix for their assigned department
- **Rule Management**: Can add, edit, and delete rules for positions in their department
- **No Structure Changes**: Cannot add/remove positions or certificates (contact Training Director)
- **Export Capability**: Download matrix for reference
- **Coverage Analytics**: View compliance rates and rule statistics

## Departments

The system supports four main departments:

- **GO** - Ground Operations: Ground handling and operations
- **CC** - Cabin Crew: Flight attendant services
- **TAM** - Technical Aircraft Maintenance: Aircraft maintenance and engineering
- **FC** - Flight Crew: Pilots and flight officers

## Document Templates

Standard certificates/documents across all departments:

1. **CCDC**: Civil aviation crew declaration certificate
2. **Criminal record / Aviation security card**: Background check and security clearance
3. **High school / College / University diploma**: Educational qualification certificate
4. **Three 3x4 cm photos (wearing red vest/T-shirt)**: Identification photos in uniform
5. **Aircraft type difference training certificate (A319/A320/A330)**: CF56/V2500/LEAP-1A or equivalent
6. **TOEIC Certificate**: English proficiency certificate
7. **Medical Certificate**: Health examination certificate

## Components

### DocumentMatrixGrid
The main grid component that displays the position-certificate matrix with interactive cells.

**Props:**
- `positions`: Array of Position objects
- `certificateTypes`: Array of CertificateType objects
- `rules`: Array of MatrixRule objects
- `onAddRule`: Callback when adding a new rule
- `onEditRule`: Callback when editing a rule
- `onDeleteRule`: Callback when deleting a rule
- `onAddPosition`: Callback when adding a position (optional)
- `onAddCertificate`: Callback when adding a certificate (optional)
- `readOnly`: Boolean to disable all editing (default: false)
- `canEditStructure`: Boolean to show/hide add position/certificate buttons (default: false)

## Data Types

### Department
```typescript
{
  id: string;
  code: string;          // "GO", "CC", "TAM", "FC"
  name: string;
  description?: string;
}
```

### Position
```typescript
{
  id: string;
  code: string;          // e.g., "L1", "L2"
  name: string;          // e.g., "Ground Staff Level 1"
  level: number;         // 1-5
  departmentId: string;  // Links to department
  description?: string;
}
```

### CertificateType
```typescript
{
  id: string;
  name: string;
  description?: string;
  isRequired?: boolean;  // Global requirement flag
}
```

### MatrixRule
```typescript
{
  id: string;
  positionId: string;
  certificateTypeId: string;
  departmentId: string;
  status: "required" | "optional" | "not_required";
  priority?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}
```

## Usage

### Training Director Access
1. Navigate to `/training-director/matrix`
2. Select a department from the dropdown (GO, CC, TAM, or FC)
3. Add positions using the "+ Add Position" button at the bottom of the grid
4. Add certificates using the "+ Add Certificate" button on the right side of the header
5. Click any cell to add/edit rules
6. Rules are shown with color coding:
   - **Green**: Required
   - **Blue**: Optional
   - **Gray**: Not Required

### Head of Department Access
1. Navigate to `/head/matrix`
2. View automatically displays your assigned department's matrix
3. Click any cell to add/edit rules
4. Cannot add/remove positions or certificates (no + buttons shown)
5. Contact Training Director for structure changes

## Rule Status Types

- **Required**: Trainee must submit this document (shown in green)
- **Optional**: Trainee may submit this document (shown in blue)
- **Not Required**: Document is not needed for this position (shown in gray)

## UI Features

### Matrix Grid
- Sticky column headers and row headers for easy scrolling
- Color-coded cells based on rule status
- Hover effects for better user experience
- Add buttons at the end of rows and columns (Training Director only)
- Empty cells show "+ Add Rule" button

### Department Selector (Training Director)
- Dropdown with department code, name, and position count
- Shows department description below selector
- Only displays matrix after department is selected

### Department Banner (Head of Department)
- Shows current department code and name
- Includes notice about permissions
- Helpful hint to contact Training Director for changes

## Best Practices

1. **Department Organization**: Configure each department's matrix separately
2. **Position Naming**: Use consistent level codes (L1-L4) across departments
3. **Required vs Optional**: Mark certificates as "required" only when truly mandatory
4. **Add Detailed Notes**: Include specific requirements or deadlines in rule notes
5. **Regular Reviews**: Department Heads should regularly review their matrix
6. **Export Backups**: Training Directors should regularly export matrix configurations

## Example Workflow

### Training Director:
1. Selects "Ground Operations (GO)" department
2. Views existing 4 positions (L1-L4)
3. Clicks "+ Add Certificate" to add "Safety Training Certificate"
4. Clicks cells to configure rules for each position
5. Exports matrix for backup

### Head of Department:
1. Opens matrix page (automatically shows Ground Operations)
2. Reviews current rules
3. Clicks cell for "L1 - Criminal record" to add note: "Must complete within 30 days"
4. Updates status from "optional" to "required"
5. Exports matrix for team reference

## Color Scheme

- **Green** (`bg-green-50`, `border-green-300`): Required documents
- **Blue** (`bg-blue-50`, `border-blue-300`): Optional documents
- **Gray** (`bg-gray-50`, `border-gray-300`): Not required documents
- **Primary**: Hover states and accents
