import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData } from '../../utils/api'

export const addEmployee = createAsyncThunk('admin/create-employee', async (credentials, thunkAPI) => {
  try {
    const response = await postData('/admin/create-employee', credentials)
    return response
  } catch (error) {
    console.error('Create employee error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getEmployees = createAsyncThunk('admin/get-employee', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-employee')
    return response
  } catch (error) {
    console.error('Get employees error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.isLoading = false
        state.employees = action.payload.data
      })
      .addCase(getEmployees.rejected, (state) => {
        state.isLoading = false
        state.employees = []
      })
  },
})

export default employeeSlice.reducer
