import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type } from 'os';
import { RootState, AppThunk } from '../../app/store';
import MyOrders, { Order } from "../../models/myOrders"
import Product from '../../models/Product';
import Review from '../../models/Review';
import { getReviews } from './reviewAPI';

//  THIS STATE HOLDS ALL THE ORDERS THE USER MADE

const initialState: Review = {
  all_reviews:{}
};

export const getReviewsAsync = createAsyncThunk(
  'Reviews/Reviews',
  async () => {
    console.log('inasync')
    const response = await getReviews();
    return response.data;
  }
);

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // todo - maybe needs to be deleted being done in extra reducer!
    // get_specific_product_review_status: (state, action) => {
    //   const tmpReviews = state.all_reviews
    //   const product_id = action.payload
    //   let total_score = 0
    //   let total_reviews = 0
    //   for (let i = 0; i < state.all_reviews.length; i++) {
    //     console.log('we are finnaly in loop')
    //     console.log(tmpReviews[i].product === product_id)
    //     console.log(tmpReviews[i].rating)
    //     if (tmpReviews[i].product === product_id) {
    //       total_score += tmpReviews[i].rating
    //       total_reviews++
    //     }
    //   }

    //   let final_score = (total_score / total_reviews)
    //   console.log(final_score)
    // },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getReviewsAsync.fulfilled, (state, action) => {
//                   creates an object with all product reatings
      // **********************************************
      
// Use reduce to calculate the sum and count of ratings for each product
const tmpAr=[...action.payload]
const productRatings = tmpAr.reduce((acc:any, curr:any) => {
  const { product, rating } = curr;
  acc[product] = acc[product] || { product, ratingSum: 0, ratingCount: 0 };
  acc[product].ratingSum += rating;
  acc[product].ratingCount++;
  return acc;
}, {});

// Use map to calculate the average rating for each product
const avgRatings = Object.values(productRatings).map((product:any) => ({
  product: product.product,
  avgRating: product.ratingSum / product.ratingCount,
}));

// Output the final list of objects containing the average rating for each product
console.log('checkkkkkkk',avgRatings);
state.all_reviews=avgRatings

      // ************************************************

      })

  },
});

export const {  } = reviewSlice.actions;
// export const selectProducts = (state: RootState) => state.productz.products;
// export const selectOrders = (state: RootState) => state.myOrders.orders;
export const selectAllReviews = (state: RootState) => state.review.all_reviews;

export default reviewSlice.reducer;
