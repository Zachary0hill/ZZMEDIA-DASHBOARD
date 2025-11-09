# CRM Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              /crm/page.tsx (Main Page)                 │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Header     │  │   Filters    │  │   Actions   │ │ │
│  │  │  - Title     │  │ - Quick      │  │ - New Client│ │ │
│  │  │  - Subtitle  │  │   Filters    │  │ - Export    │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           Statistics Cards                       │ │ │
│  │  │  ┌────────┐  ┌────────┐  ┌────────┐           │ │ │
│  │  │  │ Active │  │Prospect│  │ Paused │           │ │ │
│  │  │  └────────┘  └────────┘  └────────┘           │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │          View Toggle (Cards / Table)             │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │                 Cards View                       │ │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │ │ │
│  │  │  │ Client  │  │ Client  │  │ Client  │        │ │ │
│  │  │  │  Card   │  │  Card   │  │  Card   │   ...  │ │ │
│  │  │  └─────────┘  └─────────┘  └─────────┘        │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │            OR                                          │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │                Table View                        │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │         DataTable Component               │ │ │ │
│  │  │  │  - Sortable columns                       │ │ │ │
│  │  │  │  - Search bar                             │ │ │ │
│  │  │  │  - Action buttons                         │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │              Modals (Conditional)                │ │ │
│  │  │  - Create Client Modal                           │ │ │
│  │  │  - Client Details Modal (View/Edit)              │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls (fetch)
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Next.js API Layer                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           /api/clients/route.ts                        │ │
│  │                                                        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐ │ │
│  │  │   GET    │  │   POST   │  │  PATCH   │  │DELETE│ │ │
│  │  │  Fetch   │  │  Create  │  │  Update  │  │Remove│ │ │
│  │  │  All     │  │  New     │  │ Existing │  │Client│ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Supabase Client
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Database                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   clients table                        │ │
│  │                                                        │ │
│  │  Columns:                                              │ │
│  │  - id (uuid)                                           │ │
│  │  - name (text) *required                               │ │
│  │  - status (text)                                       │ │
│  │  - industry (text)                                     │ │
│  │  - email (text)                                        │ │
│  │  - phone (text)                                        │ │
│  │  - notes (text)                                        │ │
│  │  - website (text)                                      │ │
│  │  - address (text)                                      │ │
│  │  - contact_person (text)                               │ │
│  │  - created_at (timestamp)                              │ │
│  │                                                        │ │
│  │  Indexes:                                              │ │
│  │  - idx_clients_status (status)                         │ │
│  │  - idx_clients_email (email)                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
CRMPage
├── Header
│   ├── Title & Description
│   └── Actions
│       ├── ExportButton
│       ├── View Toggle (Cards/Table)
│       └── New Client Button
│
├── CreateClientModal (Modal)
│   └── Form
│       ├── Name Input
│       ├── Status Select
│       ├── Industry Input
│       ├── Email Input
│       ├── Phone Input
│       └── Action Buttons
│
├── ClientDetailsModal (Modal)
│   └── Details Form
│       ├── Header (with Edit button)
│       ├── Status Badge
│       ├── Contact Information
│       │   ├── Industry
│       │   ├── Contact Person
│       │   ├── Email (clickable)
│       │   ├── Phone (clickable)
│       │   ├── Website (link)
│       │   └── Address
│       ├── Notes Section
│       └── Action Buttons (when editing)
│
├── Statistics Cards
│   ├── Active Count Card
│   ├── Prospect Count Card
│   └── Paused Count Card
│
├── QuickFilters
│   ├── All Filter Button
│   ├── Active Filter Button
│   ├── Prospect Filter Button
│   └── Paused Filter Button
│
├── Conditional: Cards View
│   └── Client Cards Grid
│       └── Client Card (for each client)
│           ├── Icon
│           ├── Name & Industry
│           ├── Contact Info
│           ├── Status Badge
│           └── Actions (hover)
│               ├── View Button
│               └── Delete Button
│
└── Conditional: Table View
    └── DataTable
        ├── Search Bar
        ├── Item Count
        └── Table
            ├── Header Row (sortable)
            └── Data Rows
                └── Action Buttons
                    ├── View Button
                    └── Delete Button
```

## Data Flow

### 1. Loading Clients

```
User navigates to /crm
        ↓
Page component mounts
        ↓
SWR hook triggers GET /api/clients
        ↓
API fetches from Supabase
        ↓
Data cached by SWR
        ↓
Component renders with data
```

### 2. Creating a Client

```
User clicks "New Client"
        ↓
Modal opens with form
        ↓
User fills form & submits
        ↓
POST /api/clients with data
        ↓
API validates & inserts to Supabase
        ↓
Success response returned
        ↓
