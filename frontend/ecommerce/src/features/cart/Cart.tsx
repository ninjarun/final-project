import React from 'react'
import { useSelector } from 'react-redux'
import { prodFetch } from '../adminTools/productAPI'
import { selectCart } from './cartSlice'

const Cart = () => {

  const cart=useSelector(selectCart)

return (
    <div >Cart
      {cart.map((prod,i)=><div key={i}>{prod.name}</div>)}
    </div>
  )
}

export default Cart