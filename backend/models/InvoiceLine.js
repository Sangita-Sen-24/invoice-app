const mongoose = require('mongoose');

const invoiceLineSchema = new mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    lineTotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { 
    timestamps: true 
});


module.exports = mongoose.model('InvoiceLine', invoiceLineSchema);