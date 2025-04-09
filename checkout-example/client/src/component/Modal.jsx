import { paymentFlow } from '@commercetools/checkout-browser-sdk';
import axios from 'axios';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { CURRENCY_CODE } from '../constants';

export async function fetchSessionInfo(data) {
  try {
    const response = await axios({
      url: 'http://localhost:8085/sessions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // ...(token ?? {}),
      },
      data,
    })
    console.log("🚀 ~ fetchSessionInfo ~ response:", response);

    if (response.status == 200) {
      const { data } = response?.data
      console.log("🚀 ~ fetchSessionInfo ~ data:", data)
      return data;
    }
  } catch (e) {
    console.error("🚀 ~ fetchSessionInfo ~ error:", e)
    throw e
  }
}

export const ModalView = ({ cartId, data, show, handleClose }) => {

  const handlePayment = async () => {
    const response = await fetchSessionInfo({ cartId });
    console.log("🚀 ~ handlePayment ~ response:", response);
    paymentFlow({
      projectKey: response.projectKey,
      region: response.region,
      sessionId: response.sessionId,
      logInfo: true,
      onInfo: (message) => {
        // alert("Success", message)
        console.log(`Payment flow messages`, message);
        if (message.code === 'checkout_completed') {
          const {
            order: { id },
          } = message.payload;
          window.location.href = '/thank-you?orderId=' + id;
        }
      },
      logWarn: true,
      logError: true,
    });
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Products Checkout...</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '350px', overflow: 'scroll' }}>
          {
            data?.length > 0 &&
            data.map((item, index) => (
              <div key={index} style={{ padding: '10px', ...(index != data.length - 1) ? { borderBottom: '0.5px solid #ccc' } : null }}>
                <div style={{ fontWeight: '500' }}>{index + 1}. {item?.name?.en}</div>
                <div>{CURRENCY_CODE[item.totalPrice.currencyCode] + Number.parseFloat(item.totalPrice.centAmount / 100).toFixed(2).toString().replace('.', ',')}</div>
              </div>
            ))
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            Proceed To Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
