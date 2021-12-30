import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails } from '../actions/productActions'

function ProductScreen({ match }) {
    const dispatch = useDispatch();
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    useEffect(() => {
        dispatch(listProductDetails(match.params.id))
    }, [dispatch, match])

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
                    <div className="row ">
                        <div className="col-md-6 col-12 d-flex">
                            <button className='btn btn-primary' disabled={product.countInStock === 0}>Add to Cart</button>
                            <button className='btn btn-primary ms-5' disabled={product.countInStock === 0}>Add to Cart</button>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
                        )
            }


            
        </div>
    )
}

export default ProductScreen
