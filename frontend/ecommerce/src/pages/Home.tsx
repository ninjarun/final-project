import axios from 'axios';
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { refreshAsync } from '../features/login/loginSlice';
import { SERVER } from '../globalVar';
import Product from '../models/Product';

const Home = () => {
  const [prods, setProds] = useState([]);
  const dispatch = useAppDispatch()

  //  refreshes users tokens - need to be fixed - add if condition so that only if token is about to expire so it will run 
  useEffect(() => {
   dispatch(refreshAsync(localStorage.getItem('refresh')))
  }, [])

  // gets all products on start needs to be moved to product reducer
  useEffect(() => {
    axios.get(SERVER + "myProducts").then((res) => setProds(res.data));
  }, []);


  const handleAddToCart = (prod: Product) => {
    dispatch(addToCart(prod))
  }

  return (
    <div style={{ display: "flex", flexWrap: 'wrap' }}>
      {/* needs to be transfered into CARD  */}
      {prods.map((p: Product, i) => (
        <div style={{ flex: "0 0 20%" }} key={i}>
          <img height={100} width={70} src={`${SERVER}static${p.image}`} />
          <br />{p.name} {p.price}
          <br />{p.description}
          <br /> <button onClick={() => handleAddToCart(p)}>add</button>
        </div>
      ))}

    </div>
  )
}

export default Home