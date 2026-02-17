import { Table } from 'react-bootstrap';

function LineItemsTable({ lineItems }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="mb-4">
            <h5 className="mb-3">Line Items</h5>
            <Table striped bordered hover responsive>
                <thead className="bg-light">
                    <tr>
                        <th>Description</th>
                        <th className="text-end">Quantity</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Line Total</th>
                    </tr>
                </thead>
                <tbody>
                    {lineItems.map((item) => (
                        <tr key={item._id}>
                            <td>{item.description}</td>
                            <td className="text-end">{item.quantity}</td>
                            <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                            <td className="text-end">{formatCurrency(item.lineTotal)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default LineItemsTable;