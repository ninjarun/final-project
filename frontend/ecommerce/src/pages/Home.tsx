import axios from 'axios';
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import Card from '../features/ProdCard/Card';
import { SERVER } from '../globalVar';
import Product from '../models/Product';

const Home = () => {
  const [prods, setProds] = useState([]);
  const dispatch = useAppDispatch()


  // // gets all products on start needs to be moved to product reducer
  useEffect(() => {
    axios.get(SERVER + "myProducts").then((res) => setProds(res.data));
  }, []);


  const handleAddToCart = (prod: Product) => {
    dispatch(addToCart(prod))
  }

  return (
    <div style={{justifyContent:'center', display: "flex", flexWrap: 'wrap' }}>
      {prods.map((p: Product, i) => (
        <div style={{ flex: "0 0 33%",minWidth:"300px", maxWidth:"350px" }} key={i}>
          <Card prod={p} name={p.name} img={p.image} price={p.price} desc={p.description}></Card>
        </div>
      ))}

    </div>
  )
}

export default Home

