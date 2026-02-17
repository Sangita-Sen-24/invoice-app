import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { getInvoiceDetails } from '../services/api';

import InvoiceHeader from '../components/InvoiceHeader';
import LineItemsTable from '../components/LineItemsTable';
import TotalsSection from '../components/TotalsSection';
import PaymentsList from '../components/PaymentsList';

function InvoiceDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [invoiceData, setInvoiceData] = useState(null);

    useEffect(() => {
        fetchInvoiceDetails();
    }, [id]);

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true);
            console.log('Fetching invoice:', id);
            const response = await getInvoiceDetails(id);
            console.log('API Response:', response.data);
            setInvoiceData(response.data);
            setError('');
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to load invoice details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading invoice details...</p>
            </Container>
        );
    }

    if (error || !invoiceData) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error || 'Invoice not found'}</Alert>
            </Container>
        );
    }

    const { invoice, lineItems, payments, summary } = invoiceData;

    return (
        <Container className="py-4">
            <InvoiceHeader invoice={invoice} />
            <LineItemsTable lineItems={lineItems} />
            <TotalsSection summary={summary} />
            <PaymentsList 
                payments={payments}
                invoiceId={id}
                onPaymentAdded={fetchInvoiceDetails}
                balanceDue={summary.balanceDue}
            />
        </Container>
    );
}

export default InvoiceDetails;