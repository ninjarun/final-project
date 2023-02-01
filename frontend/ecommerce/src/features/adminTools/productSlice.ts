import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import {prodFetch  } from './productAPI';

export interface ProductSlice {
logged:boolean
userLogged:string
isAdmin:boolean

}

const initialState: ProductSlice = {
logged:false,
userLogged:"",
isAdmin:false
};

export const addProdAsync = createAsyncThunk(
  'product/userFetch',
  async (creds:any) => {
    console.log(creds)
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
         })
  },
});

export const {  } = productSlice.actions;
export const selectUser = (state: RootState) => state.login.userLogged;

export default productSlice.reducer;
