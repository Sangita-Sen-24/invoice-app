
#  Full Stack Invoice Management System

A complete invoice management application built with the MERN stack (MongoDB, Express.js, React, Node.js). Create, manage, and track invoices with line items, payments, and automatic balance calculations.

## Features

###  Invoice Management
-  Create invoices with unique invoice numbers
-  Add multiple line items with automatic line total calculation
-  Set issue dates and due dates
-  Status tracking (DRAFT, SENT, PAID, OVERDUE, ARCHIVED)

###  Payment Processing
-  Add payments to invoices
-  Automatic balance due calculation
-  Smart validation - prevents overpayment
-  Payment history tracking

###  Clean UI
-  Modern, responsive design inspired by Dribbble
-  Bootstrap React components
-  Status badges with color coding
-  Clean invoice layout
-  Mobile-friendly tables

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **React Bootstrap** - UI components
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **React Toastify** - Notifications

## 📋 Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
- [Git](https://git-scm.com/)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Sangita-Sen-24/invoice-app.git
cd invoice-app
2. Backend Setup
bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
echo "PORT=5000" > .env

# Start backend server
npm run dev
Backend will run on http://localhost:5000

3. Frontend Setup
bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
Frontend will run on http://localhost:5173

4. MongoDB Setup
Make sure MongoDB is running locally:

bash
# On Windows (if installed as service)
net start MongoDB

# Or run manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
 API Endpoints
Method	Endpoint	Description
GET	/api/invoices/:id	Get complete invoice details with line items and payments
POST	/api/invoices/:id/payments	Add a payment to an invoice
POST	/api/invoices/:id/archive	Archive an invoice
POST	/api/invoices/:id/restore	Restore an archived invoice
POST	/api/invoices/sample/create	Create a sample invoice for testing

 Project Structure
text
invoice-app/
── backend/
│   ├── models/
│   │   ├── Invoice.js
│   │   ├── InvoiceLine.js
│   │   └── Payment.js
│   ├── controllers/
│   │   └── invoiceController.js
│   ├── routes/
│   │   └── invoiceRoutes.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InvoiceHeader.jsx
│   │   │   ├── LineItemsTable.jsx
│   │   │   ├── TotalsSection.jsx
│   │   │   └── PaymentsList.jsx
│   │   ├── pages/
│   │   │   └── InvoiceDetails.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   ├── public/
│   └── package.json
└── README.md
 Usage Guide
Creating a Sample Invoice
Start both backend and frontend servers

Open http://localhost:5173

Click "Create Sample Invoice" button

You'll be redirected to the invoice details page

Adding a Payment
On an invoice page, click "+ Add Payment" button

Enter amount and payment details

Submit - the balance updates automatically

If full amount is paid, status changes to PAID

Archiving an Invoice
Click the "Archive Invoice" button to archive

Click "Restore Invoice" to bring it back

 Testing the Application
Create Sample Invoice - Start with a test invoice

Check Calculations - Verify line totals and invoice total

Add Partial Payment - Try adding $500, check balance

Try Overpayment - Attempt to pay more than balance (should fail)

Pay Full Amount - Add remaining amount, status should become PAID

Archive/Restore - Test archive functionality

 Troubleshooting
Backend won't start
Check if MongoDB is running

Verify port 5000 is not in use

Run npm install again

Frontend can't connect to backend
Verify backend is running on port 5000

Check API URL in src/services/api.js

Look for CORS errors in console

Sample invoice creation fails
Check MongoDB connection

Verify all models are properly defined

Look for validation errors in backend terminal

 Author
Sangita Sen

GitHub: @Sangita-Sen-24

Project Link: https://github.com/Sangita-Sen-24/invoice-app

