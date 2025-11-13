# Invoice Generator for Coaching Centers

A complete invoice management system for coaching centers with student billing, payment tracking, and reporting features.

## Features

- Create and manage invoices
- Student and parent information tracking
- Line item billing with tax calculations
- Payment status tracking
- Search and filter functionality
- CSV export
- Print-ready invoices
- Auto-save drafts

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose

## Quick Start

### Prerequisites

- Node.js 16+
- MongoDB 4.4+

### Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the application

### Backend Setup

1. Navigate to the backend directory
2. Install dependencies: `npm install`
3. Create a `.env` file with your MongoDB connection string
4. Start the server: `npm start` or `npm run dev` for development

### Frontend Setup

1. Open `index.html` in a web browser
2. The application will connect to the backend API at `http://localhost:5000`

## API Endpoints

- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get a single invoice
- `POST /api/invoices` - Create a new invoice
- `PUT /api/invoices/:id` - Update an invoice
- `DELETE /api/invoices/:id` - Delete an invoice
- `PATCH /api/invoices/:id/mark-paid` - Mark an invoice as paid

## Project Structure

- `backend/` - Node.js API server
- `frontend/` - Web application

## License

MIT License
