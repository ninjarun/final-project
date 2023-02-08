import { useState } from 'react'
import { loginAsync, registerAsync, selectUser } from "../login/loginSlice"
import { useAppDispatch } from "../../app/hooks"
import { useSelector } from 'react-redux'
import Admin from '../adminTools/Admin'
const Login = () => {
  const currentUser: string = useSelector(selectUser)
  const dispatch = useAppDispatch()
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [pwd_confirm, setpwd_confirm] = useState("")
  return (
    // will show login form only if currentUser is empty
    <div>
      {/* ################################### login form ################################### */}
      <div style={currentUser ? { display: "none" } : {}}>
        <h2> Login</h2>
        username:<input type="text" onChange={(e) => setusername(e.target.value)} /><br />
        password<input type="password" onChange={(e) => setpassword(e.target.value)} /><br />
        <button onClick={() => dispatch(loginAsync({ username, password }))}>login</button>
      </div>

      {/* ################################### register form ################################### */}

      <hr />
      <h2>register</h2>
      <input onChange={(e) => setusername(e.target.value)}  placeholder='Email' type={'email'} /><br />
      <input onChange={(e) => setpassword(e.target.value)} placeholder='Password' type='password' /><br />
      <input onChange={(e) => setpwd_confirm(e.target.value)}  placeholder='Confirm Password' type='password' /> <br />
      <button onClick={() => dispatch(registerAsync({ username, password }))}>register</button>


      {/* will show options for admin user - add produts and so on from Admin component  */}
      <div style={currentUser === "admin" ? {} : { display: "none" }}>
        <Admin />
      </div>
    </div>
  )
}

export default Login