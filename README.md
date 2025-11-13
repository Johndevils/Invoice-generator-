## Invoice Generator

```markdown
# Invoice Generator Web App for Coaching Center

A complete invoice generator web application for coaching centers with frontend built using HTML5, Tailwind CSS, and Vanilla JavaScript, and backend using Node.js serverless functions on Vercel with MongoDB Atlas as the database.

## Features

- Create, update, delete invoices
- Auto-generate invoice numbers
- Live preview of invoices
- Invoice history with search and filter
- Mark invoices as paid
- Export invoices to CSV
- Print invoices
- Auto-save drafts to localStorage
- Toast notifications for user feedback

## Prerequisites

- Node.js (for local development)
- MongoDB Atlas account
- Vercel account (for deployment)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/invoice-generator.git
   cd invoice-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Setup MongoDB Atlas

1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a new project and cluster

3. Create a database user with a password

4. Whitelist your IP address (use 0.0.0.0/0 for Vercel access)

5. Get your connection string from the "Connect" section

6. The connection string should look like:
   ```
   mongodb+srv://<username>:<password>@cluster-name.mongodb.net/?retryWrites=true&w=majority
   ```

## Deploy Backend to Vercel

1. Create a new project on [Vercel](https://vercel.com)

2. Connect your GitHub repository

3. Configure environment variables:
   - Go to Settings > Environment Variables
   - Add a new variable:
     - Name: `MONGODB_URI`
     - Value: Your MongoDB Atlas connection string

4. Deploy the project

5. Note your Vercel app URL (e.g., `https://your-app.vercel.app`)

## Configure Frontend

1. Update the API base URL in `app.js`:
   ```javascript
   // Replace with your Vercel app URL
   const API_BASE_URL = 'https://your-app.vercel.app/api';
   ```

2. Update the fetch calls to use the API base URL:
   ```javascript
   // Example for loading invoices
   const response = await fetch(`${API_BASE_URL}/invoices`);
   ```

## Run Frontend Locally

1. Open `index.html` in your browser or use a local server:
   ```
   npx serve .
   ```

2. Access the app at `http://localhost:3000`

## Project Structure

```
invoice-generator/
├── index.html                 # Main HTML file
├── app.js                     # Frontend JavaScript
├── api/
│   ├── _db.js                 # Database connection helper
│   ├── invoices/
│   │   ├── index.js           # GET all invoices, POST create invoice
│   │   └── [id].js            # GET, PUT, DELETE specific invoice
│   └── export.js              # Export invoices to CSV
└── README.md                  # This file
```

## API Endpoints

- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/[id]` - Get a specific invoice
- `PUT /api/invoices/[id]` - Update a specific invoice
- `DELETE /api/invoices/[id]` - Delete a specific invoice
- `GET /api/export` - Export all invoices to CSV

## Database Schema

```javascript
{
  studentName: String,
  studentId: String,
  parentName: String,
  parentPhone: String,
  batch: String,
  invoiceNumber: String,
  issueDate: Date,
  dueDate: Date,
  lineItems: [{
    description: String,
    quantity: Number,
    price: Number,
    tax: Number
  }],
  subtotal: Number,
  taxTotal: Number,
  totalAmount: Number,
  paid: Boolean,
  paymentDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
```

This completes the Invoice Generator Web App for a coaching center. The app includes all the requested features:

1. Frontend with HTML5, Tailwind CSS, and Vanilla JavaScript
2. Backend with Vercel Serverless Functions
3. MongoDB Atlas database with Mongoose
4. CRUD operations for invoices
5. Live preview panel
6. Invoice history with search and filter
7. Export to CSV functionality
8. Print support
9. Auto-save drafts to localStorage
10. Toast notifications

The project is structured as requested, with separate files for each component and a comprehensive README with setup instructions.
