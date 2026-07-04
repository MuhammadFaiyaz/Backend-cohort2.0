import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/form.scss"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault()  
      
  }


  return (
    <main>
      <div className="form-container">
        <h1>Create an account</h1>
        <p>Sign up to start your journey with us.</p>

        <form onSubmit={handleSubmit}>
          <input type="text" onInput={(e) => setUsername(e.target.value)} name="username" value={username} placeholder="Enter username" />
          <input type="email" onInput={(e) => setEmail(e.target.value)} name="username" value={email} placeholder="Enter email" />
          <input type="password" onInput={(e) => setPassword(e.target.value)} name="password" value={password} placeholder="Enter password" />
          <button className="btn primary-btn">Register</button>
        </form>

        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </main>
  )
}

export default Register