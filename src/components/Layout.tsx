import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Layout({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check and set initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header>
        <div className="container">
          <nav className="nav">
            <a href="/" className="logo">
              YourApp
            </a>
            
            <div className="nav-links">
              <a href="/posts">Posts</a>
              {user ? (
                <>
                  <a href="/create">Create Post</a>
                  <button onClick={handleLogout} className="btn-secondary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login">Login</a>
                  <a href="/register" className="btn-primary">
                    Sign Up
                  </a>
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
          <p>&copy; {new Date().getFullYear()} YourApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 