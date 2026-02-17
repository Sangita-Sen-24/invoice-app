const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'CARD', 'BANK_TRANSFER', 'CHEQUE'],
        default: 'CARD'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);