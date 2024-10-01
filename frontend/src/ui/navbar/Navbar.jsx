import React from 'react'
import './navbar.css'

export default function Navbar() {
  return (
    <div className="Navbar">
      <div className="left">
        <span className="logo">Books Management</span>
      </div>
      <div className="right">
        <ul>
          <li>Register</li>
          <li>Login</li>
        </ul>
      </div>
    </div>
  )
}
