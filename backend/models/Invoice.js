const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'ARCHIVED'],
        default: 'DRAFT'
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    total: {
        type: Number,
        default: 0
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    balanceDue: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);