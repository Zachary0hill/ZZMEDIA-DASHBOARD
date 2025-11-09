# Database Migrations

This directory contains SQL migration files for setting up the zzmedia-admin database.

## Migration Files

1. **001_create_expenses.sql** - Creates the expenses table
2. **002_create_proposals.sql** - Creates the proposals table
3. **003_create_retainers.sql** - Creates the retainers table
4. **004_create_rate_cards.sql** - Creates the rate_cards table
5. **005_enhance_clients_table.sql** - Adds enhanced CRM fields to clients table

## Running Migrations

The migrations should be run in order. They can be applied manually via the Supabase dashboard or using the Supabase CLI:

```bash
# Using Supabase CLI
supabase db reset  # Reset database and apply all migrations

# Or run individual migrations
psql -h your-db-host -U postgres -d your-db-name -f migrations/001_create_expenses.sql
```

## Schema Overview

- **expenses**: Tracks business expenses
- **proposals**: Manages project proposals and quotes
- **retainers**: Handles recurring retainer agreements
- **rate_cards**: Stores pricing information for services
- **clients**: Stores client information with enhanced CRM fields (notes, website, address, contact_person)

## CRM Enhancement (Migration 005)

The enhanced clients table now includes:
- `notes` - Text field for storing notes about the client
- `website` - Client's website URL
- `address` - Physical address of the client
- `contact_person` - Primary contact person name

Indexes have been added for better performance:
- Index on `status` for faster filtering by client status
- Index on `email` for faster email lookups
