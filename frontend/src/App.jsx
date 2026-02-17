import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Button, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import InvoiceDetails from './pages/InvoiceDetails';
import { createSampleInvoice } from './services/api';

function App() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateSample = async () => {
        try {
            setLoading(true);
            setError('');
            console.log(' Creating sample invoice...');
            
            const response = await createSampleInvoice();
            console.log(' Success:', response.data);
            
            if (response.data && response.data.invoiceId) {
                toast.success(' Sample invoice created!');
                window.location.href = `/invoices/${response.data.invoiceId}`;
            }
        } catch (error) {
            console.error('Error details:', error);
            
            if (error.response?.data?.details) {
                const errors = Object.entries(error.response.data.details)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join('\n');
                setError(`Validation failed:\n${errors}`);
            } else {
                setError(error.response?.data?.error || 'Failed to create sample invoice');
            }
            toast.error('Failed to create sample invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BrowserRouter>
            <Navbar bg="primary" variant="dark" className="mb-4">
                <Container>
                    <Navbar.Brand href="/"> Invoice Manager</Navbar.Brand>
                    <Button 
                        variant="light" 
                        size="sm"
                        onClick={handleCreateSample}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : ' Create Sample Invoice'}
                    </Button>
                </Container>
            </Navbar>

            <Container>
                {error && (
                    <Alert variant="danger" className="mb-4">
                        <Alert.Heading>Error</Alert.Heading>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
                    </Alert>
                )}
                
                <Routes>
                    <Route path="/invoices/:id" element={<InvoiceDetails />} />
                    <Route path="/" element={
                        <div className="text-center mt-5">
                            <h2> Welcome to Invoice Manager</h2>
                            <p className="text-muted">
                                Click the "Create Sample Invoice" button above to get started!
                            </p>
                        </div>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Container>

            <ToastContainer position="bottom-right" />
        </BrowserRouter>
    );
}

export default App;