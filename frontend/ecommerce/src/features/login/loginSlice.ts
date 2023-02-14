import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { refreshUser, userFetch, userRegister } from './loginAPI';
import jwt_decode from "jwt-decode"

export interface LoginSlice {
  logged: boolean
  userLogged: string
  isAdmin: boolean
  userID:string
}

const initialState: LoginSlice = {
  logged: false,
  userLogged: "",
  isAdmin: false,
  userID:""

};

export const loginAsync = createAsyncThunk(
  'login/userFetch',
  async (creds: any) => {
    const response = await userFetch(creds);
    console.log('here',response.data)
    return response.data;

  }
);

export const registerAsync = createAsyncThunk(
  'register/regUser',
  async (creds: any) => {
    const response = await userRegister(creds);
    return response.data;
  }
);

export const refreshAsync = createAsyncThunk(
  'refresh/irefresh',
  async (refresh: any) => {
    console.log("here!",refresh)
    const response = await refreshUser(refresh);
    return response.data;
  }
);


export const logoutAsync = createAsyncThunk(
  'logout/logout',
  async (token: any) => {
    console.log("here!")
    const response = await refreshUser(token);
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
        console.log("newnewnew",action)
        localStorage.setItem('refresh', action.payload.refresh)
        const tmp: any = jwt_decode(action.payload.access)
        state.userLogged = tmp.username
        console.log('hihihiih',tmp.user_id)
        state.userID=tmp.user_id
        { tmp.username == "admin" ? state.isAdmin = true : state.isAdmin = false }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        console.log('falied failed failded')
        console.log(action)


      })
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      .addCase(registerAsync.fulfilled, (state, action) => {
        // localStorage.setItem('refresh', action.payload.refresh)
        // const tmp: any = jwt_decode(action.payload.access)
        // state.userLogged = tmp.username
        // { tmp.username == "admin" ? state.isAdmin = true : state.isAdmin = false }
        console.log(action.payload)
      })

      .addCase(refreshAsync.fulfilled, (state, action) => {
        console.log(action.payload)
        localStorage.setItem('refresh',action.payload.refresh)
        const tmp: any = jwt_decode(action.payload.access)
        state.userLogged = tmp.username
        state.userID=tmp.user_id

        { tmp.username == "admin" ? state.isAdmin = true : state.isAdmin = false }
      })

      .addCase(logoutAsync.fulfilled, (state, action) => {
        console.log(action.payload)
        const tmp: any = jwt_decode(action.payload.access)
        state.userLogged = ""
        { tmp.username == "admin" ? state.isAdmin = true : state.isAdmin = false }
      })
  },
});

export const { } = loginSlice.actions;
export const selectUser = (state: RootState) => state.login.userLogged;
export const selectUserID = (state: RootState) => state.login.userID;

export default loginSlice.reducer;
