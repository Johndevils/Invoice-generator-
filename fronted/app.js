// DOM Elements
const createTab = document.getElementById('create-tab');
const listTab = document.getElementById('list-tab');
const createTabContent = document.getElementById('create-tab-content');
const listTabContent = document.getElementById('list-tab-content');
const invoiceForm = document.getElementById('invoice-form');
const lineItemsContainer = document.getElementById('line-items-container');
const addLineItemBtn = document.getElementById('add-line-item');
const resetFormBtn = document.getElementById('reset-form');
const printInvoiceBtn = document.getElementById('print-invoice');
const markPaidBtn = document.getElementById('mark-paid');
const invoiceIdInput = document.getElementById('invoice-id');
const invoiceNumberInput = document.getElementById('invoice-number');
const issueDateInput = document.getElementById('issue-date');
const dueDateInput = document.getElementById('due-date');
const subtotalElement = document.getElementById('subtotal');
const taxTotalElement = document.getElementById('tax-total');
const totalAmountElement = document.getElementById('total-amount');
const invoicePreview = document.getElementById('invoice-preview');
const invoiceList = document.getElementById('invoice-list');
const noInvoicesMessage = document.getElementById('no-invoices');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const exportCsvBtn = document.getElementById('export-csv');

// State
let lineItems = [];
let currentInvoiceId = null;
let invoices = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default for issue date
    const today = new Date().toISOString().split('T')[0];
    issueDateInput.value = today;
    
    // Set due date to 30 days from today
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    dueDateInput.value = dueDate.toISOString().split('T')[0];
    
    // Generate initial invoice number
    generateInvoiceNumber();
    
    // Add initial line item
    addLineItem();
    
    // Load invoices from server
    loadInvoicesFromServer();
    
    // Load draft from localStorage if exists
    loadDraft();
    
    // Setup event listeners
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    createTab.addEventListener('click', () => {
        createTab.classList.add('border-blue-500', 'text-blue-600');
        createTab.classList.remove('border-transparent', 'text-gray-500');
        listTab.classList.remove('border-blue-500', 'text-blue-600');
        listTab.classList.add('border-transparent', 'text-gray-500');
        
        createTabContent.classList.remove('hidden');
        listTabContent.classList.add('hidden');
    });
    
    listTab.addEventListener('click', () => {
        listTab.classList.add('border-blue-500', 'text-blue-600');
        listTab.classList.remove('border-transparent', 'text-gray-500');
        createTab.classList.remove('border-blue-500', 'text-blue-600');
        createTab.classList.add('border-transparent', 'text-gray-500');
        
        listTabContent.classList.remove('hidden');
        createTabContent.classList.add('hidden');
    });
    
    // Form submission
    invoiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            saveInvoiceToServer();
        }
    });
    
    // Add line item button
    addLineItemBtn.addEventListener('click', addLineItem);
    
    // Reset form button
    resetFormBtn.addEventListener('click', resetForm);
    
    // Print invoice button
    printInvoiceBtn.addEventListener('click', () => {
        window.print();
    });
    
    // Mark as paid button
    markPaidBtn.addEventListener('click', markInvoiceAsPaid);
    
    // Search input
    searchInput.addEventListener('input', filterInvoices);
    
    // Filter select
    filterSelect.addEventListener('change', filterInvoices);
    
    // Export CSV button
    exportCsvBtn.addEventListener('click', exportToCSV);
    
    // Auto-save draft on form change
    invoiceForm.addEventListener('input', debounce(saveDraft, 1000));
}

// Generate Invoice Number
function generateInvoiceNumber() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    invoiceNumberInput.value = `COACH-${dateStr}-${randomNum}`;
}

