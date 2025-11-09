# CRM Features Documentation

## Overview

The CRM (Customer Relationship Management) page provides a comprehensive interface for managing client relationships with intuitive UI and powerful features.

## Key Features

### 1. **Client Management**
   - ✅ Add new clients with essential information
   - ✅ View client details in a detailed modal
   - ✅ Edit client information inline
   - ✅ Delete clients with confirmation
   - ✅ Track client status (Active, Prospect, Paused)

### 2. **View Modes**
   - **Cards View**: Visual card-based layout showing clients in a grid
   - **Table View**: Detailed table with sorting and search capabilities
   - Toggle between views with a single click

### 3. **Status Tracking**
   - **Active**: Current active clients
   - **Prospect**: Potential clients in pipeline
   - **Paused**: Temporarily inactive clients
   - Visual statistics cards showing counts for each status

### 4. **Client Information Fields**
   - Name (required)
   - Status
   - Industry
   - Contact Person
   - Email
   - Phone
   - Website
   - Address
   - Notes

### 5. **Filtering & Search**
   - Quick filters by status (All, Active, Prospect, Paused)
   - Real-time search across all client fields
   - Filter counts displayed on each filter button

### 6. **Data Export**
   - Export clients to CSV format
   - Export includes all client information
   - Filename includes current date

### 7. **Client Details Modal**
   - View complete client information
   - Edit mode with inline form
   - Save changes with validation
   - See client since date

## Components Created

### Core Components

1. **ClientDetailsModal** (`src/components/ClientDetailsModal.tsx`)
   - Full client information display
   - Inline editing capability
   - Contact information management
   - Notes section

2. **QuickFilters** (`src/components/QuickFilters.tsx`)
   - Reusable filter component
   - Shows count for each filter option
   - Active state highlighting

3. **ExportButton** (`src/components/ExportButton.tsx`)
   - Generic export functionality
   - CSV export with proper escaping
   - JSON export option (future)

4. **ClientActivityTimeline** (`src/components/ClientActivityTimeline.tsx`)
   - Timeline view for client activities
   - Support for notes, projects, invoices, meetings
   - Visual indicators with icons and colors

5. **ClientMetrics** (`src/components/ClientMetrics.tsx`)
   - Display key client metrics
   - Total revenue, active projects, etc.
   - Visual stat cards

## API Endpoints

### `/api/clients`

- **GET** - Fetch all clients
- **POST** - Create new client
  ```json
  {
    "name": "Client Name",
    "status": "active",
    "industry": "SaaS",
    "email": "client@example.com",
    "phone": "555-1234"
  }
  ```
- **PATCH** - Update existing client (requires `?id=client-id`)
  ```json
  {
    "name": "Updated Name",
    "notes": "New notes",
    "website": "https://example.com"
  }
  ```
- **DELETE** - Delete client (requires `?id=client-id`)

## Database Schema

The enhanced clients table includes:

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'prospect',
  industry TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  website TEXT,
  address TEXT,
  contact_person TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
```

## Usage Guide

### Adding a New Client

1. Click the "New Client" button in the top right
2. Fill in the client name (required)
3. Select a status (defaults to Prospect)
4. Add optional information (industry, email, phone)
5. Click "Add Client"

### Viewing Client Details

1. In **Cards View**: Click on the client card or the eye icon
2. In **Table View**: Click the "View" button
3. The details modal will open with complete information

### Editing a Client

1. Open the client details modal
2. Click the edit icon (pencil) in the top right
3. Modify the fields as needed
4. Click "Save Changes" or "Cancel"

### Filtering Clients

1. Use the quick filter buttons above the client list
2. Select "All", "Active", "Prospects", or "Paused"
3. The list updates instantly with counts

### Exporting Data

1. Click the "Export" button in the top right
2. A CSV file will download with all visible clients
3. Filename format: `clients-YYYY-MM-DD.csv`

### Searching

1. In **Table View**, use the search box
2. Search works across all fields
3. Results update in real-time

## UI/UX Highlights

- **Dark theme** with purple accents
- **Hover effects** on interactive elements
- **Smooth transitions** and animations
- **Responsive design** for mobile and desktop
- **Clear visual hierarchy** with cards and stats
- **Intuitive icons** from Lucide React
- **Loading states** for async operations
- **Error handling** with user-friendly messages

## Future Enhancements

Potential additions for the CRM:

- [ ] Activity timeline integration with projects and invoices
- [ ] Client metrics dashboard (revenue, project count)
- [ ] Task/reminder system for follow-ups
- [ ] Email integration for direct communication
- [ ] Document attachment support
- [ ] Client tagging system
- [ ] Advanced filtering (date ranges, custom fields)
- [ ] Bulk operations (bulk edit, bulk delete)
- [ ] Client import from CSV
- [ ] Duplicate detection
- [ ] Client relationship mapping
- [ ] Custom fields per client

## Technical Details

### Dependencies

- `date-fns` - Date formatting and manipulation
- `swr` - Data fetching and caching
- `lucide-react` - Icon library
- `@supabase/supabase-js` - Database client

### State Management

- Local component state with React hooks
- SWR for server state management
- Automatic revalidation on mutations

### Styling

- Tailwind CSS for utility-first styling
- Custom card component styles
- Consistent color palette (zinc/purple)

## Migration Guide

To apply the enhanced CRM schema:

1. Run the migration:
   ```bash
   supabase db query db/migrations/005_enhance_clients_table.sql
   ```

2. Or manually execute in Supabase SQL Editor:
   - Copy contents of `005_enhance_clients_table.sql`
   - Paste into SQL Editor
   - Run query

## Support

For issues or questions about the CRM functionality:
- Check the component files for implementation details
- Review the API routes for backend logic
- Ensure Supabase is properly configured
- Verify environment variables are set

---

**Last Updated**: November 2025
**Version**: 1.0

