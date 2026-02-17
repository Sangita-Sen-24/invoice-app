const Invoice = require('../models/Invoice');
const InvoiceLine = require('../models/InvoiceLine');
const Payment = require('../models/Payment');


exports.createSampleInvoice = async (req, res) => {
    try {
        console.log(' Creating sample invoice...');
        
        console.log(' Invoice model loaded:', !!Invoice);
        console.log(' InvoiceLine model loaded:', !!InvoiceLine);
        
        const timestamp = Date.now();
        const invoiceNumber = `INV-${timestamp}`;
        
        console.log(' Creating invoice with number:', invoiceNumber);
        
        const invoice = new Invoice({
            invoiceNumber: invoiceNumber,
            customerName: 'John Doe',
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        
        console.log(' Saving invoice...');
        const savedInvoice = await invoice.save();
        console.log(' Invoice saved with ID:', savedInvoice._id);

        const lineItemsData = [
            {
                invoiceId: savedInvoice._id,
                description: 'Web Development Services',
                quantity: 10,
                unitPrice: 100,
                lineTotal: 10 * 100
            },
            {
                invoiceId: savedInvoice._id,
                description: 'UI/UX Design',
                quantity: 5,
                unitPrice: 150,
                lineTotal: 5 * 150
            }
        ];

        console.log(' Creating', lineItemsData.length, 'line items...');
        
        for (let item of lineItemsData) {
            console.log('Creating line item:', item.description);
            const lineItem = new InvoiceLine(item);
            const saved = await lineItem.save();
            console.log(' Line item saved with ID:', saved._id);
        }

        // Calculate total
        const total = lineItemsData.reduce((sum, item) => sum + item.lineTotal, 0);
        console.log(' Total calculated:', total);
        
        // Update invoice with total
        savedInvoice.total = total;
        savedInvoice.balanceDue = total;
        await savedInvoice.save();

        console.log(' Sample invoice created successfully!');
        console.log(' Invoice ID:', savedInvoice._id);
        
        res.status(201).json({ 
            success: true,
            message: 'Sample invoice created successfully',
            invoiceId: savedInvoice._id,
            invoiceNumber: savedInvoice.invoiceNumber
        });

    } catch (error) {
        console.error('ERROR in createSampleInvoice:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors 
            });
        }
        
        res.status(500).json({ 
            error: error.message,
            message: 'Failed to create sample invoice'
        });
    }
};


exports.getInvoiceDetails = async (req, res) => {
    try {
        console.log('Getting invoice details for ID:', req.params.id);
        const { id } = req.params;
        
        
        if (id === 'sample') {
            return res.status(400).json({ message: 'Invalid invoice ID' });
        }
        
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            console.log(' Invoice not found:', id);
            return res.status(404).json({ message: 'Invoice not found' });
        }

        const lineItems = await InvoiceLine.find({ invoiceId: id });
        const payments = await Payment.find({ invoiceId: id }).sort({ paymentDate: -1 });

        const total = lineItems.reduce((sum, item) => {
            const lineTotal = item.lineTotal || (item.quantity * item.unitPrice);
            return sum + lineTotal;
        }, 0);
        
        const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const balanceDue = total - amountPaid;

        invoice.total = total;
        invoice.amountPaid = amountPaid;
        invoice.balanceDue = balanceDue;
        await invoice.save();

        console.log('Invoice details retrieved successfully');
        
        res.json({
            invoice,
            lineItems,
            payments,
            summary: {
                total,
                amountPaid,
                balanceDue
            }
        });
    } catch (error) {
        console.error(' Error in getInvoiceDetails:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.addPayment = async (req, res) => {
    try {
        console.log(' Adding payment for invoice:', req.params.id);
        const { id } = req.params;
        const { amount, paymentDate, paymentMethod } = req.body;

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        const payments = await Payment.find({ invoiceId: id });
        const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const lineItems = await InvoiceLine.find({ invoiceId: id });
        const total = lineItems.reduce((sum, item) => sum + (item.lineTotal || (item.quantity * item.unitPrice)), 0);
        const balanceDue = total - amountPaid;

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        if (amount > balanceDue) {
            return res.status(400).json({ 
                message: `Payment amount (${amount}) exceeds balance due (${balanceDue})` 
            });
        }

        const payment = new Payment({
            invoiceId: id,
            amount,
            paymentDate: paymentDate || new Date(),
            paymentMethod: paymentMethod || 'CARD'
        });
        await payment.save();

        const newAmountPaid = amountPaid + amount;
        const newBalanceDue = total - newAmountPaid;
        
        invoice.amountPaid = newAmountPaid;
        invoice.balanceDue = newBalanceDue;
        
        if (newBalanceDue === 0) {
            invoice.status = 'PAID';
        }
        
        await invoice.save();

        console.log('Payment added successfully');
        
        res.status(201).json({
            message: 'Payment added successfully',
            payment,
            invoice: {
                amountPaid: newAmountPaid,
                balanceDue: newBalanceDue,
                status: invoice.status
            }
        });
    } catch (error) {
        console.error('Error in addPayment:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.archiveInvoice = async (req, res) => {
    try {
        console.log('Archiving invoice:', req.params.id);
        const { id } = req.params;
        
        const invoice = await Invoice.findByIdAndUpdate(
            id,
            { isArchived: true, status: 'ARCHIVED' },
            { new: true }
        );

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        console.log(' Invoice archived successfully');
        res.json({ message: 'Invoice archived successfully', invoice });
    } catch (error) {
        console.error(' Error in archiveInvoice:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.restoreInvoice = async (req, res) => {
    try {
        console.log(' Restoring invoice:', req.params.id);
        const { id } = req.params;
        
        const invoice = await Invoice.findByIdAndUpdate(
            id,
            { isArchived: false, status: 'SENT' },
            { new: true }
        );

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        console.log('Invoice restored successfully');
        res.json({ message: 'Invoice restored successfully', invoice });
    } catch (error) {
        console.error(' Error in restoreInvoice:', error);
        res.status(500).json({ error: error.message });
    }
};