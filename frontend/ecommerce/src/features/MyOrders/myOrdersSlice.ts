import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import MyOrders, { Order } from "../../models/myOrders"
import Product from '../../models/Product';
import { getOrders } from './myOrderAPI';

//  THIS STATE HOLDS ALL PRODUCTS AND THEIR CATEGORIES 

const initialState: MyOrders = {
  orders: [],
  productsOrderd: []
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
        state.orders = [...action.payload]
        state.orders.forEach((order: any) => {
          order.orderItems.forEach((product: Product) => {
            if (product.id) {
              const tmpID = product.id
              { !state.productsOrderd.includes(tmpID) && state.productsOrderd.push(tmpID) }
            }
          });
        });
      })
  },
});

export const { } = myOrdersSlice.actions;
// export const selectProducts = (state: RootState) => state.productz.products;
export const selectOrders = (state: RootState) => state.myOrders.orders;
export const selectProdctsOrderd = (state: RootState) => state.myOrders.productsOrderd;

export default myOrdersSlice.reducer;
