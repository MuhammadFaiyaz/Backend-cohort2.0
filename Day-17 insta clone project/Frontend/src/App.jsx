import "./style.scss"
import AppRoutes from './AppRoute'
import { AuthProvider } from "./features/auth/auth.context.jsx"

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App