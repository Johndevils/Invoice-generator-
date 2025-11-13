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