// Add Line Item
function addLineItem() {
    const itemId = Date.now().toString();
    lineItems.push({
        id: itemId,
        description: '',
        quantity: 1,
        unitPrice: 0,
        tax: 0
    });
    
    const lineItemRow = document.createElement('tr');
    lineItemRow.className = 'line-item-row';
    lineItemRow.id = `line-item-${itemId}`;
    
    lineItemRow.innerHTML = `
        <td class="px-4 py-2">
            <input type="text" id="description-${itemId}" class="w-full px-2 py-1 border border-gray-300 rounded" placeholder="Description" required>
            <span class="text-red-500 text-xs hidden" id="description-${itemId}-error">Description is required</span>
        </td>
        <td class="px-4 py-2">
            <input type="number" id="quantity-${itemId}" class="w-full px-2 py-1 border border-gray-300 rounded" min="1" value="1" required>
            <span class="text-red-500 text-xs hidden" id="quantity-${itemId}-error">Quantity must be at least 1</span>
        </td>
        <td class="px-4 py-2">
            <input type="number" id="unit-price-${itemId}" class="w-full px-2 py-1 border border-gray-300 rounded" min="0" step="0.01" value="0" required>
            <span class="text-red-500 text-xs hidden" id="unit-price-${itemId}-error">Unit price must be at least 0</span>
        </td>
        <td class="px-4 py-2">
            <input type="number" id="tax-${itemId}" class="w-full px-2 py-1 border border-gray-300 rounded" min="0" max="100" step="0.01" value="0">
        </td>
        <td class="px-4 py-2">
            <span id="total-${itemId}" class="font-medium">₹0.00</span>
        </td>
        <td class="px-4 py-2">
            <button type="button" class="text-red-600 hover:text-red-800" onclick="removeLineItem('${itemId}')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
        </td>
    `;
    
    lineItemsContainer.appendChild(lineItemRow);
    
    // Add event listeners to calculate totals when values change
    document.getElementById(`quantity-${itemId}`).addEventListener('input', () => calculateLineItemTotal(itemId));
    document.getElementById(`unit-price-${itemId}`).addEventListener('input', () => calculateLineItemTotal(itemId));
    document.getElementById(`tax-${itemId}`).addEventListener('input', () => calculateLineItemTotal(itemId));
    
    // Update totals
    calculateTotals();
}

// Remove Line Item
function removeLineItem(itemId) {
    const index = lineItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        lineItems.splice(index, 1);
        document.getElementById(`line-item-${itemId}`).remove();
        calculateTotals();
    }
}

// Calculate Line Item Total
function calculateLineItemTotal(itemId) {
    const quantity = parseFloat(document.getElementById(`quantity-${itemId}`).value) || 0;
    const unitPrice = parseFloat(document.getElementById(`unit-price-${itemId}`).value) || 0;
    const tax = parseFloat(document.getElementById(`tax-${itemId}`).value) || 0;
    
    const subtotal = quantity * unitPrice;
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount;
    
    document.getElementById(`total-${itemId}`).textContent = `₹${total.toFixed(2)}`;
    
    // Update line items array
    const item = lineItems.find(item => item.id === itemId);
    if (item) {
        item.description = document.getElementById(`description-${itemId}`).value;
        item.quantity = quantity;
        item.unitPrice = unitPrice;
        item.tax = tax;
    }
    
    // Update totals
    calculateTotals();
}

// Calculate Totals
function calculateTotals() {
    let subtotal = 0;
    let taxTotal = 0;
    
    lineItems.forEach(item => {
        const quantity = parseFloat(document.getElementById(`quantity-${item.id}`).value) || 0;
        const unitPrice = parseFloat(document.getElementById(`unit-price-${item.id}`).value) || 0;
        const tax = parseFloat(document.getElementById(`tax-${item.id}`).value) || 0;
        
        const itemSubtotal = quantity * unitPrice;
        const itemTax = itemSubtotal * (tax / 100);
        
        subtotal += itemSubtotal;
        taxTotal += itemTax;
    });
    
    const totalAmount = subtotal + taxTotal;
    
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    taxTotalElement.textContent = `₹${taxTotal.toFixed(2)}`;
    totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;
    
    // Update preview
    renderPreview();
}

