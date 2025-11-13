<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Generator - Coaching Center</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @media print {
            body * {
                visibility: hidden;
            }
            #print-area, #print-area * {
                visibility: visible;
            }
            #print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .no-print {
                display: none !important;
            }
        }
        
        .toast {
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .line-item {
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-md">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold flex items-center">
                    <i class="fas fa-file-invoice mr-2"></i>
                    Invoice Generator
                </h1>
                <div class="flex space-x-2">
                    <button id="exportBtn" class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors">
                        <i class="fas fa-download mr-2"></i>Export CSV
                    </button>
                    <button id="clearFormBtn" class="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded transition-colors">
                        <i class="fas fa-eraser mr-2"></i>Clear Form
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Invoice Form -->
            <div class="bg-white rounded-lg shadow-md p-6 no-print">
                <h2 class="text-xl font-semibold mb-4 text-gray-800">
                    <i class="fas fa-edit mr-2"></i>Create Invoice
                </h2>
                
                <form id="invoiceForm">
                    <input type="hidden" id="invoiceId">
                    
                    <!-- Student Information -->
                    <div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="studentName" class="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                            <input type="text" id="studentName" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label for="studentId" class="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                            <input type="text" id="studentId" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="parentName" class="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                            <input type="text" id="parentName" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label for="parentPhone" class="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                            <input type="tel" id="parentPhone" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label for="batch" class="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                            <input type="text" id="batch" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label for="invoiceNumber" class="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                            <input type="text" id="invoiceNumber" readonly class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                        </div>
                        <div>
                            <label for="issueDate" class="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                            <input type="date" id="issueDate" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input type="date" id="dueDate" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <!-- Line Items -->
                    <div class="mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <label class="block text-sm font-medium text-gray-700">Line Items</label>
                            <button type="button" id="addLineItem" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                <i class="fas fa-plus mr-1"></i>Add Item
                            </button>
                        </div>
                        <div id="lineItems" class="space-y-2">
                            <!-- Line items will be added here dynamically -->
                        </div>
                    </div>
                    
                    <!-- Totals -->
                    <div class="mb-4 bg-gray-50 p-4 rounded-md">
                        <div class="flex justify-between mb-2">
                            <span class="font-medium">Subtotal:</span>
                            <span id="subtotal">$0.00</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="font-medium">Tax:</span>
                            <span id="taxTotal">$0.00</span>
                        </div>
                        <div class="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span id="totalAmount">$0.00</span>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex flex-wrap gap-2">
                        <button type="submit" id="saveBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                            <i class="fas fa-save mr-2"></i>Save Invoice
                        </button>
                        <button type="button" id="updateBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors hidden">
                            <i class="fas fa-sync-alt mr-2"></i>Update Invoice
                        </button>
                        <button type="button" id="deleteBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors hidden">
                            <i class="fas fa-trash mr-2"></i>Delete Invoice
                        </button>
                        <button type="button" id="markPaidBtn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors hidden">
                            <i class="fas fa-check-circle mr-2"></i>Mark as Paid
                        </button>
                        <button type="button" id="printBtn" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
                            <i class="fas fa-print mr-2"></i>Print Invoice
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- Live Preview -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800">
                    <i class="fas fa-eye mr-2"></i>Invoice Preview
                </h2>
                <div id="print-area" class="border border-gray-200 p-4 rounded">
                    <div class="text-center mb-4">
                        <h1 class="text-2xl font-bold">COACHING CENTER</h1>
                        <p class="text-gray-600">123 Education Street, City, State 12345</p>
                        <p class="text-gray-600">Phone: (123) 456-7890 | Email: info@coachingcenter.com</p>
                    </div>
                    
                    <div class="mb-4 flex justify-between">
                        <div>
                            <h3 class="font-semibold">Bill To:</h3>
                            <p id="previewStudentName" class="font-medium">Student Name</p>
                            <p id="previewStudentId">Student ID: </p>
                            <p id="previewParentName">Parent: </p>
                            <p id="previewParentPhone">Phone: </p>
                            <p id="previewBatch">Batch: </p>
                        </div>
                        <div class="text-right">
                            <p><strong>Invoice #:</strong> <span id="previewInvoiceNumber">INV-00000</span></p>
                            <p><strong>Issue Date:</strong> <span id="previewIssueDate">--</span></p>
                            <p><strong>Due Date:</strong> <span id="previewDueDate">--</span></p>
                            <p><strong>Status:</strong> <span id="previewStatus" class="font-semibold text-red-600">Unpaid</span></p>
                        </div>
                    </div>
                    
                    <table class="w-full mb-4">
                        <thead>
                            <tr class="border-b">
                                <th class="text-left py-2">Description</th>
                                <th class="text-center py-2">Qty</th>
                                <th class="text-right py-2">Price</th>
                                <th class="text-right py-2">Tax %</th>
                                <th class="text-right py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody id="previewLineItems">
                            <tr>
                                <td colspan="5" class="text-center py-4 text-gray-500">No items added</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="flex justify-end">
                        <div class="w-1/2">
                            <div class="flex justify-between mb-1">
                                <span>Subtotal:</span>
                                <span id="previewSubtotal">$0.00</span>
                            </div>
                            <div class="flex justify-between mb-1">
                                <span>Tax:</span>
                                <span id="previewTaxTotal">$0.00</span>
                            </div>
                            <div class="flex justify-between font-bold text-lg border-t pt-1">
                                <span>Total:</span>
                                <span id="previewTotalAmount">$0.00</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 text-center text-sm text-gray-600">
                        <p>Thank you for your business!</p>
                        <p>Payment is due within 15 days.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Invoice History -->
        <div class="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">
                <i class="fas fa-history mr-2"></i>Invoice History
            </h2>
            
            <div class="mb-4 flex flex-wrap gap-2">
                <div class="flex-1 min-w-[200px]">
                    <input type="text" id="searchInput" placeholder="Search by student name or invoice number" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <select id="filterStatus" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Invoices</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                </select>
                <button id="refreshBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
                    <i class="fas fa-sync-alt mr-2"></i>Refresh
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b bg-gray-50">
                            <th class="text-left py-2 px-2">Invoice #</th>
                            <th class="text-left py-2 px-2">Student Name</th>
                            <th class="text-left py-2 px-2">Student ID</th>
                            <th class="text-left py-2 px-2">Issue Date</th>
                            <th class="text-left py-2 px-2">Due Date</th>
                            <th class="text-right py-2 px-2">Amount</th>
                            <th class="text-center py-2 px-2">Status</th>
                            <th class="text-center py-2 px-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="invoiceHistory">
                        <tr>
                            <td colspan="8" class="text-center py-4 text-gray-500">Loading invoices...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
    
    <!-- Toast Container -->
    <div id="toastContainer" class="fixed top-4 right-4 z-50 space-y-2"></div>
    
    <script src="app.js"></script>
</body>
</html>
