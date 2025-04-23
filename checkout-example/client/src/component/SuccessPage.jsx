import React from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SuccessPage = () => {
    const query = useQuery();
    const orderId = query.get('orderId');

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Alert variant="success" className="text-center">
                        <h4 className="mb-3">Order Successful!</h4>
                        {orderId ? (
                            <p>Your Order ID is: <strong>{orderId}</strong></p>
                        ) : (
                            <p>No Order ID found in the URL.</p>
                        )}
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
};

export default SuccessPage;
