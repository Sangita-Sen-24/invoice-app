import { Badge, Card } from 'react-bootstrap';
import { format } from 'date-fns';

function InvoiceHeader({ invoice }) {
    console.log('InvoiceHeader received:', invoice); 
    
    const getStatusColor = (status) => {
        const colors = {
            'DRAFT': 'secondary',
            'SENT': 'primary',
            'PAID': 'success',
            'OVERDUE': 'danger',
            'ARCHIVED': 'dark'
        };
        return colors[status] || 'light';
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <div className="d-flex align-items-center mb-3">
                            <h2 className="mb-0">{invoice?.invoiceNumber}</h2>
                            {invoice?.status && (
                                <span className={`badge bg-${getStatusColor(invoice.status)} ms-3`}>
                                    {invoice.status}
                                </span>
                            )}
                        </div>
                        <h5 className="text-muted mb-3">{invoice?.customerName}</h5>
                        <div className="d-flex gap-3">
                            <div>
                                <small className="text-muted d-block">Issue Date</small>
                                <strong>{invoice?.issueDate ? format(new Date(invoice.issueDate), 'PPP') : ''}</strong>
                            </div>
                            <div>
                                <small className="text-muted d-block">Due Date</small>
                                <strong>{invoice?.dueDate ? format(new Date(invoice.dueDate), 'PPP') : ''}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default InvoiceHeader;