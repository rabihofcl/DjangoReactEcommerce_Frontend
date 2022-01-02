import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

function CartScreen({ match, location, history }) {
    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        history.push('/login?redirect=shipping')
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-9">
                    <p className='px-2 pt-3 fs-4 fw-bold' >SHOPPING CART</p>

                    {cartItems.length === 0 ? (
                    <Message variant='info'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </Message>
                    ) : (
                        <div className='list-group'>
                            {cartItems.map(item => (
                                <div key={item.product} className="row  p-3 mb-2 shadow-sm rounded" style={{height: '130px'}}>
                                    <div className="col-md-2 col-2">
                                        <img src={item.image} alt={item.name}  className='img-fluid rounded' />
                                    </div>
                                    <div className="col-md-3 col-3">
                                        <Link style={{ textDecoration: 'none', color: 'black' }} to={`/product/${item.product}`}><p >{item.name}</p></Link>
                                    </div>
                                    <div className="col-md-2 col-3">
                                        ${item.price}
                                    </div>
                                    <div className="col-md-3 col-3">
                                        {item.countInStock > 0 && (
                                                    <form action="">
                                                        <select className='form-select' value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                                            {
                                                                [...Array(item.countInStock).keys()].map((x) => (
                                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </form>
                                        )}
                                    </div>
                                    <div className="col-md-2 col-1">
                                        <i onClick={() => removeFromCartHandler(item.product)} className="far fa-trash-alt button" type='button'></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-md-3">
                <p className='px-2 pt-3 fs-4 fw-bold' >SUBTOTAL</p>
                    <div className="row card m-2 p-2">
                        <p>Items({cartItems.reduce((acc, item) => acc + item.qty, 0)})</p>
                        <p>Total Amount:   <strong>$  {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</strong> </p>                    
                        
                        <button disabled={cartItems.length === 0} onClick={checkoutHandler} className='btn btn-secondary'>Proceed To Checkout</button>
                    </div>
                    
                </div>

            </div>
        </div>
    )
}

export default CartScreen
