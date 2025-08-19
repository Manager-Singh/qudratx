import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getData, postData } from '../../utils/api'

// Get all notifications
export const getNotifications = createAsyncThunk('admin/get-notifications', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-notifications')
    return response
  } catch (error) {
    console.error('Get Notifications Error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})
export const readNotification = createAsyncThunk('admin/mark-as-read', async (data, thunkAPI) => {
  try {
    const response = await postData('/admin/mark-as-read',data)
    return response
  } catch (error) {
    console.error('Get Notifications Error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.notifications = action.payload.data
      })
      .addCase(getNotifications.rejected, (state) => {
        state.isLoading = false
        state.notifications = []
      })
  },
})

export default notificationSlice.reducer
