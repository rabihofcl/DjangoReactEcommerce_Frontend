import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

function RegisterScreen({ location, history }) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/' 

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    useEffect(() => {
        if(userInfo){
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if(password != confirmPassword){
            setMessage('Password is not match')
        }else{
            dispatch(register(name, email, password))
        }
    }


    return (
        <FormContainer >
            <h3 className='d-flex justify-content-center'>Register</h3> 
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
                    required
                />

                <label>Confirm Password</label>
                <input
                    className='form-control mb-3'
                    type="password"
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <div className='d-flex justify-content-center pt-3 mb-3'>
                    <button type='submit' className='btn btn-primary'>Register</button>
                </div>
                
            </form>


            <div className="row">
                <p>Already registered? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}> Login </Link> </p>
            </div>

        </FormContainer>
    )
}

export default RegisterScreen
