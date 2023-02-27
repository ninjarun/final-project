import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../app/hooks'
import { addToCart } from '../features/cart/cartSlice'
import { getAllProductsAsync, selectProducts } from '../features/Home/manyProductsSlice'
import { SERVER } from '../globalVar'
import './searchBar.css'
const SearchBar = () => {
    const dispatch = useAppDispatch()

    const [Search, setSearch] = useState("")
    useEffect(() => {
        dispatch(getAllProductsAsync(true))
    }, [])
    const prods = useSelector(selectProducts)
    return (
        <div>
            <div>

                <input list="mylist" className="searchBar" placeholder="search anything at StarStore" onChange={(e) => setSearch(e.target.value)} />
                <div style={Search.length > 0 ? { display: "block" } : { display: 'none' }} className=" dropContent_search">
                    {prods.results && prods.results.map((x: any, i: number) =>
                        x.name.includes(Search) ? (
                            <div key={i}>
                                <img src={`${SERVER}static${x.image}`} alt="Bootstrap" width="80px" height="80px" />
                                <div  >{x.name} {x.price}&#8362;</div>
                                <div onClick={() => dispatch(addToCart(x))} >+ Add</div>
                            </div>
                        ) : null
                    )}                </div>
            </div>
        </div>
    )
}

export default SearchBar
