import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

function OrderScreen({ match, history }) {
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AWjNVmcoy-p4v-rmGHwMjAhEco2wZQpt0ovOkNGbdtiTUmnC2wyji-CCjUt99N7i8utlef3mCyUSHMnA";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo) {
        history.push('/login')
    }

    if (
      !order ||
      successPay ||
      order._id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });

      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h5 className="mt-5">Order: {order._id}</h5>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3" style={{ borderRadius: "20px" }}>
            <div className="card-body">
              <h4>SHIPPING:</h4>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>

              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {"  "}
                {order.shippingAddress.postalCode},{"  "}
                {order.shippingAddress.country}
              </p>
            </div>
            {order.isDelivered ? (
              <Message variant="success">
                Delivered on {order.deliveredAt}
              </Message>
            ) : (
              <Message variant="warning">Not Delivered</Message>
            )}
          </div>

          <div className="card mb-4" style={{ borderRadius: "20px" }}>
            <div className="card-body">
              <h4>PAYMENT METHOD:</h4>

              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
            </div>
            {order.isPaid ? (
              <Message variant="success">Paid on {order.paidAt}</Message>
            ) : (
              <Message variant="warning">Not Paid</Message>
            )}
          </div>

          <div className="card mb-3" style={{ borderRadius: "20px" }}>
            <div className="card-body">
              <h4>ORDER ITEMS:</h4>

              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col className="col-md-2">
                          <img
                            src={item.image}
                            alt=""
                            height="100px"
                            width="100px"
                          />
                        </Col>
                        <Col>
                          <Link
                            style={{ textDecoration: "none", color: "black" }}
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col className="col-md-3">
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card mb-3 bg-light" style={{ borderRadius: "20px" }}>
            <div className="card-body">
              <h4>ORDER SUMMARY:</h4>

              <div className="row mt-4">
                <div className="col">items:</div>
                <div className="col">$ {order.itemsPrice}</div>
              </div>

              <div className="row mt-4">
                <div className="col">Shipping:</div>
                <div className="col">$ {order.shippingPrice}</div>
              </div>

              <div className="row mt-4">
                <div className="col">Tax:</div>
                <div className="col">$ {order.taxPrice}</div>
              </div>

              <div className="row mt-4">
                <div className="col">Total:</div>
                <div className="col">$ {order.totalPrice}</div>
              </div>
            </div>

            {!order.isPaid && (
              <ListGroup.Item>
                {loadingPay && <Loader />}

                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}
                  />
                )}
              </ListGroup.Item>
            )}
          </div>
          {loadingDeliver && <Loader />}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <ListGroup.Item>
              <Button
                type="button"
                className="btn btn-block"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </Button>
            </ListGroup.Item>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;
