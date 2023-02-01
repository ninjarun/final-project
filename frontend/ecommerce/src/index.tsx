import { Provider } from 'react-redux';
import { store } from './app/store';

import ReactDOM, { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./features/login/Login";
import Cart from './features/cart/Cart';
import WishList from './features/wishList/WishList';
import Admin from './features/adminTools/Admin';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="admin" element={<Admin />} />
            <Route index element={<Home />} />
              <Route path="wishlist" element={<WishList />} />
              <Route path="login" element={<Login />} />
              <Route path="cart" element={<Cart />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
const container = document.getElementById('root')!;
const root = createRoot(container)
root.render(<App />);






// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { store } from './app/store';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const container = document.getElementById('root')!;
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
