import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { userFetch } from './loginAPI';
import jwt_decode from "jwt-decode"

export interface LoginSlice {
logged:boolean
userLogged:string
isAdmin:boolean

}

const initialState: LoginSlice = {
logged:false,
userLogged:"",
isAdmin:false
};

export const loginAsync = createAsyncThunk(
  'login/userFetch',
  async (creds:any) => {
    const response = await userFetch(creds);
    return response.data;
  }
);

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {

  },

  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        const tmp:any= jwt_decode( action.payload.access)
        state.userLogged=tmp.username
        {tmp.username=="admin" ? state.isAdmin=true : state.isAdmin=false}  
         })
  },
});

export const {  } = loginSlice.actions;
export const selectUser = (state: RootState) => state.login.userLogged;

export default loginSlice.reducer;
