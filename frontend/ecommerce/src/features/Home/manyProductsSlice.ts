import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import Products from "../../models/manyProducts"

import { getAllProducts } from './manyProductsAPI';


const initialState: Products = {
  products: [],
  categories: []
};



export const getAllProductsAsync = createAsyncThunk(
  'products/getAllProducts',
  async () => {
    console.log('inasync')
    const response = await getAllProducts();
    return response.data;
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // todo
    // getProductByCategory: (state, action) => {    },



  },

  extraReducers: (builder) => {
    builder

      .addCase(getAllProductsAsync.fulfilled, (state, action) => {
        console.log(action.payload)
          state.products = action.payload
          state.products.forEach((e)=>
         { !state.categories.includes(e.category) &&  state.categories.push(e.category)}
          )
          console.log('mycategories',state.categories)
        })
      },
});

export const { } = productsSlice.actions;
export const selectProducts = (state: RootState) => state.productz.products;
export const selectCategories = (state: RootState) => state.productz.categories;

export default productsSlice.reducer;
