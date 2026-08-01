import { createBrowserRouter, Link, Outlet } from 'react-router-dom'
import FaceExpression from './features/expression/components/FaceExpression'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'

const RootLayout = () => (
  <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', background: '#111827', color: 'white' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
      <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
    </nav>

    <main style={{ padding: '1.5rem' }}>
      <Outlet />
    </main>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <FaceExpression /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
])

export default router
