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
