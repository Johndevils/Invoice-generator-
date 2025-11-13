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
