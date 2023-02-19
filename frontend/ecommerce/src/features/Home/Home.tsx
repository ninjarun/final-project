import axios from 'axios';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../cart/cartSlice';
import Card from '../ProdCard/Card';
import { SERVER } from '../../globalVar';
import Product from '../../models/Product';
import { getAllProductsAsync, selectProducts } from './manyProductsSlice';

const Home = () => {
  const dispatch = useAppDispatch()
  const prods = useSelector(selectProducts)
  const [flag, setflag] = useState(false)

  useEffect(() => {
    dispatch(getAllProductsAsync())
  }, []);


  return (
    <div style={{ justifyContent: 'center', display: "flex", flexWrap: 'wrap' }}>
      {prods.map((p: Product, i) => (
        <div style={{ flex: "0 0 33%", minWidth: "300px", maxWidth: "350px" }} key={i}>
          <Card update_products={()=> dispatch(getAllProductsAsync())} prod={p} name={p.name} img={p.image} price={p.price} desc={p.description}></Card>
        </div>
      ))}

    </div>
  )
}

export default Home

