-- Add additional fields to clients table for enhanced CRM functionality
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS contact_person TEXT;

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

