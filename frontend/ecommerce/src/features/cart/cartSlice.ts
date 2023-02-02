import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import {  } from './cartAPI';
import {Cart} from "../../models/Cart"

const initialState: Cart = {
products:[]
};

export const addProdAsync = createAsyncThunk(
  'product/userFetch',
  async (creds:any) => {
    console.log(creds.image.name)
    // const response = await prodFetch(creds);
    // return response.data;
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart:(state,prod)=>{
      state.products.push(prod.payload)

    }

  },

  extraReducers: (builder) => {
    builder
      .addCase(addProdAsync.fulfilled, (state, action) => {
         })
  },
});

export const { addToCart } = cartSlice.actions;
export const selectCart= (state: RootState) => state.cart.products;

export default cartSlice.reducer;
