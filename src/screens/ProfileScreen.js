import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'
import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'


function ProfileScreen({ history }) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user || !user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, history, userInfo, user, success])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setMessage('Password is not match')
        } else {
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
            setMessage('')
        }
    }

    return (
        <div>
            <div className="row mt-5 mb-4">
                <div className="card col-md-3" style={{borderRadius:'20px'}}>
                    <h4 className='mt-3 mb-3'>My Profile</h4>

                    {message && <Message variant='danger'>{message}</Message>}
                    {error && <Message variant='danger'>{error}</Message>}
                    {loading && <Loader />}

                    <form onSubmit={submitHandler}>
                        <label>Name</label>
                        <input
                            className='form-control mb-3'
                            type="text"
                            placeholder='Your Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label>Email Address</label>
                        <input
                            className='form-control mb-3'
                            type="text"
                            placeholder='Your Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Password</label>
                        <input
                            className='form-control mb-3'
                            type="password"
                            placeholder='Your Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label>Confirm Password</label>
                        <input
                            className='form-control mb-3'
                            type="password"
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className='d-flex justify-content-center pt-3 mb-3'>
                            <button type='submit' className='btn btn-primary'>Register</button>
                        </div>

                    </form>
                </div>
                <div className="col-md-9">
                    <h4 className='mt-3'>My Orders</h4>

                    {loadingOrders ? (
                        <Loader />
                    ) : errorOrders ? (
                        <Message variant='danger'>{errorOrders}</Message>
                    ) : (
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Paid</th>
                                    <th scope="col">Delivered</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <th scope="row">{order._id}</th>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}</td>
                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button className='btn-sm'>Details</Button>
                                            </LinkContainer>
                                        </td>
                                        <td>{order.id}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileScreen
