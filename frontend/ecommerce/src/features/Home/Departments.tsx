import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Card from '../ProdCard/Card'
import { getAllProductsAsync, selectCategories, selectProducts } from './manyProductsSlice'
import Product from '../../models/Product';
import { useAppDispatch } from '../../app/hooks';

const Departments = () => {
    const prods = useSelector(selectProducts)
    const cats = useSelector(selectCategories)
    const dispatch = useAppDispatch()

    const [selectedCat, setselectedCat] = useState("")

    useEffect(() => {
    dispatch(getAllProductsAsync(true))

    console.log('department',prods)

    }, [])
    
    return (
        <div>
            <div>
                {cats.map((cat: string, i) => (<div key={i}>
                    <div onClick={() => setselectedCat(cat)}>
                        {cat}
                    </div>
                </div>))}
            </div>


            <div style={{ justifyContent: 'center', display: "flex", flexWrap: 'wrap' }}>
                {prods.results && prods.results.map((p: Product, i: any) => {
                    if (p.category === selectedCat) {
                        return (
                            <div style={{ flex: "0 0 33%", minWidth: "300px", maxWidth: "350px" }} key={i}>
                                <Card prod={p} name={p.name} img={p.image} price={p.price} desc={p.description}></Card>
                            </div>
                        );
                    }
                    return null;
                })}

            </div>

        </div>
    )
}

export default Departments



