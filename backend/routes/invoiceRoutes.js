const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');


router.post('/sample/create', invoiceController.createSampleInvoice);  
router.get('/:id', invoiceController.getInvoiceDetails);  
router.post('/:id/payments', invoiceController.addPayment);
router.post('/:id/archive', invoiceController.archiveInvoice);
router.post('/:id/restore', invoiceController.restoreInvoice);

module.exports = router;