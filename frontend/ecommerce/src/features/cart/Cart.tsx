import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { prodFetch } from '../adminTools/productAPI'
import { change_amount, selectCart } from './cartSlice'
import "./cart.css"
import Product from '../../models/Product'
import { useAppDispatch } from '../../app/hooks'
import { remove_prod_cart } from "./cartSlice"

const Cart = () => {

  const cart = useSelector(selectCart)
  const dispatch = useAppDispatch()
  const [total, settotal] = useState(0)
  useEffect(() => {
    let tmp: number = 0
    cart.forEach(x => tmp = tmp + x.price * x.amount)
    settotal(tmp)
  }, [cart])


  // const tmp:Product[]=cart.forEach((prod)=> )

  return (
    <div style={{ display: "flex", margin: "auto" }}>
      <div className='items_list'>
        {cart.map((prod, i) =>
          <div className='product_field' key={i}>
            <span onClick={() => dispatch(remove_prod_cart(prod))}>remove item from cart</span><br />
            <span onClick={() => dispatch(change_amount({ "id": prod.id, 'amount': -1 }))}>-</span>
            {prod.amount}
            <span onClick={() => dispatch(change_amount({ "id": prod.id, 'amount': 1 }))}>+</span><br />
            {prod.name} {prod.price}
          </div>)
        }
      </div>
      <div className='order_summary'>
        <h3>Summary</h3>
        <h5>Tottal {total}</h5>


      </div>

    </div>
  )
}

export default Cart