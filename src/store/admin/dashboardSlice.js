import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getData } from '../../utils/api'


export const getDashboardData = createAsyncThunk('admin/get-employee', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-employee')
    return response
  } catch (error) {
    console.error('Get employees error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})



const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: [],
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
    state.isLoading = true
     })
    .addCase(getDashboardData.fulfilled, (state, action) => {
    state.isLoading = false
    state.data = action.payload.data
  })
      .addCase(getDashboardData.rejected, (state) => {
    state.isLoading = false
    state.data = []
  })

  },
})

export default dashboardSlice.reducer
