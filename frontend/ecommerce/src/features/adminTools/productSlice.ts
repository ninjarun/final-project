import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import {prodFetch  } from './productAPI';
import Product from "../../models/Product"


const initialState: Product = {
    name:"",
    description:"",
    price:0,
    image:""

};

export const addProdAsync = createAsyncThunk(
  'product/userFetch',
  async (creds:any) => {
    console.log(creds.image.name)
    const response = await prodFetch(creds);
    return response.data;
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {

  },

  extraReducers: (builder) => {
    builder
      .addCase(addProdAsync.fulfilled, (state, action) => {
        console.log(action.payload)
         })
  },
});

export const {  } = productSlice.actions;
export const selectUser = (state: RootState) => state.login.userLogged;

export default productSlice.reducer;
