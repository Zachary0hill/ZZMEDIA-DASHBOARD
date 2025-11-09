# Component Guide

A comprehensive guide to all reusable components in the zzmedia-admin application.

## Core Components

### 1. DataTable

**Location**: `src/components/DataTable.tsx`

A powerful, sortable table component with search functionality.

**Features**:
- Real-time search across all fields
- Column sorting (ascending/descending)
- Custom cell formatting
- Custom action buttons
- Item count display

**Usage**:
```tsx
<DataTable
  columns={[
    { key: "name", header: "Name", format: (v) => <strong>{v}</strong> },
    { key: "email", header: "Email" },
    { key: "status", header: "Status", format: (v) => <StatusBadge status={v} /> },
  ]}
  rows={data}
  actionsHeader="Actions"
  renderActions={(row) => (
    <button onClick={() => handleEdit(row)}>Edit</button>
  )}
/>
```

---

### 2. Modal

**Location**: `src/components/Modal.tsx`

A reusable modal dialog component with backdrop and animations.

**Features**:
- Backdrop blur effect
- Smooth fade-in animation
- Body scroll lock when open
- Close on backdrop click
- Customizable title

**Usage**:
```tsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Item">
  <form>
    {/* Your form content */}
  </form>
</Modal>
```

---

### 3. StatusBadge

**Location**: `src/components/StatusBadge.tsx`

Displays status indicators with color-coded badges.

**Features**:
- Predefined color schemes for common statuses
- Customizable styling
- Uppercase text formatting

**Usage**:
```tsx
<StatusBadge status="active" />
<StatusBadge status="pending" />
<StatusBadge status="completed" />
```

---

### 4. KpiCard

**Location**: `src/components/KpiCard.tsx`

Displays key performance indicators in a visually appealing card.

**Features**:
- Icon support
- Trend indicators
- Customizable colors
- Value formatting

**Usage**:
```tsx
<KpiCard
  title="Total Revenue"
  value="$125,000"
  icon={DollarSign}
  trend="+12%"
  color="emerald"
/>
```

---

### 5. Money

**Location**: `src/components/Money.tsx`

Formats currency values consistently across the app.

**Features**:
- Automatic thousand separators
- Currency symbol
- Decimal handling
- Negative value styling

**Usage**:
```tsx
<Money amount={1250.50} />
// Outputs: $1,250.50
```

---

## CRM Components

### 6. ClientDetailsModal

**Location**: `src/components/ClientDetailsModal.tsx`

A comprehensive modal for viewing and editing client information.

**Features**:
- View/edit mode toggle
- Complete client information display
- Inline form editing
- Date formatting
- Contact information links

**Usage**:
```tsx
<ClientDetailsModal
  client={selectedClient}
  isOpen={!!selectedClient}
  onClose={() => setSelectedClient(null)}
  onUpdate={() => mutate()}
/>
```

**Props**:
- `client`: Client object or null
- `isOpen`: Boolean to control visibility
- `onClose`: Function to close modal
- `onUpdate`: Function called after successful update

---

### 7. QuickFilters

**Location**: `src/components/QuickFilters.tsx`

Horizontal filter buttons with count badges.

**Features**:
- Active state highlighting
- Item counts
- Responsive layout
- Scrollable on mobile

**Usage**:
```tsx
<QuickFilters
  filters={[
    { value: "all", label: "All", count: 50 },
    { value: "active", label: "Active", count: 30 },
    { value: "inactive", label: "Inactive", count: 20 },
  ]}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>
```

---

### 8. ClientActivityTimeline

**Location**: `src/components/ClientActivityTimeline.tsx`

Displays a chronological timeline of client activities.

**Features**:
- Color-coded activity types
- Icon indicators
- Date formatting
- Amount display for financial activities

**Usage**:
```tsx
<ClientActivityTimeline
  activities={[
    {
      id: "1",
      type: "project",
      title: "New website project",
      description: "Started development phase",
      date: "2024-01-15",
    },
    {
      id: "2",
      type: "invoice",
      title: "Invoice #001",
      amount: 5000,
      date: "2024-01-20",
    },
  ]}
/>
```

**Activity Types**:
- `note`: General notes (blue)
- `project`: Project-related (purple)
- `invoice`: Financial transactions (green)
- `meeting`: Scheduled meetings (amber)

---

### 9. ClientMetrics

