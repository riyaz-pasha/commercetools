import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { SIGNUP_USER_SUCCESS, signupUser } from "../../store/auth/authAction"; // make sure this action exists


const Signup = ({ signupUser }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const handleChange = ({ target }) => {
        const { name, value } = target
        setUser({ ...user, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        try {
            signupUser(user)
                .then(({ type, payload }) => {
                    const { user, error } = payload
                    if (type === SIGNUP_USER_SUCCESS) {
                        toast.success('Signed up successfully')
                        navigate('/login')
                    } else {
                        toast.error(error.message)
                    }
                })
        } catch (error) {
            toast.error(error.message)
            console.error(error)
        }
    }

    return (
        <div className="col-2 mx-auto col-md-6 col-lg-3">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="signupFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" name="firstName" onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="signupLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" name="lastName" onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="signupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="signupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} required />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Sign Up
                </Button>
            </Form>
            <ToastContainer closeOnClick autoClose={3000} />
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    signupUser: (user) => dispatch(signupUser(user))
})

export default connect(null, mapDispatchToProps)(Signup)
