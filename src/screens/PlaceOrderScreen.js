import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'


function PlaceOrderScreen({ history }) {

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, error, success } = orderCreate

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    
    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = Number((0.082) * cart.itemsPrice).toFixed(2)

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    if (!cart.paymentMethod){
        history.push('/payment')
    }

    useEffect(() => {
        if(success){
            history.push(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }
    }, [success, history])

    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.itemsPrice,
            totalPrice: cart.totalPrice,
        }))
    }

    return (
        <div>
            <FormContainer>
                <CheckoutSteps step1 step2 step3 step4 />
            </FormContainer>

            <div className="row">
                <div className="col-md-8">

                    <div className="card mb-3" style={{ borderRadius: '20px' }}>
                        <div className="card-body">
                            <h4>SHIPPING:</h4>

                            <p>
                                <strong>Shipping: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}
                                {'  '}
                                {cart.shippingAddress.postalCode},
                                {'  '}
                                {cart.shippingAddress.country}
                            </p>
                        </div>
                    </div>

                    <div className="card mb-4" style={{ borderRadius: '20px' }}>
                        <div className="card-body">
                            <h4>PAYMENT METHOD:</h4>

                            <p>
                                <strong>Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </div>
                    </div>

                    <div className="card mb-3" style={{ borderRadius: '20px' }}>
                        <div className="card-body">
                            <h4>CART ITEMS:</h4>

                            {cart.cartItems.length === 0 ? <Message variant='info'>
                                Your cart is empty
                            </Message> : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col className="col-md-2">
                                                    <img src={item.image} alt="" height='100px' width='100px' />
                                                </Col>
                                                <Col>
                                                    <Link style={{ textDecoration: 'none', color: 'black' }} to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col className="col-md-3">
                                                    {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
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
                    <div className="card mb-3 bg-light" style={{ borderRadius: '20px' }}>
                        <div className="card-body">
                            <h4>ORDER SUMMARY:</h4>
                                
                            <div className="row mt-4">
                                <div className="col">
                                    items:
                                </div>
                                <div className="col">
                                    $ {cart.itemsPrice}
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    Shipping:
                                </div>
                                <div className="col">
                                    $ {cart.shippingPrice}
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    Tax:
                                </div>
                                <div className="col">
                                    $ {cart.taxPrice}
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    Total:
                                </div>
                                <div className="col">
                                    $ {cart.totalPrice}
                                </div>
                            </div>

                            <div>
                                {error && <Message variant='danger'>{error}</Message>}
                            </div>

                            <div className="row mt-3">
                                <button
                                    className='btn btn-primary m-auto'
                                    style={{borderRadius:'20px'}}
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PlaceOrderScreen




