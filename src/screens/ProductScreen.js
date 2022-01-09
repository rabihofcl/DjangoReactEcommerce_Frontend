import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

function ProductScreen({ match, history }) {

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {
        loading: loadingProductReview,
        error: errorProductReview,
        success: successProductReview,
    } = productReviewCreate

    useEffect(() => {
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(listProductDetails(match.params.id))

    }, [dispatch, match, successProductReview])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(
            match.params.id, {
            rating,
            comment
        }
        ))
    }



    return (
        <div>
            <div className="row">
                <div className="col-md-2">
                    <Link to='/' className='btn btn-light mt-3 text-start'><i className="fas fa-chevron-left align-text-bottom"></i>&#160; <span className='fs-6 align-middle'>Back</span></Link>
                </div>
            </div>

            {loading ?
                <Loader />
                : error ?
                    <Message variant='danger'>{error}</Message>
                    : (
                        <div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="row">
                                        <img src={product.image} alt="" className='img-fluid rounded' />
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-3 col-3">
                                            <img src={product.image} alt="" className='img-fluid' />
                                        </div>
                                        <div className="col-md-3 col-3">
                                            <img src={product.image} alt="" className='img-fluid' />
                                        </div>
                                        <div className="col-md-3 col-3">
                                            <img src={product.image} alt="" className='img-fluid' />
                                        </div>
                                        <div className="col-md-3 col-3">
                                            <img src={product.image} alt="" className='img-fluid' />
                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-6 pt-5 ps-3">
                                    <div className="row">
                                        <h4>{product.name}</h4>
                                        <p>{product.brand}</p>
                                    </div>
                                    <div className="row mt-2">
                                        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                                    </div>
                                    <div className="row mt-2">
                                        <p> <strong className='fs-4'> Price: ${product.price}</strong></p>
                                    </div>
                                    <div className="row">
                                        <p>Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                                    </div>

                                    {product.countInStock > 0 && (
                                        <div className="row mb-3">
                                            <div className="col-md-6" style={{ display: "flex", alignItems: "center" }}>
                                                <p className='pe-2 align-text-bottom'>Quantity: </p>
                                                <form action="">
                                                    <select className='form-select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {
                                                            [...Array(product.countInStock).keys()].map((x) => (
                                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </form>
                                            </div>
                                        </div>
                                    )}


                                    <div className="row ">
                                        <div className="col-md-6 col-12">
                                            <button onClick={addToCartHandler} className='btn btn-primary' disabled={product.countInStock === 0}>Add to Cart</button>
                                            <button className='btn btn-primary ms-5' disabled={product.countInStock === 0}>Add to Cart</button>
                                        </div>
                                    </div>
                                    <div className="row pt-2">
                                        <p>{product.description}</p>
                                    </div>
                                </div>
                            </div>

                            <Row>
                                <Col md={6}>
                                    <h4>Reviews</h4>
                                    {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

                                    <ListGroup variant='flush'>
                                        {product.reviews.map((review) => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} color='#f8e825' />
                                                <p>{review.createdAt.substring(0, 10)}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}

                                        <ListGroup.Item>
                                            <h4>Write a review</h4>

                                            {loadingProductReview && <Loader />}
                                            {successProductReview && <Message variant='success'>Review Submitted</Message>}
                                            {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                                            {userInfo ? (
                                                <Form onSubmit={submitHandler}>
                                                    <Form.Group controlId='rating'>
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                        >
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1 - Poor</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group controlId='comment'>
                                                        <Form.Label>Review</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            row='5'
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                        ></Form.Control>
                                                    </Form.Group>

                                                    <Button
                                                        disabled={loadingProductReview}
                                                        type='submit'
                                                        variant='primary'
                                                    >
                                                        Submit
                                                    </Button>

                                                </Form>
                                            ) : (
                                                    <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                                                )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </div>
                    )
            }



        </div>
    )
}

export default ProductScreen
