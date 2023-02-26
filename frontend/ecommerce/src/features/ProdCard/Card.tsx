import React from 'react'
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { SERVER } from '../../globalVar';
import Product from '../../models/Product';
import Review from '../../models/Review';
import { removeProdAsync } from '../adminTools/productSlice';
import { addToCart } from '../cart/cartSlice';
import { selectUser } from '../login/loginSlice';
import { selectProdctsOrderd } from '../MyOrders/myOrdersSlice';
import { getReviewsAsync, selectAllReviews } from '../review/reviewSlice';
import "./card.css"
const Card = (props: any) => {

    const dispatch = useAppDispatch()
    const currentUser: string = useSelector(selectUser)
    const productsOrderd: number[] = useSelector(selectProdctsOrderd)
    const all_reviews: any = useSelector(selectAllReviews)
    const handle_remove = async () => {
        await dispatch(removeProdAsync(props.prod.id))
        props.update_products()
    }
    const handleReview = async () => {
        // dispatch(getReviewsAsync())
    }
    const handleReview2 = async () => {
        console.log('print',all_reviews[props.prod.id].avgRating)
        // dispatch(get_specific_product_review_status(props.prod.id))
    }

    // const rating = []
    // let tmpRating = 0
    // if (all_reviews[props.prod.id].avgRating !== undefined) { tmpRating = all_reviews[props.prod.id].avgRating } else {tmpRating=0}
    // for (let i = 1; i <= 5; i++) {
        // console.log(i);
        // if (i > tmpRating) { rating.push(1) } else { rating.push(0) }

    // }
    // console.log(all_reviews[props.prod.id].avgRating)


    return (
        <div className='main'>
            <div className='img_container'>
                <img src={`${SERVER}static${props.img}`} alt="Bootstrap" width="120px" height="120px" />
                <div onClick={() => dispatch(addToCart(props.prod))} className='add2cart_btn '>+ Add</div>
                {productsOrderd.includes(props.prod.id) && <div onClick={handleReview} className='add2cart_btn' style={{ background: 'green' }} >Review</div>}
                <div onClick={handleReview2} className='add2cart_btn' style={{ background: 'green' }} >Review</div>
                <div style={currentUser == 'admin' ? { backgroundColor: "red" } : { display: "none" }} onClick={handle_remove} className='add2cart_btn '>rmv prod</div>
            </div>
            <div className='details_container'>
                <strong>
                    {props.price}<br />
                    {props.name}<br />
                    {props.desc}<br />
                    <br />


                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>


                </strong>
            </div>
            <div className='icon'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                </svg>
            </div>
        </div>
    )
}


export default Card

