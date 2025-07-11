import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData,getData } from '../utils/api'


export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    console.log(credentials,"credentials")
    const response = await postData('/login', credentials)
    // localStorage.setItem('token', response.token)
    // localStorage.setItem('user', JSON.stringify(response.user)) 
    return response
  } catch (error) {
    console.error(error,"error")
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const verifyUser = createAsyncThunk('/api/verify',async(_,thunkAPI)=>{
try {
  const response = await getData('/common/verify')
  return response
} catch (error) {
  return thunkAPI.rejectWithValue(error.message)
}
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading :true,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user') // remove user on logout too
    },
    setUserFromStorage: (state) => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        state.user = JSON.parse(storedUser)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state, action) => {
      state.isLoading = true;
    }).addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
      state.user = action.payload.user
    }).addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
      state.user = null;
    }).addCase(verifyUser.pending, (state, action) => {
      state.isLoading = true;
    }).addCase(verifyUser.fulfilled, (state, action) => {
        state.isLoading = false; 
      state.user = action.payload.user
    }).addCase(verifyUser.rejected, (state, action) => {
        state.isLoading = false;
      state.user = null;
    })
  },
})

export const { logout, setUserFromStorage } = authSlice.actions
export default authSlice.reducer
