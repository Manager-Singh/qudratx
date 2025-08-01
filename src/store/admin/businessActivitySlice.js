import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData, deleteData, putData } from '../../utils/api'

// CREATE activity (with file upload)
export const addBusinessActivity = createAsyncThunk('admin/create-activity', async (data, thunkAPI) => {
  try {
    const response = await postData('/admin/create-activity', data, true) // 'true' if multipart/form-data
    return response
  } catch (error) {
    console.error('Create error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

// GET all activities
export const getBusinessActivities = createAsyncThunk('admin/get-activity', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-activity')
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

// GET activity by UUID
export const getBusinessActivityByUuid = createAsyncThunk('admin/get-activity-by-uuid', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-activity-by-uuid/${uuid}`)
    return response
  } catch (error) {
    console.error('Get by UUID error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

// UPDATE activity
export const updateBusinessActivity = createAsyncThunk('admin/update-activity', async ({ uuid, data }, thunkAPI) => {
  try {
    const response = await putData(`/admin/update-activity/${uuid}`, data)
    return response
  } catch (error) {
    console.error('Update error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

// DELETE activity
export const deleteBusinessActivity = createAsyncThunk('admin/delete-activity', async (uuid, thunkAPI) => {
  try {
    const response = await deleteData(`/admin/delete-activity/${uuid}`)
    return { uuid, ...response }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

// GET deleted activities
export const getDeletedBusinessActivities = createAsyncThunk('admin/get-deleted-activity', async (_, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-deleted-activity`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

// GET activity by UUID
export const getBusinessActivityByAuthorityId = createAsyncThunk(
  'admin/get-activity-authority-id',
  async ({ authority_id, page, limit}, thunkAPI) => {
    try {
      const response = await getData(`/admin/get-activity-by-authority/${authority_id}?page=${page}&limit=${limit}`)
      return response
    } catch (error) {
      console.error('Get by Authority ID error:', error)
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)



const businessActivitySlice = createSlice({
  name: 'business_activity',
  initialState: {
    business_activities:[],
    business_activity: null,
    deleted_activities: [],
    isActivityLoading: false,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBusinessActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addBusinessActivity.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_activities.push(action.payload.data)
      })
      .addCase(addBusinessActivity.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(getBusinessActivities.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBusinessActivities.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_activities = action.payload.data
      })
      .addCase(getBusinessActivities.rejected, (state) => {
        state.isLoading = false
        state.business_activities = []
      })

      .addCase(deleteBusinessActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteBusinessActivity.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_activities = state.business_activities.filter(item => item.uuid !== action.uuid)
      })
      .addCase(deleteBusinessActivity.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(updateBusinessActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateBusinessActivity.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload.data
        const index = state.business_activities.findIndex(item => item.uuid === updated.uuid)
        if (index !== -1) {
          state.business_activities[index] = updated
        }
      })
      .addCase(updateBusinessActivity.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(getBusinessActivityByUuid.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBusinessActivityByUuid.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_activity = action.payload.data
      })
      .addCase(getBusinessActivityByUuid.rejected, (state) => {
        state.isLoading = false
        state.business_activity = null
      })

      .addCase(getDeletedBusinessActivities.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDeletedBusinessActivities.fulfilled, (state, action) => {
        state.isLoading = false
        state.deleted_activities = action.payload.data
      })
      .addCase(getDeletedBusinessActivities.rejected, (state) => {
        state.isLoading = false
        state.deleted_activities = [];
      }).addCase(getBusinessActivityByAuthorityId.pending, (state) => {
         state.isActivityLoading = true;
       })
    .addCase(getBusinessActivityByAuthorityId.fulfilled, (state, action) => {
      state.isActivityLoading = false;
      state.business_activities = action.payload.data || [];
    })
    .addCase(getBusinessActivityByAuthorityId.rejected, (state) => {
      state.isActivityLoading = false;
      state.business_activities = [];
    })
      },
})

export default businessActivitySlice.reducer
