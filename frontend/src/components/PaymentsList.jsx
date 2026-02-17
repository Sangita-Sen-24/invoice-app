import { useState } from 'react';
import { Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { addPayment } from '../services/api';
import { toast } from 'react-toastify';

function PaymentsList({ payments, invoiceId, onPaymentAdded, balanceDue }) {
    const [showModal, setShowModal] = useState(false);
    const [paymentData, setPaymentData] = useState({
        amount: '',
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: 'CARD'
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleChange = (e) => {
        setPaymentData({
            ...paymentData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            const amount = parseFloat(paymentData.amount);
            
            if (isNaN(amount) || amount <= 0) {
                toast.error('Please enter a valid amount');
                return;
            }

            if (amount > balanceDue) {
                toast.error(`Amount cannot exceed balance due: ${formatCurrency(balanceDue)}`);
                return;
            }

            const response = await addPayment(invoiceId, paymentData);
            toast.success('Payment added successfully!');
            setShowModal(false);
            setPaymentData({
                amount: '',
                paymentDate: format(new Date(), 'yyyy-MM-dd'),
                paymentMethod: 'CARD'
            });
            onPaymentAdded(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add payment');
        }
    };

    return (
        <>
            <Card className="shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Payment History</h5>
                    {balanceDue > 0 && (
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => setShowModal(true)}
                        >
                            + Add Payment
                        </Button>
                    )}
                </Card.Header>
                <Card.Body>
                    {payments.length === 0 ? (
                        <p className="text-muted text-center py-3">No payments yet</p>
                    ) : (
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Method</th>
                                    <th className="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment._id}>
                                        <td>{format(new Date(payment.paymentDate), 'PPP')}</td>
                                        <td>{payment.paymentMethod}</td>
                                        <td className="text-end text-success">
                                            + {formatCurrency(payment.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={paymentData.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                min="0.01"
                                step="0.01"
                                autoFocus
                            />
                            <Form.Text className="text-muted">
                                Max amount: {formatCurrency(balanceDue)}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Payment Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="paymentDate"
                                value={paymentData.paymentDate}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Select
                                name="paymentMethod"
                                value={paymentData.paymentMethod}
                                onChange={handleChange}
                            >
                                <option value="CASH">Cash</option>
                                <option value="CARD">Card</option>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                <option value="CHEQUE">Cheque</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PaymentsList;