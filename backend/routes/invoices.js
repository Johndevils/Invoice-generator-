const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Helper function to generate invoice number
const generateInvoiceNumber = () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `COACH-${dateStr}-${randomNum}`;
};

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const { search, paid } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (paid !== undefined) {
      query.paid = paid === 'true';
    }
    
    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new invoice
router.post('/', async (req, res) => {
  try {
    const invoiceData = {
      ...req.body,
      invoiceNumber: generateInvoiceNumber()
    };
    
    const invoice = new Invoice(invoiceData);
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) an invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    Object.assign(invoice, req.body);
    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    await invoice.remove();
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH to mark as paid
router.patch('/:id/mark-paid', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    invoice.paid = true;
    invoice.paymentDate = new Date();
    await invoice.save();
    
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
