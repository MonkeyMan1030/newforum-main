import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Routes from './Routes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App 