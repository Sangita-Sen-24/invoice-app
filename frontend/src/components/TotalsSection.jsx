import { Card, Row, Col } from 'react-bootstrap';

function TotalsSection({ summary }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <Row className="mb-4">
            <Col md={4}>
                <Card className="shadow-sm text-center">
                    <Card.Body>
                        <h6 className="text-muted mb-2">Total</h6>
                        <h4 className="text-primary">{formatCurrency(summary.total)}</h4>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="shadow-sm text-center">
                    <Card.Body>
                        <h6 className="text-muted mb-2">Amount Paid</h6>
                        <h4 className="text-success">{formatCurrency(summary.amountPaid)}</h4>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="shadow-sm text-center">
                    <Card.Body>
                        <h6 className="text-muted mb-2">Balance Due</h6>
                        <h4 className={summary.balanceDue > 0 ? 'text-danger' : 'text-success'}>
                            {formatCurrency(summary.balanceDue)}
                        </h4>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default TotalsSection;