import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'



function UserEditScreen({ match, history }) {

    const userId = match.params.id

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate

    useEffect(() => {

        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userlist')
        } else {

            if (!user.name || user._id !== Number(userId)) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }

    }, [user, userId, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: user._id, name, email, isAdmin }))
    }



    return (
        <div>
            <Link to='/admin'>
                Go Back
            </Link>


            <FormContainer >
                <h3 className='d-flex justify-content-center'>Edit User</h3>
                
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                
                {loading ?
                    <Loader />
                    : error ?
                        <Message variant='danger'>{error}</Message>
                        : (
                            <form onSubmit={submitHandler}>
                                <label>Name</label>
                                <input
                                    className='form-control mb-3'
                                    type="text"
                                    placeholder='Your Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}

                                />

                                <label>Email Address</label>
                                <input
                                    className='form-control mb-3'
                                    type="text"
                                    placeholder='Your Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}

                                />

                                <label>Is Admin</label>
                                <input
                                    className='form-control mb-3'
                                    type="checkbox"
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.value)}

                                />

                                <div className='d-flex justify-content-center pt-3 mb-3'>
                                    <button type='submit' className='btn btn-primary'>Update</button>
                                </div>

                            </form>
                        )}


            </FormContainer>
        </div>

    )
}

export default UserEditScreen
