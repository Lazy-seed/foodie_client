import React from 'react'
import './page404.css'
export default function Page404() {
    return (
        <div>
            <div className="error-wrapper bg_cover pt-130 pb-130" style={{ backgroundImage: " url(assets/images/bg/error-bg.jpg)" }}>
                <div className="error-content text-center text-white " style={{marginTop:"100px"}}>
                    <span className="number">404</span>
                    <h1>Oops! Page Not Found</h1>
                    <p>It looks like you've encountered a "Page Not Found" error, also known as a 404 error. <br /> This typically happens when the web server cannot locate</p>
                    <div className="error-button">
                        <a href="/" className="theme-btn style-one">Go To Home</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
