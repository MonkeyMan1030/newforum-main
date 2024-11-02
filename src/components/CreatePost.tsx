import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login', { state: { returnTo: '/create' } })
      }
    }
    checkAuth()
  }, [navigate])

  useEffect(() => {
    setCharCount(content.length)
  }, [content])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Must be logged in to post')

      const { error: uploadError } = await supabase
        .from('posts')
        .insert([
          { 
            title: title.trim(),
            content: content.trim(),
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ])

      if (uploadError) throw uploadError

      navigate('/posts')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post-container">
      <h1>Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={100}
            placeholder="Enter your post title"
            aria-describedby="titleHelp"
            className="input-field"
          />
          <small id="titleHelp">
            {title.length}/100 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={6}
            placeholder="Write your post content here..."
            maxLength={1000}
            className="input-field"
          />
          <small className="char-count">
            {charCount}/1000 characters
          </small>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="button-group">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating Post...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  )
} 