**Location**: `src/components/ClientMetrics.tsx`

Displays key metrics for a client in a grid layout.

**Features**:
- 2x2 grid of metric cards
- Icon indicators
- Color-coded categories
- Formatted values

**Usage**:
```tsx
<ClientMetrics
  metrics={{
    totalRevenue: 125000,
    activeProjects: 3,
    avgProjectValue: 41666,
    clientSince: "Jan 2024",
  }}
/>
```

---

### 10. ExportButton

**Location**: `src/components/ExportButton.tsx`

Export data to CSV or JSON format.

**Features**:
- CSV export with proper escaping
- Custom filename
- Date-stamped files
- Loading state
- Error handling

**Usage**:
```tsx
<ExportButton
  data={clients}
  filename="clients"
  label="Export"
/>
```

**Export Format**:
- CSV: `filename-YYYY-MM-DD.csv`
- Handles commas and quotes in data
- Includes all object properties as columns

---

## Layout Components

### 11. Sidebar

**Location**: `src/components/Sidebar.tsx`

Main navigation sidebar with links to all pages.

**Features**:
- Icon-based navigation
- Active route highlighting
- Collapsible sections
- Smooth transitions

---

### 12. Topbar

**Location**: `src/components/Topbar.tsx`

Top navigation bar with user info and global actions.

**Features**:
- User profile display
- Quick actions
- Notifications
- Search functionality

---

## Design System

### Colors

- **Primary**: Purple (`purple-500`, `purple-400`, `purple-300`)
- **Success**: Emerald (`emerald-500`, `emerald-400`)
- **Warning**: Amber (`amber-500`, `amber-400`)
- **Danger**: Rose (`rose-500`, `rose-400`)
- **Info**: Blue (`blue-500`, `blue-400`)
- **Neutral**: Zinc (`zinc-100` to `zinc-900`)

### Common Classes

**Card**:
```css
.card {
  @apply rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm;
}
```

**Button Primary**:
```css
.btn-primary {
  @apply rounded-lg border border-purple-500/20 bg-purple-500/10 
         px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 
         transition-colors font-medium;
}
```

**Button Secondary**:
```css
.btn-secondary {
  @apply rounded-lg border border-white/10 bg-white/5 
         px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 
         transition-colors font-medium;
}
```

**Input**:
```css
.input {
  @apply w-full rounded-lg border border-white/10 bg-white/5 
         px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 
         outline-none focus:ring-2 focus:ring-purple-500/50 transition-all;
}
```

---

## Best Practices

### Component Creation

1. **Use TypeScript** for type safety
2. **Export types** for component props
3. **Document props** with JSDoc comments
4. **Handle loading states** appropriately
5. **Implement error boundaries** where needed
6. **Make components reusable** with proper props
7. **Use semantic HTML** elements

### Styling

1. **Use Tailwind utilities** first
2. **Create custom classes** for repeated patterns
3. **Maintain consistent spacing** (4px, 8px, 12px, 16px, etc.)
4. **Use the design system colors**
5. **Implement hover states** for interactive elements
6. **Add transition effects** for smooth UX
7. **Consider dark mode** (app is dark by default)

### State Management

1. **Use local state** for UI-only state
2. **Use SWR** for server state
3. **Implement optimistic updates** where appropriate
4. **Handle loading and error states**
5. **Provide user feedback** for actions

### Performance

1. **Memoize expensive computations** with `useMemo`
2. **Prevent unnecessary re-renders** with `memo`
3. **Use proper keys** for lists
4. **Lazy load** components when appropriate
5. **Optimize images** and assets

---

## Component Checklist

When creating a new component:

- [ ] TypeScript types defined
- [ ] Props interface documented
- [ ] Responsive design implemented
- [ ] Accessibility features added
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Hover states styled
- [ ] Focus states visible
- [ ] Component exported properly
- [ ] Usage example in this guide

---

## Testing Components

### Manual Testing

1. Test all interactive states (hover, focus, active)
2. Verify responsive behavior at different breakpoints
3. Check accessibility with keyboard navigation
4. Test with different data scenarios (empty, full, error)
5. Verify animations and transitions are smooth

### Props to Test

- **Required props**: Component should error clearly if missing
- **Optional props**: Should have sensible defaults
- **Callback props**: Should be called at appropriate times
- **Data props**: Should handle empty, partial, and full data

---

**Last Updated**: November 2025