// Validate Form
function validateForm() {
    let isValid = true;
    
    // Validate student information
    const studentName = document.getElementById('student-name').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const parentName = document.getElementById('parent-name').value.trim();
    const parentPhone = document.getElementById('parent-phone').value.trim();
    const batch = document.getElementById('batch').value.trim();
    const issueDate = document.getElementById('issue-date').value;
    const dueDate = document.getElementById('due-date').value;
    
    if (!studentName) {
        document.getElementById('student-name-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('student-name-error').classList.add('hidden');
    }
    
    if (!studentId) {
        document.getElementById('student-id-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('student-id-error').classList.add('hidden');
    }
    
    if (!parentName) {
        document.getElementById('parent-name-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('parent-name-error').classList.add('hidden');
    }
    
    if (!parentPhone) {
        document.getElementById('parent-phone-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('parent-phone-error').classList.add('hidden');
    }
    
    if (!batch) {
        document.getElementById('batch-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('batch-error').classList.add('hidden');
    }
    
    if (!issueDate) {
        document.getElementById('issue-date-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('issue-date-error').classList.add('hidden');
    }
    
    if (!dueDate) {
        document.getElementById('due-date-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('due-date-error').classList.add('hidden');
    }
    
    // Validate line items
    lineItems.forEach(item => {
        const description = document.getElementById(`description-${item.id}`).value.trim();
        const quantity = parseFloat(document.getElementById(`quantity-${item.id}`).value) || 0;
        const unitPrice = parseFloat(document.getElementById(`unit-price-${item.id}`).value) || 0;
        
        if (!description) {
            document.getElementById(`description-${item.id}-error`).classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById(`description-${item.id}-error`).classList.add('hidden');
        }
        
        if (quantity < 1) {
            document.getElementById(`quantity-${item.id}-error`).classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById(`quantity-${item.id}-error`).classList.add('hidden');
        }
        
        if (unitPrice < 0) {
            document.getElementById(`unit-price-${item.id}-error`).classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById(`unit-price-${item.id}-error`).classList.add('hidden');
        }
    });
    
    return isValid;
}

// Build Invoice Object
function buildInvoiceObject() {
    const lineItemsData = lineItems.map(item => ({
        description: document.getElementById(`description-${item.id}`).value.trim(),
        quantity: parseFloat(document.getElementById(`quantity-${item.id}`).value) || 0,
        unitPrice: parseFloat(document.getElementById(`unit-price-${item.id}`).value) || 0,
        tax: parseFloat(document.getElementById(`tax-${item.id}`).value) || 0
    }));
    
    const subtotal = parseFloat(subtotalElement.textContent.replace('₹', ''));
    const taxTotal = parseFloat(taxTotalElement.textContent.replace('₹', ''));
    const totalAmount = parseFloat(totalAmountElement.textContent.replace('₹', ''));
    
    return {
        studentName: document.getElementById('student-name').value.trim(),
        studentId: document.getElementById('student-id').value.trim(),
        parentName: document.getElementById('parent-name').value.trim(),
        parentPhone: document.getElementById('parent-phone').value.trim(),
        batch: document.getElementById('batch').value.trim(),
        invoiceNumber: invoiceNumberInput.value,
        issueDate: document.getElementById('issue-date').value,
        dueDate: document.getElementById('due-date').value,
        lineItems: lineItemsData,
        subtotal,
        taxTotal,
        totalAmount
    };
}

// Render Preview
function renderPreview() {
    const invoiceData = buildInvoiceObject();
    
    const lineItemsHtml = invoiceData.lineItems.map(item => {
        const subtotal = item.quantity * item.unitPrice;
        const taxAmount = subtotal * (item.tax / 100);
        const total = subtotal + taxAmount;
        
        return `
            <tr>
                <td class="px-4 py-2">${item.description}</td>
                <td class="px-4 py-2 text-center">${item.quantity}</td>
                <td class="px-4 py-2 text-right">₹${item.unitPrice.toFixed(2)}</td>
                <td class="px-4 py-2 text-center">${item.tax}%</td>
                <td class="px-4 py-2 text-right">₹${total.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
    
    invoicePreview.innerHTML = `
        <div class="invoice-header mb-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h1 class="text-2xl font-bold">INVOICE</h1>
                    <p class="text-gray-600">${invoiceData.invoiceNumber}</p>
                </div>
                <div class="text-right">
                    <p class="font-medium">Coaching Center</p>
                    <p class="text-gray-600">123 Education Street</p>
                    <p class="text-gray-600">City, State, 12345</p>
                    <p class="text-gray-600">Phone: (123) 456-7890</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <h3 class="font-medium mb-2">Bill To:</h3>
                    <p class="font-medium">${invoiceData.studentName}</p>
                    <p>Student ID: ${invoiceData.studentId}</p>
                    <p>Parent: ${invoiceData.parentName}</p>
                    <p>Phone: ${invoiceData.parentPhone}</p>
                    <p>Batch/Class: ${invoiceData.batch}</p>
                </div>
                <div class="text-right">
                    <p><span class="font-medium">Issue Date:</span> ${formatDate(invoiceData.issueDate)}</p>
                    <p><span class="font-medium">Due Date:</span> ${formatDate(invoiceData.dueDate)}</p>
                </div>
            </div>
        </div>
        
        <div class="invoice-items mb-6">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-4 py-2 text-left">Description</th>
                        <th class="px-4 py-2 text-center">Quantity</th>
                        <th class="px-4 py-2 text-right">Unit Price</th>
                        <th class="px-4 py-2 text-center">Tax</th>
                        <th class="px-4 py-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${lineItemsHtml}
                </tbody>
            </table>
        </div>
        
        <div class="invoice-totals">
            <div class="flex justify-end">
                <div class="w-full md:w-1/2">
                    <div class="bg-gray-50 p-4 rounded-md">
                        <div class="flex justify-between mb-2">
                            <span>Subtotal:</span>
                            <span>₹${invoiceData.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span>Tax Total:</span>
                            <span>₹${invoiceData.taxTotal.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between pt-2 border-t border-gray-200">
                            <span class="font-medium">Total Amount:</span>
                            <span class="font-bold text-blue-600">₹${invoiceData.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="invoice-footer mt-8 text-center text-gray-600 text-sm">
            <p>Thank you for your business!</p>
            <p>Payment is due within 30 days.</p>
        </div>
    `;
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Save Invoice to Server
async function saveInvoiceToServer() {
    const invoiceData = buildInvoiceObject();
    
    try {
        let response;
        
        if (currentInvoiceId) {
            // Update existing invoice
            response = await fetch(`/api/invoices/${currentInvoiceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });
        } else {
            // Create new invoice
            response = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });
        }
        
        if (!response.ok) {
            throw new Error('Failed to save invoice');
        }
        
        const savedInvoice = await response.json();
        
        showToast('Invoice saved successfully!', 'success');
        
        // Clear draft from localStorage
        localStorage.removeItem('invoiceDraft');
        
        // Reset form
        resetForm();
        
        // Reload invoices list
        loadInvoicesFromServer();
    } catch (error) {
        console.error('Error saving invoice:', error);
        showToast('Failed to save invoice. Please try again.', 'error');
    }
}

// Load Invoices from Server
async function loadInvoicesFromServer() {
    try {
        const response = await fetch('/api/invoices');
        
        if (!response.ok) {
            throw new Error('Failed to load invoices');
        }
        
        invoices = await response.json();
        renderInvoiceList();
    } catch (error) {
        console.error('Error loading invoices:', error);
        showToast('Failed to load invoices. Please refresh the page.', 'error');
    }
}

// Render Invoice List
function renderInvoiceList() {
    if (invoices.length === 0) {
        invoiceList.innerHTML = '';
        noInvoicesMessage.classList.remove('hidden');
        return;
    }
    
    noInvoicesMessage.classList.add('hidden');
    
    const invoiceRows = invoices.map(invoice => {
        const statusClass = invoice.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        const statusText = invoice.paid ? 'Paid' : 'Unpaid';
        
        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${invoice.invoiceNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.studentName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.batch}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(invoice.issueDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(invoice.dueDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${invoice.totalAmount.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="viewInvoice('${invoice._id}')" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button onclick="editInvoice('${invoice._id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    ${!invoice.paid ? `<button onclick="markAsPaidFromList('${invoice._id}')" class="text-green-600 hover:text-green-900 mr-3">Mark Paid</button>` : ''}
                    <button onclick="deleteInvoice('${invoice._id}')" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
    
    invoiceList.innerHTML = invoiceRows;
}

// Filter Invoices
function filterInvoices() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    
    let filteredInvoices = invoices;
    
    // Apply search filter
    if (searchTerm) {
        filteredInvoices = filteredInvoices.filter(invoice => 
            invoice.studentName.toLowerCase().includes(searchTerm) || 
            invoice.invoiceNumber.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (filterValue === 'paid') {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.paid);
    } else if (filterValue === 'unpaid') {
        filteredInvoices = filteredInvoices.filter(invoice => !invoice.paid);
    }
    
    // Render filtered invoices
    if (filteredInvoices.length === 0) {
        invoiceList.innerHTML = '';
        noInvoicesMessage.classList.remove('hidden');
        return;
    }
    
    noInvoicesMessage.classList.add('hidden');
    
    const invoiceRows = filteredInvoices.map(invoice => {
        const statusClass = invoice.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        const statusText = invoice.paid ? 'Paid' : 'Unpaid';
        
        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${invoice.invoiceNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.studentName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.batch}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(invoice.issueDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(invoice.dueDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${invoice.totalAmount.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="viewInvoice('${invoice._id}')" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button onclick="editInvoice('${invoice._id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    ${!invoice.paid ? `<button onclick="markAsPaidFromList('${invoice._id}')" class="text-green-600 hover:text-green-900 mr-3">Mark Paid</button>` : ''}
                    <button onclick="deleteInvoice('${invoice._id}')" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
    
    invoiceList.innerHTML = invoiceRows;
}

// View Invoice
async function viewInvoice(id) {
    try {
        const response = await fetch(`/api/invoices/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to load invoice');
        }
        
        const invoice = await response.json();
        
        // Switch to create tab
        createTab.click();
        
        // Load invoice data into form
        document.getElementById('student-name').value = invoice.studentName;
        document.getElementById('student-id').value = invoice.studentId;
        document.getElementById('parent-name').value = invoice.parentName;
        document.getElementById('parent-phone').value = invoice.parentPhone;
        document.getElementById('batch').value = invoice.batch;
        invoiceNumberInput.value = invoice.invoiceNumber;
        document.getElementById('issue-date').value = invoice.issueDate.split('T')[0];
        document.getElementById('due-date').value = invoice.dueDate.split('T')[0];
        
        // Clear existing line items
        lineItemsContainer.innerHTML = '';
        lineItems = [];
        
        // Add line items from invoice
        invoice.lineItems.forEach(item => {
            addLineItem();
            const itemId = lineItems[lineItems.length - 1].id;
            
            document.getElementById(`description-${itemId}`).value = item.description;
            document.getElementById(`quantity-${itemId}`).value = item.quantity;
            document.getElementById(`unit-price-${itemId}`).value = item.unitPrice;
            document.getElementById(`tax-${itemId}`).value = item.tax;
            
            calculateLineItemTotal(itemId);
        });
        
        // Set current invoice ID
        currentInvoiceId = id;
        
        // Update preview
        renderPreview();
        
        // Show/hide mark as paid button
        if (invoice.paid) {
            markPaidBtn.classList.add('hidden');
        } else {
            markPaidBtn.classList.remove('hidden');
        }
        
        // Switch to create tab
        createTab.click();
    } catch (error) {
        console.error('Error viewing invoice:', error);
        showToast('Failed to load invoice. Please try again.', 'error');
    }
}

// Edit Invoice
function editInvoice(id) {
    viewInvoice(id);
}

// Mark Invoice as Paid
async function markInvoiceAsPaid() {
    if (!currentInvoiceId) return;
    
    try {
        const response = await fetch(`/api/invoices/${currentInvoiceId}/mark-paid`, {
            method: 'PATCH'
        });
        
        if (!response.ok) {
            throw new Error('Failed to mark invoice as paid');
        }
        
        showToast('Invoice marked as paid!', 'success');
        
        // Hide mark as paid button
        markPaidBtn.classList.add('hidden');
        
        // Reload invoices list
        loadInvoicesFromServer();
    } catch (error) {
        console.error('Error marking invoice as paid:', error);
        showToast('Failed to mark invoice as paid. Please try again.', 'error');
    }
}

// Mark as Paid from List
async function markAsPaidFromList(id) {
    try {
        const response = await fetch(`/api/invoices/${id}/mark-paid`, {
            method: 'PATCH'
        });
        
        if (!response.ok) {
            throw new Error('Failed to mark invoice as paid');
        }
        
        showToast('Invoice marked as paid!', 'success');
        
        // Reload invoices list
        loadInvoicesFromServer();
    } catch (error) {
        console.error('Error marking invoice as paid:', error);
        showToast('Failed to mark invoice as paid. Please try again.', 'error');
    }
}

// Delete Invoice
async function deleteInvoice(id) {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
        const response = await fetch(`/api/invoices/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete invoice');
        }
        
        showToast('Invoice deleted successfully!', 'success');
        
        // Reload invoices list
        loadInvoicesFromServer();
        
        // If we're viewing this invoice, reset the form
        if (currentInvoiceId === id) {
            resetForm();
        }
    } catch (error) {
        console.error('Error deleting invoice:', error);
        showToast('Failed to delete invoice. Please try again.', 'error');
    }
}

// Reset Form
function resetForm() {
    invoiceForm.reset();
    
    // Reset dates
    const today = new Date().toISOString().split('T')[0];
    issueDateInput.value = today;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    dueDateInput.value = dueDate.toISOString().split('T')[0];
    
    // Generate new invoice number
    generateInvoiceNumber();
    
    // Clear line items
    lineItemsContainer.innerHTML = '';
    lineItems = [];
    
    // Add initial line item
    addLineItem();
    
    // Reset current invoice ID
    currentInvoiceId = null;
    
    // Hide mark as paid button
    markPaidBtn.classList.add('hidden');
    
    // Clear draft from localStorage
    localStorage.removeItem('invoiceDraft');
    
    // Reset preview
    invoicePreview.innerHTML = `
        <div class="text-center text-gray-500 py-8">
            <p>Invoice preview will appear here</p>
        </div>
    `;
}

// Save Draft to localStorage
function saveDraft() {
    const invoiceData = buildInvoiceObject();
    localStorage.setItem('invoiceDraft', JSON.stringify(invoiceData));
}

// Load Draft from localStorage
function loadDraft() {
    const draftData = localStorage.getItem('invoiceDraft');
    if (!draftData) return;
    
    try {
        const invoiceData = JSON.parse(draftData);
        
        // Load invoice data into form
        document.getElementById('student-name').value = invoiceData.studentName || '';
        document.getElementById('student-id').value = invoiceData.studentId || '';
        document.getElementById('parent-name').value = invoiceData.parentName || '';
        document.getElementById('parent-phone').value = invoiceData.parentPhone || '';
        document.getElementById('batch').value = invoiceData.batch || '';
        invoiceNumberInput.value = invoiceData.invoiceNumber || '';
        document.getElementById('issue-date').value = invoiceData.issueDate || '';
        document.getElementById('due-date').value = invoiceData.dueDate || '';
        
        // Clear existing line items
        lineItemsContainer.innerHTML = '';
        lineItems = [];
        
        // Add line items from draft
        if (invoiceData.lineItems && invoiceData.lineItems.length > 0) {
            invoiceData.lineItems.forEach(item => {
                addLineItem();
                const itemId = lineItems[lineItems.length - 1].id;
                
                document.getElementById(`description-${itemId}`).value = item.description || '';
                document.getElementById(`quantity-${itemId}`).value = item.quantity || 1;
                document.getElementById(`unit-price-${itemId}`).value = item.unitPrice || 0;
                document.getElementById(`tax-${itemId}`).value = item.tax || 0;
                
                calculateLineItemTotal(itemId);
            });
        } else {
            // Add initial line item if none in draft
            addLineItem();
        }
        
        // Update preview
        renderPreview();
        
        showToast('Draft restored from local storage', 'info');
    } catch (error) {
        console.error('Error loading draft:', error);
    }
}

// Export to CSV
function exportToCSV() {
    if (invoices.length === 0) {
        showToast('No invoices to export', 'warning');
        return;
    }
    
    // Create CSV content
    const headers = [
        'Invoice Number',
        'Student Name',
        'Student ID',
        'Parent Name',
        'Parent Phone',
        'Batch/Class',
        'Issue Date',
        'Due Date',
        'Subtotal',
        'Tax Total',
        'Total Amount',
        'Status',
        'Payment Date'
    ];
    
    const rows = invoices.map(invoice => [
        invoice.invoiceNumber,
        invoice.studentName,
        invoice.studentId,
        invoice.parentName,
        invoice.parentPhone,
        invoice.batch,
        invoice.issueDate,
        invoice.dueDate,
        invoice.subtotal,
        invoice.taxTotal,
        invoice.totalAmount,
        invoice.paid ? 'Paid' : 'Unpaid',
        invoice.paymentDate || ''
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    showToast('Invoices exported successfully!', 'success');
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast p-4 rounded-md shadow-lg mb-4 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    toast.innerHTML = `
        <div class="flex items-center">
            <div class="flex-1">${message}</div>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 500);
    }, 5000);
}

// Debounce function for auto-save
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
