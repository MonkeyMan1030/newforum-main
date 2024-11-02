import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-description">
          Sign in to your account to continue
        </p>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#007AFF',
                  brandAccent: '#0056b3',
                }
              }
            },
            style: {
              button: { 
                borderRadius: '8px',
                height: '44px',
                fontSize: '16px',
                fontWeight: '600',
              },
              input: {
                borderRadius: '8px',
                height: '44px',
                fontSize: '16px',
              },
              container: {
                maxWidth: '400px',
                margin: '0 auto',
              }
            }
          }}
          providers={['google', 'github', 'apple']}
          socialLayout="horizontal"
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </div>
    </div>
  )
} 