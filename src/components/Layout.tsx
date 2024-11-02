import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="layout">
      <header>
        <div className="container">
          <nav className="nav">
            <Link to="/" className="logo">
              YourSite
            </Link>
            
            <div className="nav-links">
              <Link to="/posts">Posts</Link>
              {user ? (
                <>
                  <Link to="/create">Create Post</Link>
                  <button onClick={handleLogout} className="btn-secondary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About</h3>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
            <div className="footer-section">
              <h3>Community</h3>
              <Link to="/posts">Posts</Link>
              <Link to="/guidelines">Guidelines</Link>
              <Link to="/faq">FAQ</Link>
            </div>
            <div className="footer-section">
              <h3>Legal</h3>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} YourSite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 