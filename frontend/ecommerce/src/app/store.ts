import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import productReducer from '../features/adminTools/productSlice';
import cartReducer from '../features/cart/cartSlice';
import loginReducer from '../features/login/loginSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    product: productReducer,
    cart:cartReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
