import { useSelector } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import { selectUser } from "../features/login/loginSlice";
import "./layout.css"

const Layout = () => {
    const currentUser: string = useSelector(selectUser)
    console.log(currentUser)
    return (
        <>
            <div style={{ margin: "0px" }}>
                <nav className="navigator">
                    {currentUser == "admin" && <Link className="navBarLink" to="/admin">admin</Link>}
                    <Link className="navBarLink" to="/">Home</Link>
                    <input  placeholder="search anything at StarStore" />
                    <Link className="navBarLink" to="/login">{currentUser ? "Hi " + currentUser : "login"}</Link>
                    <Link className="navBarLink" to="/wishlist">wishlist</Link>
                    <Link className="navBarLink" to="/cart">Cart</Link>
                </nav>
                <hr />
                <Outlet />
            </div>
        </>
    )
};

export default Layout;
