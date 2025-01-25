import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import JwtApi from '../jwt/JwtApi'
import OverLoader from '../utilities/OverLoader'
import { useDispatch } from 'react-redux'
import {setLoginInfo} from '../redux/slices/userSlice'
export default function LoginPage({ isLogin = false }) {
    const Navigate = useNavigate()
    const dispatch = useDispatch()
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        Confirmpassword: "",
        name: ""
    })
    const [useLoader, setLoader] = useState(false)
    const changeData = (e) => {
        const val = e.target.value
        const name = e.target.name
        setUserData((elm) => ({ ...elm, [name]: val }))
    }
    const handleSubmit = () => {
        setLoader(true)
        JwtApi.post(`/users/${isLogin ? "login" : "signup"}`, userData)
            .then((res) => {
                console.log(res)

                if (res.user) {
                    dispatch(setLoginInfo(res.user))
                    Navigate("/")
                    
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setLoader(false))
    }
    return (
        <div>
            {
                useLoader && <OverLoader />
            }
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow px-4 py-1" style={{ width: "100%", maxWidth: "400px" }}>
                    <h3 className="text-center mb-3">{isLogin ? 'Login' : 'Signup'}</h3>
                    <div>
                        {
                            !isLogin && <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="name" className="form-control" id="name" name="name" onChange={changeData} placeholder="Enter your name" required />
                            </div>}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" name="email" onChange={changeData} placeholder="Enter your email" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" onChange={changeData} placeholder="Enter your password" required />
                        </div>
                        {
                            !isLogin &&
                            <div className="mb-3">
                                <label htmlFor="Confirmpassword" className="form-label">Confirm Confirm</label>
                                <input type="Confirmpassword" className="form-control" id="Confirmpassword" name="Confirmpassword" onChange={changeData} placeholder="Enter Confirm password" required />
                            </div>
                        }
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{isLogin ? 'Login' : 'Signup'}</button>
                        </div>
                    </div>
                    {
                        isLogin ? <p className="text-center mt-3">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </p> : <p className="text-center mt-3">
                            Already have an account? <Link to="/login">Login</Link></p>
                    }

                </div>
            </div></div>
    )
}
