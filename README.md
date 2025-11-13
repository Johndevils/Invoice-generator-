

# Invoice Generator Web App for Coaching Center

Here's the complete project structure for your Invoice Generator Web App:

## index.html

```html
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
```

## app.js

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const invoiceForm = document.getElementById('invoiceForm');
    const invoiceIdInput = document.getElementById('invoiceId');
    const studentNameInput = document.getElementById('studentName');
    const studentIdInput = document.getElementById('studentId');
    const parentNameInput = document.getElementById('parentName');
    const parentPhoneInput = document.getElementById('parentPhone');
    const batchInput = document.getElementById('batch');
    const invoiceNumberInput = document.getElementById('invoiceNumber');
    const issueDateInput = document.getElementById('issueDate');
    const dueDateInput = document.getElementById('dueDate');
    const lineItemsContainer = document.getElementById('lineItems');
    const addLineItemBtn = document.getElementById('addLineItem');
    const subtotalElement = document.getElementById('subtotal');
    const taxTotalElement = document.getElementById('taxTotal');
    const totalAmountElement = document.getElementById('totalAmount');
    const saveBtn = document.getElementById('saveBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const markPaidBtn = document.getElementById('markPaidBtn');
    const printBtn = document.getElementById('printBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const exportBtn = document.getElementById('exportBtn');
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const refreshBtn = document.getElementById('refreshBtn');
    const invoiceHistory = document.getElementById('invoiceHistory');
    const toastContainer = document.getElementById('toastContainer');
    
    // Preview Elements
    const previewStudentName = document.getElementById('previewStudentName');
    const previewStudentId = document.getElementById('previewStudentId');
    const previewParentName = document.getElementById('previewParentName');
    const previewParentPhone = document.getElementById('previewParentPhone');
    const previewBatch = document.getElementById('previewBatch');
    const previewInvoiceNumber = document.getElementById('previewInvoiceNumber');
    const previewIssueDate = document.getElementById('previewIssueDate');
    const previewDueDate = document.getElementById('previewDueDate');
    const previewStatus = document.getElementById('previewStatus');
    const previewLineItems = document.getElementById('previewLineItems');
    const previewSubtotal = document.getElementById('previewSubtotal');
    const previewTaxTotal = document.getElementById('previewTaxTotal');
    const previewTotalAmount = document.getElementById('previewTotalAmount');
    
    // State
    let lineItems = [];
    let currentInvoiceId = null;
    let invoices = [];
    
    // Initialize
    function init() {
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        issueDateInput.value = today;
        
        // Set due date to 15 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15);
        dueDateInput.value = dueDate.toISOString().split('T')[0];
        
        // Generate invoice number
        generateInvoiceNumber();
        
        // Add initial line item
        addLineItem();
        
        // Load invoices from API
        loadInvoices();
        
        // Load draft from localStorage if exists
        loadDraft();
        
        // Set up auto-save to localStorage
        setupAutoSave();
    }
    
    // Generate invoice number
    function generateInvoiceNumber() {
        const today = new Date();
        const dateStr = today.getFullYear().toString() + 
                       (today.getMonth() + 1).toString().padStart(2, '0') + 
                       today.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        invoiceNumberInput.value = `COACH-${dateStr}-${random}`;
    }
    
    // Add line item
    function addLineItem(description = '', quantity = 1, price = 0, tax = 0) {
        const itemId = Date.now().toString();
        const lineItem = {
            id: itemId,
            description,
            quantity,
            price,
            tax
        };
        
        lineItems.push(lineItem);
        renderLineItems();
        updateTotals();
        updatePreview();
    }
    
    // Render line items
    function renderLineItems() {
        lineItemsContainer.innerHTML = '';
        
        lineItems.forEach(item => {
            const lineItemDiv = document.createElement('div');
            lineItemDiv.className = 'line-item grid grid-cols-12 gap-2 items-center';
            lineItemDiv.dataset.id = item.id;
            
            lineItemDiv.innerHTML = `
                <div class="col-span-5">
                    <input type="text" placeholder="Description" value="${item.description}" 
                           class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 description">
                </div>
                <div class="col-span-2">
                    <input type="number" placeholder="Qty" value="${item.quantity}" min="1" 
                           class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 quantity">
                </div>
                <div class="col-span-2">
                    <input type="number" placeholder="Price" value="${item.price}" min="0" step="0.01" 
                           class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 price">
                </div>
                <div class="col-span-2">
                    <input type="number" placeholder="Tax %" value="${item.tax}" min="0" max="100" step="0.1" 
                           class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 tax">
                </div>
                <div class="col-span-1">
                    <button type="button" class="bg-red-500 hover:bg-red-600 text-white p-1 rounded remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            lineItemsContainer.appendChild(lineItemDiv);
            
            // Add event listeners
            const descriptionInput = lineItemDiv.querySelector('.description');
            const quantityInput = lineItemDiv.querySelector('.quantity');
            const priceInput = lineItemDiv.querySelector('.price');
            const taxInput = lineItemDiv.querySelector('.tax');
            const removeBtn = lineItemDiv.querySelector('.remove-item');
            
            descriptionInput.addEventListener('input', () => {
                item.description = descriptionInput.value;
                updatePreview();
            });
            
            quantityInput.addEventListener('input', () => {
                item.quantity = parseFloat(quantityInput.value) || 0;
                updateTotals();
                updatePreview();
            });
            
            priceInput.addEventListener('input', () => {
                item.price = parseFloat(priceInput.value) || 0;
                updateTotals();
                updatePreview();
            });
            
            taxInput.addEventListener('input', () => {
                item.tax = parseFloat(taxInput.value) || 0;
                updateTotals();
                updatePreview();
            });
            
            removeBtn.addEventListener('click', () => {
                removeLineItem(item.id);
            });
        });
    }
    
    // Remove line item
    function removeLineItem(itemId) {
        lineItems = lineItems.filter(item => item.id !== itemId);
        renderLineItems();
        updateTotals();
        updatePreview();
    }
    
    // Update totals
    function updateTotals() {
        let subtotal = 0;
        let taxTotal = 0;
        
        lineItems.forEach(item => {
            const itemTotal = item.quantity * item.price;
            subtotal += itemTotal;
            taxTotal += itemTotal * (item.tax / 100);
        });
        
        const totalAmount = subtotal + taxTotal;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxTotalElement.textContent = `$${taxTotal.toFixed(2)}`;
        totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
        
        return { subtotal, taxTotal, totalAmount };
    }
    
    // Update preview
    function updatePreview() {
        // Update student information
        previewStudentName.textContent = studentNameInput.value || 'Student Name';
        previewStudentId.textContent = `Student ID: ${studentIdInput.value}`;
        previewParentName.textContent = `Parent: ${parentNameInput.value}`;
        previewParentPhone.textContent = `Phone: ${parentPhoneInput.value}`;
        previewBatch.textContent = `Batch: ${batchInput.value}`;
        previewInvoiceNumber.textContent = invoiceNumberInput.value;
        previewIssueDate.textContent = formatDate(issueDateInput.value);
        previewDueDate.textContent = formatDate(dueDateInput.value);
        
        // Update line items
        if (lineItems.length === 0) {
            previewLineItems.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No items added</td></tr>';
        } else {
            previewLineItems.innerHTML = '';
            lineItems.forEach(item => {
                const itemTotal = item.quantity * item.price;
                const itemWithTax = itemTotal + (itemTotal * (item.tax / 100));
                
                const tr = document.createElement('tr');
                tr.className = 'border-b';
                tr.innerHTML = `
                    <td class="py-2">${item.description}</td>
                    <td class="text-center py-2">${item.quantity}</td>
                    <td class="text-right py-2">$${item.price.toFixed(2)}</td>
                    <td class="text-right py-2">${item.tax}%</td>
                    <td class="text-right py-2">$${itemWithTax.toFixed(2)}</td>
                `;
                previewLineItems.appendChild(tr);
            });
        }
        
        // Update totals
        const { subtotal, taxTotal, totalAmount } = updateTotals();
        previewSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        previewTaxTotal.textContent = `$${taxTotal.toFixed(2)}`;
        previewTotalAmount.textContent = `$${totalAmount.toFixed(2)}`;
    }
    
    // Format date
    function formatDate(dateString) {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast p-4 rounded-md shadow-lg text-white ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
        }`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 
                     type === 'info' ? 'fa-info-circle' : 'fa-bell';
        
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${icon} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Save invoice
    async function saveInvoice() {
        if (!validateForm()) return;
        
        const { subtotal, taxTotal, totalAmount } = updateTotals();
        
        const invoiceData = {
            studentName: studentNameInput.value,
            studentId: studentIdInput.value,
            parentName: parentNameInput.value,
            parentPhone: parentPhoneInput.value,
            batch: batchInput.value,
            invoiceNumber: invoiceNumberInput.value,
            issueDate: issueDateInput.value,
            dueDate: dueDateInput.value,
            lineItems: lineItems.map(item => ({
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                tax: item.tax
            })),
            subtotal,
            taxTotal,
            totalAmount,
            paid: false
        };
        
        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save invoice');
            }
            
            const savedInvoice = await response.json();
            showToast('Invoice saved successfully!', 'success');
            
            // Clear form and reset
            clearForm();
            
            // Reload invoices
            loadInvoices();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Error saving invoice:', error);
        }
    }
    
    // Update invoice
    async function updateInvoice() {
        if (!validateForm() || !currentInvoiceId) return;
        
        const { subtotal, taxTotal, totalAmount } = updateTotals();
        
        const invoiceData = {
            studentName: studentNameInput.value,
            studentId: studentIdInput.value,
            parentName: parentNameInput.value,
            parentPhone: parentPhoneInput.value,
            batch: batchInput.value,
            invoiceNumber: invoiceNumberInput.value,
            issueDate: issueDateInput.value,
            dueDate: dueDateInput.value,
            lineItems: lineItems.map(item => ({
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                tax: item.tax
            })),
            subtotal,
            taxTotal,
            totalAmount
        };
        
        try {
            const response = await fetch(`/api/invoices/${currentInvoiceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update invoice');
            }
            
            const updatedInvoice = await response.json();
            showToast('Invoice updated successfully!', 'success');
            
            // Reload invoices
            loadInvoices();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Error updating invoice:', error);
        }
    }
    
    // Delete invoice
    async function deleteInvoice() {
        if (!currentInvoiceId) return;
        
        if (!confirm('Are you sure you want to delete this invoice?')) return;
        
        try {
            const response = await fetch(`/api/invoices/${currentInvoiceId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete invoice');
            }
            
            showToast('Invoice deleted successfully!', 'success');
            
            // Clear form and reset
            clearForm();
            
            // Reload invoices
            loadInvoices();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Error deleting invoice:', error);
        }
    }
    
    // Mark invoice as paid
    async function markAsPaid() {
        if (!currentInvoiceId) return;
        
        try {
            const response = await fetch(`/api/invoices/${currentInvoiceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paid: true,
                    paymentDate: new Date().toISOString().split('T')[0]
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update invoice');
            }
            
            const updatedInvoice = await response.json();
            showToast('Invoice marked as paid!', 'success');
            
            // Update preview status
            previewStatus.textContent = 'Paid';
            previewStatus.className = 'font-semibold text-green-600';
            
            // Reload invoices
            loadInvoices();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Error marking invoice as paid:', error);
        }
    }
    
    // Load invoice for editing
    async function loadInvoiceForEdit(invoiceId) {
        try {
            const response = await fetch(`/api/invoices/${invoiceId}`);
            
            if (!response.ok) {
                throw new Error('Failed to load invoice');
            }
            
            const invoice = await response.json();
            
            // Populate form
            currentInvoiceId = invoice._id;
            invoiceIdInput.value = invoice._id;
            studentNameInput.value = invoice.studentName;
            studentIdInput.value = invoice.studentId;
            parentNameInput.value = invoice.parentName;
            parentPhoneInput.value = invoice.parentPhone;
            batchInput.value = invoice.batch;
            invoiceNumberInput.value = invoice.invoiceNumber;
            issueDateInput.value = invoice.issueDate.split('T')[0];
            dueDateInput.value = invoice.dueDate.split('T')[0];
            
            // Clear and populate line items
            lineItems = [];
            invoice.lineItems.forEach(item => {
                addLineItem(item.description, item.quantity, item.price, item.tax);
            });
            
            // Update preview
            updatePreview();
            
            // Update status in preview
            if (invoice.paid) {
                previewStatus.textContent = 'Paid';
                previewStatus.className = 'font-semibold text-green-600';
            } else {
                previewStatus.textContent = 'Unpaid';
                previewStatus.className = 'font-semibold text-red-600';
            }
            
            // Show appropriate buttons
            saveBtn.classList.add('hidden');
            updateBtn.classList.remove('hidden');
            deleteBtn.classList.remove('hidden');
            
            if (!invoice.paid) {
                markPaidBtn.classList.remove('hidden');
            } else {
                markPaidBtn.classList.add('hidden');
            }
            
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            showToast('Invoice loaded for editing', 'info');
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Error loading invoice:', error);
        }
    }
    
    // Load invoices
    async function loadInvoices() {
        try {
            const response = await fetch('/api/invoices');
            
            if (!response.ok) {
                throw new Error('Failed to load invoices');
            }
            
            invoices = await response.json();
            renderInvoiceHistory();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Error loading invoices:', error);
        }
    }
    
    // Render invoice history
    function renderInvoiceHistory() {
        let filteredInvoices = [...invoices];
        
        // Apply search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredInvoices = filteredInvoices.filter(invoice => 
                invoice.studentName.toLowerCase().includes(searchTerm) || 
                invoice.invoiceNumber.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply status filter
        const statusFilter = filterStatus.value;
        if (statusFilter !== 'all') {
            filteredInvoices = filteredInvoices.filter(invoice => 
                statusFilter === 'paid' ? invoice.paid : !invoice.paid
            );
        }
        
        // Sort by issue date (newest first)
        filteredInvoices.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
        
        // Render table
        if (filteredInvoices.length === 0) {
            invoiceHistory.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-gray-500">No invoices found</td></tr>';
            return;
        }
        
        invoiceHistory.innerHTML = '';
        filteredInvoices.forEach(invoice => {
            const tr = document.createElement('tr');
            tr.className = 'border-b hover:bg-gray-50';
            
            const statusClass = invoice.paid ? 'text-green-600' : 'text-red-600';
            const statusText = invoice.paid ? 'Paid' : 'Unpaid';
            
            tr.innerHTML = `
                <td class="py-2 px-2">${invoice.invoiceNumber}</td>
                <td class="py-2 px-2">${invoice.studentName}</td>
                <td class="py-2 px-2">${invoice.studentId}</td>
                <td class="py-2 px-2">${formatDate(invoice.issueDate)}</td>
                <td class="py-2 px-2">${formatDate(invoice.dueDate)}</td>
                <td class="text-right py-2 px-2">$${invoice.totalAmount.toFixed(2)}</td>
                <td class="text-center py-2 px-2">
                    <span class="${statusClass} font-semibold">${statusText}</span>
                </td>
                <td class="text-center py-2 px-2">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded mr-1 edit-btn" data-id="${invoice._id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white p-1 rounded delete-btn" data-id="${invoice._id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            invoiceHistory.appendChild(tr);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                loadInvoiceForEdit(btn.dataset.id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this invoice?')) {
                    deleteInvoiceById(btn.dataset.id);
                }
            });
        });
    }
    
    // Delete invoice by ID
    async function deleteInvoiceById(invoiceId) {
        try {
            const response = await fetch(`/api/invoices/${invoiceId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete invoice');
            }
            
            showToast('Invoice deleted successfully!', 'success');
            
            // Reload invoices
            loadInvoices();
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Error deleting invoice:', error);
        }
    }
    
    // Export CSV
    async function exportCSV() {
        try {
            const response = await fetch('/api/export');
            
            if (!response.ok) {
                throw new Error('Failed to export CSV');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showToast('CSV exported successfully!', 'success');
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Error exporting CSV:', error);
        }
    }
    
    // Print invoice
    function printInvoice() {
        window.print();
    }
    
    // Clear form
    function clearForm() {
        currentInvoiceId = null;
        invoiceIdInput.value = '';
        studentNameInput.value = '';
        studentIdInput.value = '';
        parentNameInput.value = '';
        parentPhoneInput.value = '';
        batchInput.value = '';
        
        // Reset dates
        const today = new Date().toISOString().split('T')[0];
        issueDateInput.value = today;
        
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15);
        dueDateInput.value = dueDate.toISOString().split('T')[0];
        
        // Generate new invoice number
        generateInvoiceNumber();
        
        // Reset line items
        lineItems = [];
        addLineItem();
        
        // Reset preview status
        previewStatus.textContent = 'Unpaid';
        previewStatus.className = 'font-semibold text-red-600';
        
        // Show appropriate buttons
        saveBtn.classList.remove('hidden');
        updateBtn.classList.add('hidden');
        deleteBtn.classList.add('hidden');
        markPaidBtn.classList.add('hidden');
        
        // Update preview
        updatePreview();
        
        // Clear draft from localStorage
        localStorage.removeItem('invoiceDraft');
        
        showToast('Form cleared', 'info');
    }
    
    // Validate form
    function validateForm() {
        if (!studentNameInput.value.trim()) {
            showToast('Please enter student name', 'error');
            studentNameInput.focus();
            return false;
        }
        
        if (!studentIdInput.value.trim()) {
            showToast('Please enter student ID', 'error');
            studentIdInput.focus();
            return false;
        }
        
        if (!parentNameInput.value.trim()) {
            showToast('Please enter parent name', 'error');
            parentNameInput.focus();
            return false;
        }
        
        if (!parentPhoneInput.value.trim()) {
            showToast('Please enter parent phone', 'error');
            parentPhoneInput.focus();
            return false;
        }
        
        if (!batchInput.value.trim()) {
            showToast('Please enter batch', 'error');
            batchInput.focus();
            return false;
        }
        
        if (lineItems.length === 0) {
            showToast('Please add at least one line item', 'error');
            return false;
        }
        
        for (const item of lineItems) {
            if (!item.description.trim()) {
                showToast('Please enter description for all line items', 'error');
                return false;
            }
            
            if (item.quantity <= 0) {
                showToast('Quantity must be greater than 0', 'error');
                return false;
            }
            
            if (item.price < 0) {
                showToast('Price cannot be negative', 'error');
                return false;
            }
            
            if (item.tax < 0 || item.tax > 100) {
                showToast('Tax must be between 0 and 100', 'error');
                return false;
            }
        }
        
        return true;
    }
    
    // Save draft to localStorage
    function saveDraft() {
        const draft = {
            studentName: studentNameInput.value,
            studentId: studentIdInput.value,
            parentName: parentNameInput.value,
            parentPhone: parentPhoneInput.value,
            batch: batchInput.value,
            invoiceNumber: invoiceNumberInput.value,
            issueDate: issueDateInput.value,
            dueDate: dueDateInput.value,
            lineItems: lineItems.map(item => ({
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                tax: item.tax
            }))
        };
        
        localStorage.setItem('invoiceDraft', JSON.stringify(draft));
    }
    
    // Load draft from localStorage
    function loadDraft() {
        const draftData = localStorage.getItem('invoiceDraft');
        
        if (!draftData) return;
        
        try {
            const draft = JSON.parse(draftData);
            
            studentNameInput.value = draft.studentName || '';
            studentIdInput.value = draft.studentId || '';
            parentNameInput.value = draft.parentName || '';
            parentPhoneInput.value = draft.parentPhone || '';
            batchInput.value = draft.batch || '';
            invoiceNumberInput.value = draft.invoiceNumber || invoiceNumberInput.value;
            issueDateInput.value = draft.issueDate || issueDateInput.value;
            dueDateInput.value = draft.dueDate || dueDateInput.value;
            
            // Clear and populate line items
            lineItems = [];
            if (draft.lineItems && draft.lineItems.length > 0) {
                draft.lineItems.forEach(item => {
                    addLineItem(item.description, item.quantity, item.price, item.tax);
                });
            } else {
                addLineItem();
            }
            
            updatePreview();
            
            showToast('Draft restored from local storage', 'info');
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }
    
    // Setup auto-save to localStorage
    function setupAutoSave() {
        // Save draft on input change
        const inputs = [
            studentNameInput, studentIdInput, parentNameInput, 
            parentPhoneInput, batchInput, issueDateInput, dueDateInput
        ];
        
        inputs.forEach(input => {
            input.addEventListener('input', saveDraft);
        });
        
        // Save draft every 30 seconds
        setInterval(saveDraft, 30000);
    }
    
    // Event Listeners
    addLineItemBtn.addEventListener('click', () => {
        addLineItem();
    });
    
    invoiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveInvoice();
    });
    
    updateBtn.addEventListener('click', updateInvoice);
    deleteBtn.addEventListener('click', deleteInvoice);
    markPaidBtn.addEventListener('click', markAsPaid);
    printBtn.addEventListener('click', printInvoice);
    clearFormBtn.addEventListener('click', clearForm);
    exportBtn.addEventListener('click', exportCSV);
    refreshBtn.addEventListener('click', loadInvoices);
    
    searchInput.addEventListener('input', renderInvoiceHistory);
    filterStatus.addEventListener('change', renderInvoiceHistory);
    
    // Initialize the app
    init();
});
```

## /api/_db.js

```javascript
import mongoose from 'mongoose';

// Cache the connection to avoid reconnecting on every function invocation
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
            .then(mongoose => {
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
```

## /api/invoices/index.js

```javascript
import connectDB from '../_db.js';
import Invoice from '../../models/Invoice.js';

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    batch: { type: String, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    lineItems: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        tax: { type: Number, required: true, min: 0, max: 100 }
    }],
    subtotal: { type: Number, required: true, min: 0 },
    taxTotal: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paid: { type: Boolean, default: false },
    paymentDate: { type: Date }
}, {
    timestamps: true
});

// Create model if it doesn't exist
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default async function handler(req, res) {
    await connectDB();

    try {
        if (req.method === 'GET') {
            // Get all invoices
            const invoices = await Invoice.find().sort({ createdAt: -1 });
            return res.status(200).json(invoices);
        } else if (req.method === 'POST') {
            // Create a new invoice
            const invoiceData = req.body;
            
            // Check if invoice number already exists
            const existingInvoice = await Invoice.findOne({ invoiceNumber: invoiceData.invoiceNumber });
            if (existingInvoice) {
                return res.status(400).json({ error: 'Invoice number already exists' });
            }
            
            const newInvoice = new Invoice(invoiceData);
            const savedInvoice = await newInvoice.save();
            
            return res.status(201).json(savedInvoice);
        } else {
            // Method not allowed
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in invoices API:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

## /api/invoices/[id].js

```javascript
import connectDB from '../../_db.js';

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    batch: { type: String, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    lineItems: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        tax: { type: Number, required: true, min: 0, max: 100 }
    }],
    subtotal: { type: Number, required: true, min: 0 },
    taxTotal: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paid: { type: Boolean, default: false },
    paymentDate: { type: Date }
}, {
    timestamps: true
});

// Create model if it doesn't exist
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default async function handler(req, res) {
    await connectDB();

    const { id } = req.query;

    try {
        if (req.method === 'GET') {
            // Get a specific invoice
            const invoice = await Invoice.findById(id);
            
            if (!invoice) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            
            return res.status(200).json(invoice);
        } else if (req.method === 'PUT') {
            // Update a specific invoice
            const updateData = req.body;
            
            // Check if invoice exists
            const existingInvoice = await Invoice.findById(id);
            if (!existingInvoice) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            
            // If invoice number is being updated, check if it's already taken by another invoice
            if (updateData.invoiceNumber && updateData.invoiceNumber !== existingInvoice.invoiceNumber) {
                const duplicateInvoice = await Invoice.findOne({ 
                    invoiceNumber: updateData.invoiceNumber,
                    _id: { $ne: id }
                });
                
                if (duplicateInvoice) {
                    return res.status(400).json({ error: 'Invoice number already exists' });
                }
            }
            
            const updatedInvoice = await Invoice.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            
            return res.status(200).json(updatedInvoice);
        } else if (req.method === 'DELETE') {
            // Delete a specific invoice
            const invoice = await Invoice.findById(id);
            
            if (!invoice) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            
            await Invoice.findByIdAndDelete(id);
            
            return res.status(200).json({ message: 'Invoice deleted successfully' });
        } else {
            // Method not allowed
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in invoice API:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

## /api/export.js

```javascript
import connectDB from '../_db.js';

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    batch: { type: String, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    lineItems: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        tax: { type: Number, required: true, min: 0, max: 100 }
    }],
    subtotal: { type: Number, required: true, min: 0 },
    taxTotal: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paid: { type: Boolean, default: false },
    paymentDate: { type: Date }
}, {
    timestamps: true
});

// Create model if it doesn't exist
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default async function handler(req, res) {
    await connectDB();

    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        // Get all invoices
        const invoices = await Invoice.find().sort({ createdAt: -1 });

        // Create CSV content
        const headers = [
            'Invoice Number',
            'Student Name',
            'Student ID',
            'Parent Name',
            'Parent Phone',
            'Batch',
            'Issue Date',
            'Due Date',
            'Payment Date',
            'Status',
            'Subtotal',
            'Tax Total',
            'Total Amount'
        ];

        const csvContent = [
            headers.join(','),
            ...invoices.map(invoice => [
                invoice.invoiceNumber,
                invoice.studentName,
                invoice.studentId,
                invoice.parentName,
                invoice.parentPhone,
                invoice.batch,
                new Date(invoice.issueDate).toLocaleDateString(),
                new Date(invoice.dueDate).toLocaleDateString(),
                invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString() : '',
                invoice.paid ? 'Paid' : 'Unpaid',
                invoice.subtotal.toFixed(2),
                invoice.taxTotal.toFixed(2),
                invoice.totalAmount.toFixed(2)
            ].join(','))
        ].join('\n');

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="invoices_${new Date().toISOString().split('T')[0]}.csv"`);

        return res.status(200).send(csvContent);
    } catch (error) {
        console.error('Error in export API:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

## README.md

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
