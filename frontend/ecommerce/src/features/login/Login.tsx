import { useState } from 'react'
import { loginAsync,selectUser } from "../login/loginSlice"
import { useAppDispatch } from "../../app/hooks"
import { useSelector } from 'react-redux'
const Login = () => {
  const currentUser:string=useSelector(selectUser)
  const dispatch = useAppDispatch()
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  return (
    // will show login form only if currentUser is empty
    <div style={currentUser?{display:"none"}:{}}>
      Login
      <br />
      username:<input type="text" onChange={(e) => setusername(e.target.value)} /><br />
      password<input type="password" onChange={(e) => setpassword(e.target.value)} /><br />
      <button onClick={() => dispatch(loginAsync({ username, password }))}>login</button>

    </div>
    // TODO --  what to show if user is connected?
  )
}

export default Login