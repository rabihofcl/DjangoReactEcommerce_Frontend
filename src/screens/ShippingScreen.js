import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from '../actions/cartActions'

function ShippingScreen({ history }) {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        history.push('/payment')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h3 className='d-flex justify-content-center'>Shipping Address</h3>
            <form onSubmit={submitHandler}>
                <label>Address</label>
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Your Address"
                    value={address ? address : ''}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />

                <label>City</label>
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Your City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />

                <label>Postal Code</label>
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Your Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                />

                <label>Country</label>
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Your Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />

                <div className="d-flex justify-content-center pt-3 mb-3">
                    <button type="submit" className="btn btn-primary">
                        Continue
                    </button>
                </div>
            </form>
        </FormContainer>
    );
}

export default ShippingScreen;
