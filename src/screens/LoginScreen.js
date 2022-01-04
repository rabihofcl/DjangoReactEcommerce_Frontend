import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

function LoginScreen({ location, history }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/' 

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    useEffect(() => {
        if(userInfo){
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }


    return (
        <FormContainer >
            <h3 className='d-flex justify-content-center'>Sign In</h3> 

            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <form onSubmit={submitHandler}>
                <label htmlFor="">Email Address</label>
                <input
                    className='form-control mb-3'
                    type="text"
                    placeholder='Your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="">Password</label>
                <input
                    className='form-control mb-3'
                    type="password"
                    placeholder='Your Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className='d-flex justify-content-center pt-3 mb-3'>
                    <button type='submit' className='btn btn-primary'>Sign In</button>
                </div>
                
            </form>


            <div className="row">
                <p>New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}> Register </Link> </p>
            </div>
        </FormContainer>
    )
}

export default LoginScreen