SWR cache mutated (revalidate)
        ↓
UI updates with new client
        ↓
Modal closes
```

### 3. Viewing/Editing a Client

```
User clicks on client card/row
        ↓
ClientDetailsModal opens (view mode)
        ↓
User clicks edit icon
        ↓
Form enters edit mode
        ↓
User modifies fields
        ↓
User clicks "Save Changes"
        ↓
PATCH /api/clients?id=xxx with data
        ↓
API validates & updates Supabase
        ↓
Success response returned
        ↓
SWR cache mutated (revalidate)
        ↓
Modal exits edit mode
        ↓
UI updates with new data
```

### 4. Deleting a Client

```
User clicks delete button
        ↓
Confirmation dialog appears
        ↓
User confirms
        ↓
DELETE /api/clients?id=xxx
        ↓
API removes from Supabase
        ↓
Success response returned
        ↓
SWR cache mutated (revalidate)
        ↓
Client removed from UI
```

### 5. Filtering Clients

```
User clicks filter button
        ↓
Active filter state updates
        ↓
useMemo recalculates filtered array
        ↓
Component re-renders with filtered data
        ↓
Filter counts update
```

### 6. Exporting Data

```
User clicks "Export" button
        ↓
ExportButton component processes data
        ↓
Creates CSV with proper formatting
        ↓
Creates Blob from CSV string
        ↓
Triggers browser download
        ↓
File saved locally
```

## State Management

### Local Component State
```typescript
// View preferences
const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
const [activeFilter, setActiveFilter] = useState("all");
const [showModal, setShowModal] = useState(false);
const [selectedClient, setSelectedClient] = useState<Client | null>(null);

// Form data
const [formData, setFormData] = useState({
  name: "",
  status: "prospect",
  industry: "",
  email: "",
  phone: "",
});
```

### Server State (SWR)
```typescript
const { data, mutate } = useSWR("/api/clients", fetcher, {
  keepPreviousData: true
});
```

### Derived State
```typescript
// Computed from server data and filters
const filteredClients = clients.filter((c) => {
  if (activeFilter === "all") return true;
  return c.status === activeFilter;
});

const statusGroups = {
  active: clients.filter((c) => c.status === "active"),
  prospect: clients.filter((c) => c.status === "prospect"),
  paused: clients.filter((c) => c.status === "paused"),
};
```

## Performance Optimizations

### 1. SWR Caching
- Automatic caching of API responses
- Revalidation on focus
- Optimistic updates

### 2. Database Indexes
```sql
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
```

### 3. Memoization
```typescript
const filteredClients = useMemo(() => {
  return clients.filter(/* ... */);
}, [clients, activeFilter]);
```

### 4. Conditional Rendering
- Only one view mode rendered at a time
- Modals only rendered when open
- Lazy loading of heavy components

### 5. Efficient Updates
- Only update changed fields in PATCH
- No unnecessary re-renders
- Proper key usage in lists

## Security Measures

### 1. Input Validation
- Server-side validation in API routes
- Required field enforcement
- Type checking with TypeScript

### 2. SQL Injection Prevention
- Using Supabase client (parameterized queries)
- No raw SQL from user input

### 3. Authentication
- Can be extended with Supabase Auth
- Row Level Security (RLS) ready

### 4. Data Sanitization
- Trim strings on server
- Null handling for optional fields
- Escape special characters in exports

## Scalability Considerations

### Current Scale
- ✅ Handles hundreds of clients smoothly
- ✅ Fast searches and filters
- ✅ Efficient database queries

### Future Scale (1000+ clients)
- Add pagination to DataTable
- Implement virtual scrolling for cards
- Add backend search endpoint
- Consider Redis caching
- Implement debounced search
- Add load more / infinite scroll

## Error Handling

### Client-Side
```typescript
try {
  // API call
} catch (err: any) {
  alert(`Failed: ${String(err?.message ?? err)}`);
}
```

### Server-Side
```typescript
try {
  // Database operation
} catch (e: any) {
  return NextResponse.json(
    { error: String(e?.message ?? e) },
    { status: 400 }
  );
}
```

### Fallbacks
- Empty state when no clients
- Graceful degradation if Supabase unavailable
- User-friendly error messages

## Testing Strategy

### Unit Tests
- Test individual components
- Test utility functions
- Test data transformations

### Integration Tests
- Test API endpoints
- Test database operations
- Test component interactions

### E2E Tests
- Test complete user flows
- Test CRUD operations
- Test edge cases

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Dependencies installed
- [ ] Build passes without errors
- [ ] No console errors in production
- [ ] All features tested
- [ ] Performance acceptable
- [ ] Security review completed

---

**Architecture Version**: 1.0
**Last Updated**: November 2025

