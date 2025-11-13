# API Documentation

## Base URL
`http://localhost:5000/api`

## Endpoints

### Invoices

#### GET /invoices
Get all invoices with optional filtering.

Query Parameters:
- `search` (string): Search by student name or invoice number
- `paid` (boolean): Filter by payment status

#### GET /invoices/:id
Get a single invoice by ID.

#### POST /invoices
Create a new invoice.

#### PUT /invoices/:id
Update an existing invoice.

#### DELETE /invoices/:id
Delete an invoice.

#### PATCH /invoices/:id/mark-paid
Mark an invoice as paid.

## Request/Response Formats

See examples in the main README.md file.
