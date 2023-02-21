import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import MyOrders from "../../models/myOrders"
import { getOrders } from './myOrderAPI';

//  THIS STATE HOLDS ALL PRODUCTS AND THEIR CATEGORIES 

const initialState: MyOrders = {
  orders: []
};



export const userOrdersAsync = createAsyncThunk(
  'myorder/usersOrders',
  async () => {
    console.log('inasync')
    const response = await getOrders();
    return response.data;
  }
);

export const myOrdersSlice = createSlice({
  name: 'myOrders',
  initialState,
  reducers: {
    // todo
    // getProductByCategory: (state, action) => {    },



  },

  extraReducers: (builder) => {
    builder

      .addCase(userOrdersAsync.fulfilled, (state, action) => {
        console.log(action.payload)
        state.orders=[...action.payload]
      })
  },
});

export const { } = myOrdersSlice.actions;
// export const selectProducts = (state: RootState) => state.productz.products;
export const selectOrders = (state: RootState) => state.myOrders.orders;

export default myOrdersSlice.reducer;
