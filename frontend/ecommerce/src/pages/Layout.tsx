import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { refreshAsync, selectUser } from "../features/login/loginSlice";
import "./layout.css"

const Layout = () => {
    const currentUser: string = useSelector(selectUser)
    //  refreshes users tokens - need to be fixed - add if condition so that only if token is about to expire so it will run 
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(refreshAsync(localStorage.getItem('refresh')))
    }, [])

    return (
        <>
            <div style={{ margin: "0px" }}>
                <nav className="navigator">
                    <Link className="navBarLink" to="/">Home</Link>
                    <input placeholder="search anything at StarStore" />


                    <div className=" dropDownBtn">
                        <Link className="navBarLink" to="/login">{currentUser ? "Hi " + currentUser : "login"}</Link>
                        <div className="dropContent">
                        <br />   {currentUser && <Link className="navBarLink " to="/logout">Logout</Link>}</div>
                    </div>
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
