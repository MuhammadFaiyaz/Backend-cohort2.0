import AppRoute from "./AppRoute"
import { AuthProvider } from "./features/auth/auth.context"
import "./style.scss"
const App = () => {
  return (
    <>
    <AuthProvider>
      <AppRoute/>
    </AuthProvider>
    </>
  )
}

export default App